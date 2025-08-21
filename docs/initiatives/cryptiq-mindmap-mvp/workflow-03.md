# Workflow 03: Cryptiq Mindmap MVP — Browser‑Gated Orchestrated Run

Created: 2025‑08‑21
Scope: Faithful to the alignment brief; covers the vast majority of the MVP spec with auditable, browser‑derived gates.
Constraints: Deterministic concept nodes anchored to brain‑surface vertices; attribute‑only lenses; edges default OFF; ≥50fps target; no sudo in container; Playwright‑gated acceptance.

---

## Section A — Target End‑State (from brief + spec)

1. On `http://localhost:3000/brain`, a glowing blue wireframe brain renders within ≤2s. Orbit controls are smooth; no auto camera motion.
2. 200–500 concept nodes render as small particles deterministically mapped to brain‑surface vertices; positions are stable across reloads; hover/click works; selection does not move nodes.
3. Lenses modulate attributes only (no geometry changes):
   - Affinity: category → color (8+ distinct, overflow → neutral gray)
   - Temporal: recency → brightness (0.3–1.0)
   - Causal: pulses along selected paths (edges default OFF; show on selection)
4. Edges: Bezier curves with additive blend; default OFF; when shown (selection), cap ≤100 visible; LOD/frustum culling.
5. Acceptance is proven via Playwright smoke (headless Chromium) with screenshot + console‑error gate; simulated acceptance is forbidden.

---

## Section B — Preconditions & Environment

- Node ≥20, pnpm ≥9; devcontainer shell at `/workspace` on ARM64 (M‑series host).
- `.env.local` at repo root:
  ```
  NEXT_PUBLIC_BRAIN_MESH_URL=/models/brain.obj
  ```
- Playwright non‑root install and cache:
  - Export `PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright-browsers`
  - Symlink once: `/home/node/.cache/ms-playwright -> /workspace/.playwright-browsers`
  - Export `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1`
- Ports: prefer 3000 for dev server; if occupied, pick next free (record in `session.log` and use as `BASE_URL`).
- Baseline reference image (illustrative guidance, not pixel authority): `docs/initiatives/cryptiq-mindmap-mvp/misc/reference-image.jpeg`. Iterate toward this look; treat as aesthetic target.

---

## Section C — Mechanics & Scaffolding (Claude Code)

- Sub‑agents: `plan-agent` (sessions+DAG+batches), `validate-agent` (lint→test→build→smoke), `coverage-audit-agent`, `meta-agent` (Trust Index).
- Hooks: pre‑execution Playwright preflight; post‑session artifact collector; block merges on failed gates.
- Bash scripts (recommended under `scripts/`):
  - `ensure-playwright.sh`: install to workspace cache; create symlink; echo versions.
  - `collect-artifacts.sh`: copy smoke screenshot, curl HTML, server logs, and acceptance JSON into run artifacts.
  - `port-pick.sh`: find free port; echo chosen port.
- Artifact normalization: under `.clmem/runs/<run_id>/artifacts/` store `server.log`, `curl-brain.html`, `smoke.png` (symlink to latest), `trace.zip` (on fail), `acceptance.json` (browser‑derived only).
- Trust Index (0–100): computed by `meta-agent` from presence/size of artifacts, smoke pass, clean server logs, and absence of "Simulated" markers. Runs <80 are “yellow”.

---

## Section D — Sessions (Detailed, gated, reproducible)

Each session includes: Goal • Edits/Targets • Commands • Gates • Artifacts • Commit. All commands run at repo root unless noted. After each session, append one line to `session.log` with timestamp, step, exit code, and primary artifact path.

### Session 0 — Environment & Toolchain Preflight (10–15m)

- Goal: deterministic, non‑root Playwright + stable dev shell.
- Commands:
  - `pnpm install --frozen-lockfile`
  - `PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright-browsers pnpm exec playwright install chromium`
  - `mkdir -p /home/node/.cache && rm -rf /home/node/.cache/ms-playwright && ln -s /workspace/.playwright-browsers /home/node/.cache/ms-playwright || true`
  - `pnpm -v && node -v && pnpm exec playwright --version | tee .clmem/artifacts/w03/tooling.txt`
- Gates: versions recorded; browsers present; no sudo required.
- Artifacts: `.clmem/artifacts/w03/tooling.txt`
- Commit: `workflow(session-0): env preflight & playwright cache [ok]`

### Session 1 — Route & SSR Guards (15–20m)

- Goal: client‑only `/brain` route; no client‑only imports server‑side.
- Edits/Targets: `apps/cryptiq-mindmap-demo/app/brain/page.tsx` has `'use client'` and renders `BrainIntegrationTest`; `packages/canvas-r3f/src/index.ts` does not re‑export adapters.
- Commands: `pnpm -r build`
- Gates: build green; grep shows no `window` in server paths; adapters not re‑exported.
- Artifacts: `.clmem/artifacts/w03/ssr-scan.txt`
- Commit: `workflow(session-1): route wiring & ssr guards [ok]`

### Session 2 — Mesh Asset Validation (15–20m)

- Goal: ensure brain OBJ exists and vertex count ∈ [35k, 50k]; else fallback recorded.
- Commands:
  - `node scripts/obj-vertex-count.mjs apps/cryptiq-mindmap-demo/public/models/brain.obj | tee .clmem/artifacts/w03/vertex-count.txt`
- Gates: vertex count logged; gate passes in range or fallback path documented.
- Artifacts: `vertex-count.txt`
- Commit: `workflow(session-2): mesh asset validation [ok]`

### Session 3 — Deterministic Mapping Utilities (25–30m)

- Goal: djb2 hash mapping, region bucketing (30/25/25/20), spiral search, reproducibility test.
- Edits/Targets: `packages/canvas-r3f/src/VertexMapper.ts` utilities finalized; reproducibility helper.
- Commands: `pnpm -r build`
- Gates: two independent runs map identical indices; collision rate <5% at 500 concepts (fixture).
- Artifacts: `.clmem/artifacts/w03/distribution-stats.json`, `.clmem/artifacts/w03/reproducibility.txt`
- Commit: `workflow(session-3): deterministic mapping & analysis [ok]`

### Session 4 — Concept Particles (500 instances) (15–20m)

- Goal: render up to 500 concepts with stable colors and hover/click handlers.
- Edits/Targets: `ConceptParticles.tsx` instance count = 500; color fallback from id when no category color.
- Commands: `pnpm -r build`
- Gates: renders 500 (when provided), colors nonzero; handlers registered.
- Artifacts: `.clmem/artifacts/w03/particles-config.json`
- Commit: `workflow(session-4): concept particles (500) [ok]`

### Session 5 — Camera Controls & Limits (10–15m)

- Goal: smooth orbit; correct zoom/polar limits; no auto‑motion.
- Edits/Targets: `OrbitControls` params per spec: pan/zoom/rotate enabled, `dampingFactor≈0.05`, `minDistance≈5`, `maxDistance≈200`, polar clamps.
- Gates: manual QA: no auto‑motion; zoom bounds enforced.
- Artifacts: `.clmem/artifacts/w03/camera.json`
- Commit: `workflow(session-5): camera controls & limits [ok]`

### Session 6 — Performance Baseline Hooks (15–20m)

- Goal: firstFrameMs measurement; overlay displays perf note; ≤2s target on dev.
- Edits/Targets: `BrainIntegrationTest` uses `testStartTime`; records `firstFrameMs` upon acceptance.
- Gates: firstFrameMs ≤ 2000ms observed in smoke (reported in acceptance JSON).
- Artifacts: `.clmem/artifacts/w03/perf.json`
- Commit: `workflow(session-6): performance baseline hooks [ok]`

### Session 7 — Acceptance Reporter (browser‑derived) (20–25m)

- Goal: POST acceptance metrics after all bars pass; write to `.clmem/artifacts/w03/acceptance/brain-acceptance.json`.
- Edits/Targets: Next API route + client POST with fields: `{ meshLoaded, vertexCount, particles, interactionsBound, firstFrameMs, particlesRendered, timestamp }`.
- Gates: POST invoked in browser; server writes file; console shows receipt.
- Artifacts: `acceptance/brain-acceptance.json`
- Commit: `workflow(session-7): acceptance reporter (browser) [ok]`

### Session 8 — Dev Server Launch & Health (10–15m)

- Goal: boot server; curl `/brain`; clean logs after first render.
- Commands:
  - `PORT=3000 pnpm --filter cryptiq-mindmap-demo dev > .clmem/artifacts/w03/server.log 2>&1 &`
  - `sleep 3 && curl -sf http://localhost:3000/brain > .clmem/artifacts/w03/curl-brain.html`
- Gates: HTTP 200; server logs show no "error" after first navigation.
- Artifacts: `server.log`, `curl-brain.html`
- Commit: `workflow(session-8): dev server & health [ok]`

### Session 9 — Playwright Smoke & Visual Baseline (20–30m)

- Goal: headless smoke proves canvas ready and overlays nonzero vertices; visual parity check against baseline for close aesthetic match.
- Edits/Targets: ensure `tests/brain.smoke.spec.ts` includes `expect(page).toHaveScreenshot('brain-baseline.png', { maxDiffPixelRatio: ≤0.10, mask: [overlay] })` with animations disabled; config stable viewport and container flags.
- Commands:
  - `BASE_URL=http://localhost:3000 pnpm smoke:brain`
  - First-time baseline: `pnpm exec playwright test tests/brain.smoke.spec.ts --update-snapshots`
- Gates: 1 canvas visible; overlay shows Brain Vertices > 0; screenshot size > 10k; zero console errors; visual parity passes (≤10% diff) when baseline exists.
- Artifacts: `.clmem/artifacts/smoke/brain-*.png`; Playwright artifacts under `.clmem/artifacts/playwright/` (trace on fail).
- Commit: `workflow(session-9): playwright smoke & baseline [ok]`

### Session 10 — Coverage Audit (optional UI focus) (10–20m)

- Goal: measure test coverage; exclude E2E from unit coverage.
- Commands: `pnpm -r test:coverage`
- Gates: thresholds if defined; report captured per package.
- Artifacts: `.clmem/runs/<run_id>/coverage.json`, `coverage-report.md`
- Commit: `workflow(session-10): coverage audit [ok]`

### Session 11 — Vendor Isolation (5–10m)

- Goal: ensure `vendor/3dbrain` is not imported.
- Commands: grep/search vendor imports; record 0 findings.
- Gates: no imports from vendor across apps/packages.
- Artifacts: `.clmem/artifacts/w03/vendor-scan.txt`
- Commit: `workflow(session-11): vendor isolation check [ok]`

### Session 12 — Lens: Affinity (category → color) (25–35m)

- Goal: implement category→color mapping (8+ hues; overflow gray); attribute‑only update.
- Edits/Targets: shared color map; shader/uniforms or CPU color pipe; ensure no position changes.
- Commands: `pnpm -r build`
- Gates: switching to Affinity lens recolors nodes deterministically; smoke still passes.
- Artifacts: `.clmem/artifacts/w03/lens-affinity.json`
- Commit: `workflow(session-12): lens (affinity) attribute‑only [ok]`

### Session 13 — Lens: Temporal (recency → brightness) (25–35m)

- Goal: implement brightness from recency (0.3–1.0); timeline slider plumbing (stub OK).
- Edits/Targets: uniform or prop controlling brightness; simple binning.
- Commands: `pnpm -r build`
- Gates: switching to Temporal adjusts brightness only; smoke passes (functional), optional visual diff within threshold.
- Artifacts: `.clmem/artifacts/w03/lens-temporal.json`
- Commit: `workflow(session-13): lens (temporal) attribute‑only [ok]`

### Session 14 — Causal Path Pulses & Edges (selection‑only) (30–45m)

- Goal: Bezier edges default OFF; on selection only, ≤100 visible; additive blend; optional pulse on selected path.
- Edits/Targets: lightweight `EdgeRenderer` with culling/LOD; pulse animation on demand.
- Commands: `pnpm -r build`
- Gates: selection renders limited edges; performance holds (≥50fps subjective on dev); smoke remains green (edges off by default).
- Artifacts: `.clmem/artifacts/w03/edges-config.json`
- Commit: `workflow(session-14): edges (selection only) + pulses [ok]`

### Session 15 — Acceptance Packaging & Trust Index (10–15m)

- Goal: aggregate artifacts into run dir; compute Trust Index; close out docs.
- Commands:
  - `scripts/collect-artifacts.sh <run_id>` (or inline copy commands)
  - `node scripts/w03-summarize.mjs > .clmem/runs/<run_id>/results.json`
- Gates: Trust Index ≥80; all gates green; artifacts present with sizes.
- Artifacts: `.clmem/runs/<run_id>/artifacts/**/*`, `results.json`
- Commit: `workflow(session-15): acceptance packaging & trust index [ok]`

### Session 16 — Documentation & Next‑Step Gates (10–15m)

- Goal: update `workflow-03.md` “Status” section; log TODOs for polish; note deviations.
- Gates: docs committed; next gates listed.
- Artifacts: updated docs under VCS.
- Commit: `workflow(session-16): docs & next‑steps [ok]`

---

## Section E — Orchestrator Runbook (Commands Only)

Safe defaults:

- Run from repo root (`/workspace`); export `PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright-browsers` and `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1`.
- Write logs under `.clmem/artifacts/w03/`; never use sudo.

1. Preflight

```
pnpm install --frozen-lockfile
PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright-browsers pnpm exec playwright install chromium
mkdir -p /home/node/.cache && rm -rf /home/node/.cache/ms-playwright && ln -s /workspace/.playwright-browsers /home/node/.cache/ms-playwright || true
```

2. Build & Mesh check

```
pnpm -r build | tee .clmem/artifacts/w03/build.log
node scripts/obj-vertex-count.mjs apps/cryptiq-mindmap-demo/public/models/brain.obj | tee .clmem/artifacts/w03/vertex-count.txt || true
```

3. Dev server

```
PORT=3000 pnpm --filter cryptiq-mindmap-demo dev > .clmem/artifacts/w03/server.log 2>&1 &
sleep 3 && curl -sf http://localhost:3000/brain > .clmem/artifacts/w03/curl-brain.html
```

4. Acceptance (browser)

```
BASE_URL=http://localhost:3000 pnpm smoke:brain
# Optional: Visual baseline on
pnpm exec playwright test tests/brain.smoke.spec.ts -- --trace=on --screenshot=on
```

5. Results

```
node scripts/w03-summarize.mjs > .clmem/runs/$(date +%Y%m%d-%H%M%S)_W03/results.json
```

---

## Section F — Success Criteria (hard + browser‑derived)

- First frame ≤ 2000ms (from acceptance JSON).
- Brain OBJ served at `/models/brain.obj`; vertex count ∈ [35k, 50k].
- Particles: 200–500 rendered; deterministic across reloads (positions stable).
- Lenses adjust attributes only; no position changes; edges default OFF.
- Smoke: canvas visible; overlay shows nonzero vertices; zero console errors; screenshot saved.
- Vendor demo isolated; no vendor imports.
- Trust Index ≥80; no simulated markers anywhere in acceptance.

---

## Status (to be filled during run)

- Last Run: [TBD]
- Result: [TBD]
- Notes: [TBD]

---

## Appendix — Script Sketches (optional implementer aids)

`scripts/ensure-playwright.sh` (sketch)

```
#!/usr/bin/env bash
set -euo pipefail
export PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright-browsers
pnpm exec playwright install chromium
mkdir -p /home/node/.cache
rm -rf /home/node/.cache/ms-playwright || true
ln -s /workspace/.playwright-browsers /home/node/.cache/ms-playwright || true
pnpm exec playwright --version
```

`scripts/w03-summarize.mjs` (sketch)

```
#!/usr/bin/env node
import fs from 'node:fs'
const pngs = fs.existsSync('.clmem/artifacts/smoke') ? fs.readdirSync('.clmem/artifacts/smoke').filter(f => f.endsWith('.png')) : []
const acceptance = JSON.parse(fs.readFileSync('.clmem/artifacts/w03/acceptance/brain-acceptance.json', 'utf8'))
const trust = (
  (pngs.length > 0 ? 25 : 0) +
  (acceptance.meshLoaded ? 20 : 0) +
  (acceptance.vertexCount >= 35000 && acceptance.vertexCount <= 50000 ? 15 : 0) +
  (acceptance.firstFrameMs <= 2000 ? 20 : 0) +
  (fs.readFileSync('.clmem/artifacts/w03/server.log', 'utf8').toLowerCase().includes('error') ? 0 : 20)
)
console.log(JSON.stringify({ acceptance, trustIndex: trust }, null, 2))
```

Note: These sketches illustrate intent; implement concrete versions during the run.
