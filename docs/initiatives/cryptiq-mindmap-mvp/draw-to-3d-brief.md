# Draw‑to‑3D Replication Brief (App‑first, SDK‑aware)

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
- Pipeline: Draw on a 280×280 canvas → preprocess to 28×28 → ml5.js DoodleNet classify → label map → fetch formation JSON → render with InstancedMesh → short cross‑fade.
- Data: Curate ~30 categories (subset of 345). Store normalized point clouds under `public/formations/<label>.json` (≤ 10 KB each).
- Rendering: Single InstancedMesh (spheres), 200–320 instances; DPR clamp and lean materials for mobile.

## 6) Detailed implementation plan (step‑by‑step)

### 0) Route & scaffolding (0.5h)
- Create `apps/cryptiq-mindmap-demo/app/draw3d/page.tsx` with a two‑pane layout (canvas + 3D view; stacked on mobile).
- Show small status HUD: Ready/Loading, FPS, last inference ms.

### 1) Drawing canvas (1.5h)
- `app/draw3d/DoodleCanvas.tsx`:
  - 280×280 canvas, touch + mouse; `preventDefault()` to avoid scroll.
  - Simple smoothing (lerp last→current), black stroke on white background.
  - Export helpers:
    - `get28x28Gray(canvas): Uint8ClampedArray` (center/crop/scale; 0–255 grayscale)
    - `clear()`, optional `undo()`

### 2) DoodleNet (ml5.js) integration (1h)
- Start with `<script src="https://unpkg.com/ml5@latest/dist/ml5.min.js"></script>` in the page head; later switch to dynamic import if needed.
- `app/draw3d/doodlenet.ts` wrapper:
  - `loadDoodleNet(): Promise<Classifier>` (memoized singleton)
  - `classify(canvas): Promise<Array<{ label: string; confidence: number }>>`
- Measure model load time and classify latency; display in HUD.

### 3) Category curation & label map (0.5h)
- `app/draw3d/labelMap.ts`: choose ~30 high‑signal categories (e.g., cat, tree, house, car, balloon, flower, fish, bird, cup, phone, star, sun…).
- Map from DoodleNet label → formation id; define fallback "unknown".

### 4) Formation data & loader (1h)
- `public/formations/<label>.json` with `{ positions: number[][] }` normalized to −1..1 in X/Y/Z around origin (150–300 points).
- `app/draw3d/useFormation.ts` loads JSON and memoizes; small procedural fallback if missing.

### 5) InstancedMesh renderer (2h)
- `app/draw3d/FormationView.tsx` (R3F):
  - Single `InstancedMesh` with shared `SphereGeometry` (low segments) and `MeshBasicMaterial` (or lean `MeshStandardMaterial`, no shadows/tone mapping).
  - Convert positions → `Float32Array`; set instance matrices; optional per‑instance color.
  - Mobile perf: cap instances (e.g., 240 mobile / 320 desktop); clamp DPR (`Math.min(1.5, window.devicePixelRatio)`); no post effects.

### 6) Transition system (1h)
- On new label, cross‑fade via per‑instance scale/alpha over 250–400 ms while reusing buffers (avoid GC churn). Debounce rapid reclassify.

### 7) Wire page logic (0.5h)
- In `page.tsx`: load classifier on mount; show Ready when loaded. On `touchend` (or button), preprocess + classify; apply confidence gate (e.g., ≥ 0.25). Fetch formation → render.
- Optional: show top‑2 labels unobtrusively.

### 8) Metrics & guardrails (0.5h)
- HUD: load time, inference ms, FPS.
- Failure paths: retry model load with backoff; show friendly error; never block canvas interaction while downloading.

### 9) Content production loop (ongoing)
- Seed with 10 formations (cat/house/tree/balloon/flower/car/bird/fish/phone/cup); expand to 30.
- Keep formation sources (procedural scripts or exports) under `apps/cryptiq-mindmap-demo/scripts/formations/`.

### 10) Verification & smoke (0.5h)
- Build app and manually visit `/draw3d` locally and on a phone.
- Later add a Playwright smoke that only boots the route (no inference) to keep CI fast.

## 7) File structure (MVP)
```
apps/cryptiq-mindmap-demo/
  app/draw3d/
    page.tsx
    DoodleCanvas.tsx
    FormationView.tsx
    doodlenet.ts
    labelMap.ts
    useFormation.ts
  public/formations/
    cat.json
    tree.json
    ...
  scripts/formations/
    generate-cat.ts
    ...
```

## 8) Risks & mitigations
- **Model size on mobile**: lazy‑load; show progress; rely on CDN cache; keep rest of page usable.
- **Recognition accuracy**: curated classes; confidence gate; show top‑2; add “try again” UX.
- **Rendering perf**: cap instances, clamp DPR, no post, lean materials.
- **UX friction**: large canvas; clear/undo; optional manual “Classify” to avoid laggy devices.

## 9) Success metrics (MVP)
- Ready ≤ 4s on 4G; inference ≤ 200ms; ≥30 FPS at ~200 spheres on an iPhone‑class device.
- Smooth touch drawing; no inadvertent scrolling.

## 10) App vs SDK extraction (post‑MVP)
- Extract `FormationView` into `@refinery/canvas-r3f/draw3d` with an app‑agnostic API.
- Extract preprocess + classify into `@refinery/input-hub/doodle` (or a slim `@refinery/ml-bridges`).
- Provide a `DrawTo3D` reference widget and example.

## 11) Immediate next actions (today)
1. Add `/draw3d` route + `DoodleCanvas.tsx` with 28×28 preprocess helper.
2. Integrate ml5 DoodleNet via CDN; log load and inference times.
3. Build `FormationView` and render a hardcoded formation to validate perf.
4. Add `labelMap.ts` + 3–5 formation JSONs; wire classification → formation; demo end‑to‑end.
