# Workflow 02: Cryptiq Mindmap Baseline Visual Port (No‑Playwright Orchestrated Run)

Created: 2025‑08‑20
Scope: Deliver a baseline brain visualization on `/brain` with deterministic concept particles and smooth camera controls, executed fully by the Orchestrator without Playwright.
Constraints: No headless browser; visual verification via in‑app acceptance reporter endpoint and server logs; vendor demo kept isolated.

---

## Section A — Target End‑State (from brief + acceptance lines)

1. Opening `http://localhost:3000/brain` shows a fast‑loading (≤2s) blue wireframe brain on a ~40k‑vertex mesh with smooth orbit/zoom and no auto camera motion.
2. 500 concept nodes render as small, colored particles evenly distributed on the surface via deterministic mapping; hover/click updates a details panel; positions are stable across reloads (edges off by default).
3. Acceptance gates are green (35–50k vertex window, ≥50 FPS idle, no red console errors), and the vendor demo (`vendor/3dbrain`) remains isolated as a reference only.

Alignment with brief (`docs/initiatives/cryptiq-mindmap-mvp/brief.md`):

- Nodes are derived concepts mapped to brain‑surface vertices (positions immutable across lenses).
- Lenses modulate attributes only (color/size/brightness), not layout.

### Prehistory / Context (baseline observations and visual references)

The brain mesh loads quickly and orbits smoothly, so the core loader and camera controls are working. Concept nodes render and hover interactions register as expected, indicating the mapping and instancing paths are wired. Visually, the nodes look like large black orbs—this is likely a material/lighting default and/or instance color not applied, not a logic failure.

Visual references (for parity tracking):

- Pre‑run state screenshot: `docs/initiatives/cryptiq-mindmap-mvp/misc/cryptiq-mindmap-brain-screenshot.png`
- Brain repo screenshot: `docs/initiatives/cryptiq-mindmap-mvp/misc/brain-repo-screenshot.png`
- Target reference image: `docs/initiatives/cryptiq-mindmap-mvp/misc/reference-image.jpeg`

---

## Section B — Preconditions & Environment

- Repo branch: working feature branch (e.g., `refactor/context-consolidation-aug17`) checked out and clean.
- Node 20, pnpm 9.x available; run with devcontainer or local shell.
- `.env.local` at repo root contains: `NEXT_PUBLIC_BRAIN_MESH_URL=/models/brain.obj`.
- Asset present: `apps/cryptiq-mindmap-demo/public/models/brain.obj` (≈40k vertices preferred; see Session 2 for verification and swap if not in range).
- Route exists: `apps/cryptiq-mindmap-demo/app/brain/page.tsx` renders `BrainIntegrationTest` from `@refinery/canvas-r3f`.
- SSR guards: no client‑only adapters imported on server (see Session 3 checks).
- No Playwright usage; acceptance is reported via a lightweight API endpoint and server logs.

---

## Section C — Risks & Mitigations

- SSR import hazards (“window is not defined”): remove/avoid server imports of client‑only adapters; enforce `'use client'` in affected files. Mitigated in Session 3.
- High‑poly OBJ (>50k vertices) slowing first frame: provide low‑poly fallback and a check that swaps the asset. Mitigated in Session 2.
- Visual verification without a browser: add a client‑side acceptance reporter that calls a Next API route which writes an artifact JSON with metrics. Mitigated in Session 6.
- Vendor demo dependency bleed: always use `pnpm --dir vendor/3dbrain --ignore-workspace` and never import vendor code into app. Mitigated in Session 7.

---

## Section D — Outcomes & Acceptance Bars (Workflow 02)

Outcomes (exactly 3):

1. Wireframe brain renders in ≤2s; camera controls smooth; no auto camera motion.
2. 500 concept particles deterministically mapped to surface vertices; hover/click updates details panel; positions stable across reloads.
3. Acceptance reporter writes `brain-acceptance.json` artifact with green metrics; vendor demo remains isolated.

Acceptance bars (hard + reported):

- ✓ OBJ served at `/models/brain.obj` (HTTP 200).
- ✓ Vertex count within 35–50k (else auto‑swap to fallback asset and re‑run).
- ✓ Client emits acceptance: `{ meshLoaded: true, vertexCount: [35k..50k], particles: 500, interactionsBound: true }`.
- ✓ Server logs contain zero “error” level lines after first render.
- ✓ Response time from first navigation until acceptance report ≤2s.

---

## Section E — Workflow Sessions (30–45 min each)

### Session 0 — Sanity, Clean Install, Typecheck (30 min)

Goal: Ensure workspace is healthy and reproducible.
Steps:

- Enable corepack and install:
  - `corepack enable && corepack prepare pnpm@9.15.1 --activate`
  - `pnpm install --frozen-lockfile`
- Typecheck only critical packages:
  - `pnpm -r --filter @refinery/canvas-r3f typecheck`
- Build the canvas package to ensure emit:
  - `pnpm -r --filter @refinery/canvas-r3f build`
    Artifacts: `.clmem/artifacts/w02/session0/typecheck.log`
    Gate: no TS errors; build succeeds.

### Session 1 — Route Wiring Confirmation (15–30 min)

Goal: Confirm `/brain` page renders client component only.
Steps:

- Verify `apps/cryptiq-mindmap-demo/app/brain/page.tsx` contains:
  - `'use client'`
  - `<BrainIntegrationTest showPerformance={false} debug={false} />`
- Verify `.env.local` contains `NEXT_PUBLIC_BRAIN_MESH_URL=/models/brain.obj`.
  Artifacts: copy of page content snapshot in `.clmem/artifacts/w02/session1/brain-page.txt`.
  Gate: file present with exact imports and client directive.

### Session 2 — Mesh Asset Check & Swap (30–45 min)

Goal: Ensure a ~40k‑vertex mesh is used.
Steps:

- Verify asset exists: `apps/cryptiq-mindmap-demo/public/models/brain.obj`.
- Run a node script to count vertices quickly (simple OBJ parser):
  - Script writes `vertex-count.txt` with total.
- If vertexCount ∉ [35k, 50k], swap to `brain_lowpoly.obj` if available (preferred path: `/workspace/public/models/brain_lowpoly.obj`), else keep current and set acceptance to “yellow” with a TODO to replace asset later.
  Artifacts: `.clmem/artifacts/w02/session2/vertex-count.txt`, copied OBJ name.
  Gate: vertex count logged; if out of range, fallback chosen and recorded.

### Session 3 — SSR Guard & Adapter Isolation (30 min)

Goal: Prevent SSR from importing client‑only modules.
Steps:

- Ensure `packages/canvas-r3f/src/index.ts` does not re‑export adapters (e.g., `export * from './adapters'` removed).
- Ensure client‑only files include `'use client'` at top.
- Grep for ForceGraph or window usage in server paths; none should remain.
  Artifacts: `.clmem/artifacts/w02/session3/ssr-scan.txt` (grep results).
  Gate: no server build/runtime “window is not defined” errors.

### Session 4 — Camera Controls & Limits (15–30 min)

Goal: Smooth orbit with no auto‑motion and adequate zoom range.
Steps:

- Set `OrbitControls` with `autoRotate=false`, `enableRotate=true`, `enablePan=true`, `dampingFactor≈0.05`, `minDistance≈5`, `maxDistance≈200`.
- Disable any intro/auto camera choreography.
  Artifacts: config snapshot `.clmem/artifacts/w02/session4/camera.json`.
  Gate: camera responds to input; no auto motion.

### Session 5 — Deterministic Surface Mapping (45 min)

Goal: Map 500 concept nodes to brain‑surface vertices deterministically.
Steps:

- Implement or confirm a mapper that:
  - Hashes `concept.id` → selects region bucket → picks unoccupied vertex; falls back via spiral search; overflow shells disabled for 500.
- Render particles as small colored points; hover/click updates details panel.
- Persist positions across reloads (same hash → same vertex index).
  Artifacts: `.clmem/artifacts/w02/session5/distribution-stats.json` with counts per region and collision stats.
  Gate: 500 nodes placed; zero overlaps; stable indices between two runs.

### Session 6 — Acceptance Reporter (No‑Browser) (45 min)

Goal: Add a client‑side reporter that writes acceptance metrics to disk via a Next API route.
Steps:

- Add `apps/cryptiq-mindmap-demo/app/api/brain-acceptance/route.ts` that receives JSON metrics and writes to `.clmem/artifacts/w02/acceptance/brain-acceptance.json` (create directories as needed).
- In `BrainIntegrationTest`, after mesh + particles + interactions are bound, POST:
  - `{ meshLoaded: true, vertexCount, particles: 500, interactionsBound: true, firstFrameMs }` to `/api/brain-acceptance`.
- Ensure server logs and file write succeed.
  Artifacts: `.clmem/artifacts/w02/acceptance/brain-acceptance.json`.
  Gate: file exists with green metrics; `firstFrameMs ≤ 2000`.

### Session 7 — Vendor Demo Isolation Check (15–30 min)

Goal: Keep `vendor/3dbrain` isolated.
Steps:

- If needed for reference, install only in vendor dir:
  - `pnpm --dir vendor/3dbrain install --ignore-workspace`
- Do not export/import vendor code into app or packages.
  Artifacts: `.clmem/artifacts/w02/session7/vendor-install.log` (optional).
  Gate: no workspace dependency contamination; no vendor imports in app.

### Session 8 — Dev Server Launch & Health (30 min)

Goal: Run the app and reach `/brain` page; verify server‑side health.
Steps:

- Launch: `pnpm --filter cryptiq-mindmap-demo dev` (background).
- Wait for `http://localhost:3000` to respond; `curl /brain` should return 200.
- Tail server logs to ensure no red errors after first navigation.
  Artifacts: `.clmem/artifacts/w02/session8/server.log`, `curl-brain.html`.
  Gate: 200 OK; logs clean.

### Session 9 — Acceptance Collection & Packaging (30 min)

Goal: Collect and freeze run artifacts.
Steps:

- Copy `.clmem/artifacts/w02/acceptance/brain-acceptance.json` to run folder with timestamp.
- Record server log tail, vertex stats, and config snapshot.
- Emit `results.json` and `acceptance.md` summarizing gates.
  Artifacts: `.clmem/runs/${RUN_ID}_W02/**/*`.
  Gate: `results.json.acceptancePassed === true`.

### Session 10 — Documentation & Next‑Step Gates (30 min)

Goal: Update docs to reflect baseline and prep for visual polish.
Steps:

- Update `docs/initiatives/cryptiq-mindmap-mvp/workflow-02.md` “Status” section.
- Add TODOs for: particle color palette, spacing uniformity, bloom/tonemapping, vertex window hardening.
- Log any deviations from 35–50k window (if fallback not available).
  Artifacts: updated docs under version control.
  Gate: docs merged; clear next tasks.

---

## Section F — Minimal Infra (No Playwright)

Dependencies (already present or added as needed):

- `three`, `@react-three/fiber`, `@react-three/drei`
- No test browser packages required.

File structure touches:

- `apps/cryptiq-mindmap-demo/app/brain/page.tsx`
- `apps/cryptiq-mindmap-demo/public/models/brain.obj`
- `apps/cryptiq-mindmap-demo/app/api/brain-acceptance/route.ts` (new)
- `packages/canvas-r3f/src/BrainIntegrationTest.tsx` (report hook)
- `packages/canvas-r3f/src/index.ts` (SSR guard confirm)

Environment:

```
# .env.local
NEXT_PUBLIC_BRAIN_MESH_URL=/models/brain.obj
```

---

## Section G — Orchestrator Runbook (Commands Only)

Safe defaults:

- Always run from repo root (`/workspace`).
- Use `set -euo pipefail` and write logs under `.clmem/artifacts/w02/`.

Commands:

1. Prep

```
corepack enable && corepack prepare pnpm@9.15.1 --activate
pnpm install --frozen-lockfile | tee .clmem/artifacts/w02/session0/install.log
pnpm -r --filter @refinery/canvas-r3f typecheck | tee .clmem/artifacts/w02/session0/typecheck.log
pnpm -r --filter @refinery/canvas-r3f build | tee .clmem/artifacts/w02/session0/build.log
```

2. Mesh check

```
node scripts/obj-vertex-count.mjs apps/cryptiq-mindmap-demo/public/models/brain.obj \
  | tee .clmem/artifacts/w02/session2/vertex-count.txt || true
```

3. Dev

```
PORT=3000 pnpm --filter cryptiq-mindmap-demo dev > .clmem/artifacts/w02/session8/server.log 2>&1 &
sleep 3 && curl -sf http://localhost:3000/brain > .clmem/artifacts/w02/session8/curl-brain.html
```

4. Acceptance (file written by client)

```
timeout 30 bash -lc 'while [ ! -f .clmem/artifacts/w02/acceptance/brain-acceptance.json ]; do sleep 1; done'
cat .clmem/artifacts/w02/acceptance/brain-acceptance.json | tee .clmem/artifacts/w02/acceptance/acceptance.json
```

5. Results

```
node scripts/w02-summarize.mjs > .clmem/runs/$(date +%Y%m%d-%H%M%S)_W02/results.json
```

---

## Section H — Success Criteria

1. `brain-acceptance.json` shows: `meshLoaded=true`, `vertexCount∈[35k,50k]`, `particles=500`, `interactionsBound=true`, `firstFrameMs≤2000`.
2. `/brain` responds 200; server logs contain no error entries after first render.
3. Vendor demo remains isolated; no vendor imports in app.

---

## Appendix — Scripts (guidance for implementers)

`scripts/obj-vertex-count.mjs` (sketch):

```javascript
#!/usr/bin/env node
import fs from 'node:fs'
const p = process.argv[2]
const text = fs.readFileSync(p, 'utf8')
const count = text.split('\n').filter((l) => l.startsWith('v ')).length
console.log(String(count))
```

`scripts/w02-summarize.mjs` (sketch):

```javascript
#!/usr/bin/env node
import fs from 'node:fs'
const a = JSON.parse(
  fs.readFileSync('.clmem/artifacts/w02/acceptance/brain-acceptance.json', 'utf8')
)
const ok =
  a.meshLoaded &&
  a.interactionsBound &&
  a.particles === 500 &&
  a.vertexCount >= 35000 &&
  a.vertexCount <= 50000 &&
  a.firstFrameMs <= 2000
console.log(JSON.stringify({ acceptancePassed: !!ok, metrics: a }, null, 2))
```

Note: These sketches are for Orchestrator reference; actual implementations should be created as part of the run where missing.
