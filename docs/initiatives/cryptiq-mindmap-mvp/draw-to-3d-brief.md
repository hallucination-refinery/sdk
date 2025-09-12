# Draw‑to‑3D Replication Brief (App‑first, SDK‑aware)

> See also: `mindmap-experience-vision.md` for the high-level experience bullets and verbatim transcript.

## 1) What we’re shipping (goal)

- A minimal, robust “draw → recognize → show 3D formation” loop that runs well on mobile and desktop.
- Implement it inside the Cryptiq Mindmap app (`apps/cryptiq-mindmap-demo`) first, then promote stable parts into the Refinery SDK.

## 2) Context and constraints

- No model training. Use a pre‑trained doodle classifier (DoodleNet via ml5.js) that accepts 28×28 grayscale input and returns 345‑class labels with confidences.
- No 3D generation. Render pre‑made, tiny formations (JSON arrays of points) using Three.js/R3F and a single InstancedMesh for performance.
- Mobile‑first. Optimize for fast model load, low memory, 30–60 FPS, and responsive touch.
- Keep Repo WIP reality in mind: the SDK is evolving; do not entangle this MVP with SDK internals until the app path is proven.

## 3) Cross‑reference against the repo

- App: `apps/cryptiq-mindmap-demo` (Next.js) is the correct integration point; we will add an `app/draw3d` route and components.
- R3F/InstancedMesh: patterns exist in `packages/canvas-r3f` (e.g., `ConceptParticles.tsx`) proving viability. For speed, implement a lean InstancedMesh renderer directly in the app; later extract to SDK.
- CI: minimal baseline exists; docs workflow is disabled (good—keeps CI fast). We can add a smoke check for the new route later.

## 4) External signals (design choices)

- DoodleNet (ml5.js) is a browser‑friendly QuickDraw classifier; start with a CDN script to avoid bundling friction and measure load/latency.
- InstancedMesh is the right primitive for hundreds of spheres with one draw call; avoid post‑processing on mobile.

## 5) Architecture overview

- Pipeline: Full‑viewport transparent overlay collects a multi‑stroke session → **strict** auto‑commit after 3000ms idle → preprocess to 28×28 via `make28x28Canvas` → ml5.js DoodleNet classify (`k=5`, curated‑first via `normalizeLabel`) → map label to formation JSON at `/formations/<label>.json`; if the normalized label is `unknown`, the stroke cloud itself is used as the target; if a curated label fetch fails, fall back to a simple ring → transition: strokes fade to gray (CSS `.stroke-fade`, 300ms) → 200ms hold → point‑cloud morph to InstancedMesh reveal (≈500ms), scaled to the drawn bbox (center‑out reveal).
- Data: Curated categories (current set): `apple, balloon, bird, boat, book, car, cat, cup, fish, flower, glasses, heart, house, moon, phone, plane, shoe, star, sun, tree, umbrella`. Formation JSONs are expected under `apps/cryptiq-mindmap-demo/public/formations/<label>.json` (normalized −1..1 in X/Y/Z). If absent, a ring fallback is used when a curated label is selected.
- Rendering: Single InstancedMesh (spheres). Mobile/desktop instance caps are env‑driven (`NEXT_PUBLIC_DRAW3D_MOBILE_CAP`, `NEXT_PUBLIC_DRAW3D_DESKTOP_CAP`; defaults 200 / 20000). Canvas2D DPR clamps to 1.5; R3F clamps DPR to ≤2 with lean `meshBasicMaterial` (no post‑processing).

## 6) Detailed implementation plan (step‑by‑step)

### 0) Route & scaffolding (0.5h)

- Create `apps/cryptiq-mindmap-demo/app/draw3d/page.tsx` with a 3D view and a full‑viewport transparent drawing overlay.
- Show small status HUD: Ready/Loading, FPS, last inference ms.

### 1) Drawing canvas (1.5h)

- `app/draw3d/modules/canvas/DoodleCanvas.tsx`:
  - Full‑viewport transparent overlay capturing multiple strokes; `preventDefault()` to avoid scroll.
  - Simple smoothing (quadratic interpolation of last→midpoint); strokes remain visible until recognition; fade to gray occurs only during the transition via CSS class.
  - Multi‑stroke session with `clear()` and `undo()`; commit is strictly auto‑only via idle timer.
  - Auto‑commit fires after 3000ms inactivity; coalesces while drawing; single in‑flight guard.
  - `make28x28Canvas(canvas): HTMLCanvasElement` (center/crop/scale + grayscale)

### 2) DoodleNet (ml5.js) integration (1h)

- Dynamic script injection pinned to `ml5@0.12.2` (no static `<script>` in the page head).
- `app/draw3d/modules/ml/doodlenet.ts` wrapper:
  - `loadDoodleNet(): Promise<Classifier>` (memoized singleton)
  - `classify(canvas, k = 5): Promise<Array<{ label: string; confidence: number }>>`
- Measure model load time and classify latency; display in HUD.

### 3) Category curation & label map (0.5h)

- `app/draw3d/modules/data/labelMap.ts`: curated set listed above with simple aliases (e.g., `ship→boat`, `cellphone→phone`, `mug→cup`).
- `normalizeLabel(raw, topK)` selects the first curated label from top‑5 predictions; otherwise returns `unknown`. `unknown` uses the stroke‑cloud (not a ring). Ring fallback is only used when a curated label is selected but formation JSON fetch fails.

### 4) Formation data & loader (1h)

- `apps/cryptiq-mindmap-demo/public/formations/<label>.json` with `{ positions: number[] | number[][] }` normalized to −1..1 around origin.
- Active loader: inline `fetchFormation()` in `app/draw3d/modules/AppHost.tsx` (with caching). `app/draw3d/modules/data/useFormation.ts` exists but is not wired into the main flow.

### 5) InstancedMesh renderer (2h)

- `app/draw3d/modules/renderer/MorphFormationView.tsx` (R3F):
  - Single `InstancedMesh` (sphereGeometry radius ≈0.045, 6×6 segs) with `meshBasicMaterial` (no tone mapping, transparent allowed).
  - Convert positions → `Float32Array`; update instance matrices; center‑out reveal by radius gating; optional bounce.
  - Performance: cap instances using env caps (defaults 200 mobile / 20000 desktop); R3F `Canvas` `dpr={[1,2]}` and runtime DPR clamp ≤2; no post effects.

### 6) Transition system (1h)

- On commit: strokes fade to gray over 300ms (CSS) → 200ms pause → point‑cloud morph ≈500ms with center‑out reveal; bounce enabled for curated formations and disabled for `unknown`.

### 7) Wire page logic (0.5h)

- In `page.tsx`/`AppHost.tsx`: auto‑commit the current multi‑stroke session after 3000ms idle (no manual path). After commit, preprocess + classify (`k=5`, curated‑first). Fetch formation → compute `fitScale` from drawn bbox → render. `unknown` uses the stroke‑cloud; curated fetch failure falls back to a ring.
- The HUD shows `ready`, `load`, `infer`, `fps`, `instances`; Auto/Classify controls are enabled only when `NEXT_PUBLIC_DRAW3D_DEBUG_UI=1` or `?debug` is present.

### 8) Metrics & guardrails (0.5h)

- HUD: load time, inference ms, FPS, instances. Logs: `[strokeEnd]` → `[timerScheduled 3000ms]` → `[timerFired]` → `[commitFired]` → `pre/load/infer` timings; `[gateRejected]` when ink thresholds fail.
- Ink gates: `area > 1024`, `length > 80`, and bbox `width,height ≥ 32`.
- Stroke‑cloud sampling: `rasterToCloud(threshold≈200, gridStride≈4, minCount≈200)` with jitter; resampled to ≤256 points if overly dense.
- Model loading is lazy (first inference). No explicit confidence gate is currently applied.

### 9) Content production loop (ongoing)

- Seed formation JSONs under `apps/cryptiq-mindmap-demo/public/formations/` as they are produced (normalized −1..1). Keep formation sources (procedural scripts or exports) under `apps/cryptiq-mindmap-demo/scripts/formations/`.

### 10) Verification & smoke (0.5h)

- Build app and manually visit `/draw3d` locally and on a phone.
- Later add a Playwright smoke that only boots the route (no inference) to keep CI fast.

## 7) File structure (MVP)

```
apps/cryptiq-mindmap-demo/
  app/draw3d/
    page.tsx
    styles/draw3d.css
    modules/
      AppHost.tsx
      ui/HUD.tsx
      canvas/DoodleCanvas.tsx
      canvas/preprocess.ts
      canvas/rasterToCloud.ts
      data/labelMap.ts
      data/useFormation.ts
      ml/doodlenet.ts
      renderer/MorphFormationView.tsx
      renderer/perf.ts
```

## 8) Risks & mitigations

- **Model size on mobile**: lazy‑load; rely on CDN cache; keep rest of page usable.
  - **Recognition accuracy**: `k=5` curated‑first selection; no explicit confidence gate yet; log top‑k and normalized label for diagnostics.
- **Cloud sampling sparsity**: threshold/stride may yield 0 points on light ink; enforce `minCount≈200`, consider adaptive thresholds and resampling.
- **Rendering perf**: cap instances, clamp DPR (2D: 1.5, R3F: ≤2), lean materials; avoid post effects.
- **Context loss**: partial handling (explicit `onContextLost` only in a non‑default view); context loss may occur on `Clear`.
- **Premature/late commits**: idle‑timer coalescing, single in‑flight guard, minimum ink gates (bbox/length/area), and explicit instrumentation logs.

## 9) Success metrics (MVP)

- Auto‑commit fires 3000ms after last stroke with no manual path; exactly one commit per session; Ready ≤ 4s first run; subsequent commits inference typically ≤ 200ms.
- Strokes fade (300ms) → 200ms hold → center‑out morph to reveal (≈500ms); formation scaled to drawn bbox; ≥30 FPS at ~200–256 spheres on an iPhone‑class device.
- Smooth touch drawing; no inadvertent scrolling.

## 10) App vs SDK extraction (post‑MVP)

- Extract `FormationView` into `@refinery/canvas-r3f/draw3d` with an app‑agnostic API.
- Extract preprocess + classify into `@refinery/input-hub/doodle` (or a slim `@refinery/ml-bridges`).
- Provide a `DrawTo3D` reference widget and example.

## 11) Immediate next actions (today)

1. Seed initial formation JSONs under `public/formations/` for curated labels.
2. Harden cloud sampling (adaptive threshold/stride; guaranteed min‑count) and log cloud/target counts.
3. Add explicit context‑loss prevention/handlers to `MorphFormationView` and avoid remounts.
4. Add a CI‑safe smoke that boots `/draw3d` (no inference).

## 12) Readiness & Runbook

- **Integration seam**: `AppHost` exposes `onResult(result)` after each commit so host apps can receive the normalized label, confidence, counts, timings, and formation fit.
- **Formation asset spec**: curated labels resolve to `/formations/<label>.json` with `{ positions: number[] | number[][] }` normalized to `-1..1`.
- **Trace fields & collection**: running with `?trace=1` records `strokeEnd`, timer events, `raster` (`threshold`,`stride`,`minCount`), `classify` (`normalized`,`topK`), and `morph` (`targetCount`,`visibleCount`,`fitScale`,`env.dpr`,`fps`).
- **Prod sanity checklist**: ensure no WebGL context loss, traces log actual raster config, formations load for curated labels, and `/draw3d` sustains ≥30 FPS on a phone.
