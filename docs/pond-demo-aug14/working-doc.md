## **Last Updated:** Saturday, 12:30 PM EST, 16-08-2025

## **Doc Sync VERIFIED:** 12:30 PM EST — All worktrees mirror base-of-truth docs

# Executive Summary

- Demo video target: Sunday Aug 17 (night)
- Current phase: Fix instanceColor shader → enable basic selection → stabilize camera → record 30–45s demo
- Approach: Met Museum-style latent space (see `guides/met-morph-vision.md`)

# Sprint Status Tracker

- Saturday PM: Fix colors (instanceColor visible on first paint)
- Sunday: Interactions (click-to-select) + camera stability + record demo

---

## Current State (Saturday 12:30 PM EST, 16-08-2025)

- Nodes render but appear black (instanceColor not applied in shader pipeline)
- Raycast/selection non-functional (clicks register as background; no visual change)
- Camera auto-frame inconsistent (immediate + delayed zoomToFit not deterministic)
- Burst animation not perceptible in latest runs
- No console errors; harness compiles and serves reliably; white background

## Critical Path

1. [ ] Fix instanceColor in shader (1–2 hours)
2. [ ] Basic selection working (click → orange highlight) (1 hour)
3. [ ] Camera stability (consistent zoom-to-fit on load and post-burst) (30 minutes)
4. [ ] Record 30–45s demo (30 minutes)

## Technical Blockers

- instanceColor not wired through shader: aOpacity is patched; color pipeline likely not multiplying by instanceColor
- Raycaster path returns background hits or none: coordinate mapping / handler mismatch (DOM vs R3F events)
- Camera timing: zoomToFit may fire before mesh is attached or positions are stable

## Information Gaps

- Explicit reference goals for MET-inspired interaction not present in working doc (see `guides/met-morph-vision.md`)
- No color mapping for memory decomposition (emotions/catalysts → color palette)
- Missing concrete shader debugging checklist for colors

## Immediate Critical Path (expanded)

1. Fix instanceColor shader pipeline (nodes must be visibly colored)

- Ensure `mesh.instanceColor` is an InstancedBufferAttribute with itemSize=3 and correct length
- In `onBeforeCompile`, include color chunks and multiply fragment color by instance color; keep `material.vertexColors = true` and `material.color = 0xffffff`
- Validate by assigning a deterministic 3‑color test palette and confirming on first paint

2. Wire basic selection (click → orange highlight)

- Prefer R3F `onPointerDown` on the InstancedMesh primitive; read `event.instanceId`
- Map instanceId → nodeId via `mgr.idAt(instanceId)`
- `mgr.setColor(nodeId, 0xffa500)`; if a previous selection exists, `mgr.restoreBaseColor(prev)`; rely on per-frame `flush()`
- Use `onPointerMissed` to clear selection and restore base color

3. Stabilize camera framing

- Call `zoomToFit` after first visible frame and again when burst completes (t==1)
- Add a one‑shot reframe (300–400ms) guarded by mesh‑in‑scene and positions‑ready

4. Record demo (30–45s)

- White background; colored nodes; single burst (if visible); smooth two‑step framing; click‑to‑select highlight; no console errors; 60fps feel

## References

- Behavioral contract: `guides/behavioral-contract.md`
- MET‑style vision: `guides/met-morph-vision.md`
- SHA ledger: `guides/sha-ledger.md`
- Integration interfaces: `guides/integration-interfaces.md`

---

## Notes (Context preserved from prior runs)

- Post‑deadline status (14‑08‑2025): rendering stabilized; selection and colors pending; camera partially reliable
- No module resolution issues; harness route isolated; dev redirect active
