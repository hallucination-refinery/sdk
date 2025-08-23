# Workflow 05: Visual Parity — Glow Orbs + Iterative Aesthetic Convergence

Created: 2025‑08‑22
Scope: Implement compelling 3D glow orbs, then iteratively converge toward the reference look using a measurable, browser‑gated loop. Build on W03/W04.
Target: `http://localhost:3000/brain` (audit/screenshot mode available)
Constraints: Deterministic screenshots; no auto‑snapshot updates; browser‑derived gates only; additive bloom optional and OFF in screenshot mode.

---

## Section A — Target End‑State

1. Brain silhouette fills 70–80% of frame; lateral profile; clean background.
2. 500–1500 glow orbs (concepts) sit just above cortex; even coverage; no embedding.
3. Orbs appear as small emissive spheres with Fresnel rim; stable apparent size (≈12–18 px) at the chosen pose.
4. Lenses alter attributes only (color/brightness); positions fixed; edges default OFF.
5. Acceptance is browser‑gated via scripted screenshot + image metrics (coverage, count, color diversity) — no pixel‑diff against reference.

---

## Section B — Preconditions & Environment

- Node ≥20, pnpm ≥9; devcontainer shell at `/workspace`.
- Playwright installed to workspace cache (`PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright-browsers`).
- `.env.local` at repo root:
  ```
  NEXT_PUBLIC_BRAIN_MESH_URL=/models/brain.obj
  NEXT_PUBLIC_SCREENSHOT_MODE=1
  ```
- Reference image: `docs/initiatives/cryptiq-mindmap-mvp/misc/reference-image.jpeg` (guidance only; not a diff authority).

---

## Section C — Mechanics & Scaffolding (Claude Code)

- Visual-parity agent (oslo): staged improvements (camera → particles → colors → enhancement → baseline). We adopt the same protocol and measurable gates.
- Scripts added:
  - `scripts/capture-brain.mjs` — Playwright capture of `/brain` into a screenshot path.
  - `scripts/analyze-visual-parity.mjs` — coverage/particles/colors from screenshot (ported from `.conductor/oslo`).
  - `scripts/generate-visual-report.mjs` — roll‑up report for a run directory (ported from `.conductor/oslo`).
  - `scripts/w05-run.sh` — one‑shot orchestrator: start server, capture, analyze, report.
- Artifact layout: `.clmem/runs/<run_id>_W05/{iteration-1.png,metrics.json,report.md,summary.json}`.

---

## Section D — Sessions (Detailed, gated, reproducible)

Each session includes: Goal • Edits/Targets • Commands • Gates • Artifacts • Commit.

### Session 0 — Bootstrap & Context Lock (5–10m)

- Goal: establish run directory and copy analysis tools.
- Commands:
  ```
  export RUN_ID=$(date +%Y%m%d-%H%M%S)_W05
  mkdir -p .clmem/runs/$RUN_ID
  ```
- Gates: run dir exists; tools present under `scripts/`.
- Artifacts: none (prep only)
- Commit: `workflow-05(session-0): bootstrap & tools`

### Session 1 — Glow Orbs (instanced spheres + shader) (25–40m)

- Goal: replace audit points with instanced glow spheres (emissive core + Fresnel rim), additive blending; stable size control.
- Edits/Targets:
  - `packages/canvas-r3f/src/ConceptParticles.tsx` — add `renderMode: 'points'|'spheres'` prop; implement instanced `sphereGeometry(8–12 seg)` path with:
    - material: custom shader or Phong+rim approximation; `depthTest=true`, `depthWrite=false`, `blending=AdditiveBlending`.
    - apparent size: compute worldUnitsPerPixel at anchor depth to hit 12–18 px (clamped); update instance scales each frame in screenshot mode.
  - Keep current surface‑only anchors, region‑wise farthest‑point sampling, and outward offset (δ≈1.6).
- Commands: `pnpm -r build`
- Gates: 500 spheres visible; no z‑fighting; no embedded orbs; apparent size within 12–18 px at the default pose.
- Artifacts: `.clmem/artifacts/w05/glow-orbs.json` (settings dump)
- Commit: `workflow-05(session-1): glow orbs (instanced spheres)`

### Session 2 — Even Coverage & Size Stability (15–25m)

- Goal: ensure uniform spacing and stable perceived size.
- Edits/Targets:
  - Verify farthest‑point sampling per region (30/25/25/20 quotas) and increase δ to 1.6–2.0 if any embedding persists.
  - Implement `worldUnitsPerPixel` helper (`cameraUtils.ts`) and clamp instance scale across small zoom changes.
- Commands: `pnpm -r build`
- Gates: min pairwise spacing P5 ≥ threshold; 95% anchors within 2.0 units of cortex; size variance < ±10% on small zoom perturbation.
- Artifacts: `.clmem/artifacts/w05/coverage-check.json`
- Commit: `workflow-05(session-2): spacing & size stability`

### Session 3 — Screenshot Loop & Metrics (10–15m)

- Goal: scripted capture + analysis.
- Commands:
  ```
  bash scripts/w05-run.sh
  ```
- Gates: `metrics.json` present with coverage, particleCount, distinctColors, hasOverlay.
- Artifacts: `.clmem/runs/<RUN_ID>_W05/{iteration-1.png,metrics.json}`
- Commit: `workflow-05(session-3): capture + metrics`

### Session 4 — Iterative Convergence (10–30m)

- Goal: iterate camera distance (framing) and particle density until gates pass.
- Commands (example converge loop):
  ```
  for i in 1 2 3; do \
    NEXT_PUBLIC_SCREENSHOT_MODE=1 BASE_URL=http://localhost:3000 \
    node scripts/capture-brain.mjs .clmem/runs/$RUN_ID/iteration-$i.png; \
    node scripts/analyze-visual-parity.mjs .clmem/runs/$RUN_ID/iteration-$i.png docs/initiatives/cryptiq-mindmap-mvp/misc/reference-image.jpeg \
      | tee .clmem/runs/$RUN_ID/metrics.json; \
  done
  node scripts/generate-visual-report.mjs .clmem/runs/$RUN_ID
  ```
- Gates: coverage 70–80%; particles ≥200; colors ≥5; overlay absent.
- Artifacts: `report.md`, `summary.json`
- Commit: `workflow-05(session-4): convergence loop`

### Session 5 — Baseline & Maintenance (5–10m)

- Goal: lock baseline and document.
- Commands: copy final screenshot to `docs/initiatives/cryptiq-mindmap-mvp/misc/baselines/brain-w05.png`
- Gates: report shows CONVERGED; acceptance noted.
- Artifacts: baseline image; `acceptance.md` update.
- Commit: `workflow-05(session-5): baseline & docs`

---

## Section E — Orchestrator Runbook (Commands Only)

Safe defaults:

1. Preflight

```
pnpm install --frozen-lockfile
PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright-browsers pnpm exec playwright install chromium
```

2. Dev server

```
PORT=3000 pnpm --filter cryptiq-mindmap-demo dev > .clmem/artifacts/w05/server.log 2>&1 &
sleep 3 && curl -sf http://localhost:3000/brain | head -c 200 | cat
```

3. One‑shot capture + metrics

```
export RUN_ID=$(date +%Y%m%d-%H%M%S)_W05
bash scripts/w05-run.sh "$RUN_ID"
```

---

## Section F — Success Criteria (browser‑derived)

- Coverage: 70–80% of frame (from analyzer).
- Particle count: ≥200 visible (analyzer).
- Color diversity: ≥5 hues (analyzer; lens‑dependent).
- No debug overlay in capture.
- Deterministic screenshot: identical across two consecutive runs in screenshot mode.

---

## Status (to be filled during run)

- Last Run: (tbd)
- Result: (tbd)
- Notes: (tbd)

### Session Completion Summary

- Completed Sessions: (tbd)
- All Gates: (tbd)
- Artifacts: (tbd)

### Deviations from Plan

- (tbd)

---

## Appendix — Glow Orbs Implementation Plan (Detail)

1. Renderer

- Add `renderMode` prop with `'points'|'spheres'`; default to `'spheres'` in non‑screenshot mode, `'points'` optional for audits.
- Use a single `instancedMesh(sphereGeometry(8–12 seg), ShaderMaterial, N)`.

2. Shader

- Vertex: instance transforms; rim term `pow(1.0 - dot(normal, viewDir), rimPower)`.
- Fragment: emissive core + rim; additive blending; alpha from rim/core mix.

3. Depth & Blend

- `depthTest=true`, `depthWrite=false`, `blending=THREE.AdditiveBlending`.

4. Apparent Size

- Compute worldUnitsPerPixel at anchor depth and scale instance matrices to achieve ≈15 px (clamp 12–18 px).

5. Placement

- Keep surface‑filtered vertices, region quotas, farthest‑point sampling; outward offset δ=1.6–2.0.

6. Determinism

- Freeze time in `NEXT_PUBLIC_SCREENSHOT_MODE`; disable auto‑rotate; render one extra frame before capture.
