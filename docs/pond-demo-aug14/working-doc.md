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

---

# APPENDED UPDATE Saturday, 3:27 PM EST, 16-08-2025

## Regarding the Latent Integration Branch

- Graph/harness state
  - Your harness mounts and passes 3 nodes, 2 links. Logs confirm `graphData` arrives and `window.__FG` is exposed.
  - Clicking the canvas repeatedly fires “Background clicked”, meaning our raycaster consistently returns 0 hits.

- What the renderer does (per code) and when
  - Mesh creation: `InstancedNodeMesh.build(count)` creates a `THREE.InstancedMesh` with `SphereGeometry`, `MeshBasicMaterial({ vertexColors:true, transparent:false })`, injects `aOpacity` into the shader, and computes `boundingSphere` + `boundingBox`.
  - Color pipeline before first render: Adapter sets `mesh.instanceColor = new THREE.InstancedBufferAttribute(Float32Array(count*3),3)`, seeds colors via `mesh.setColorAt(i, THREE.Color(...))`, and sets `mesh.instanceColor.needsUpdate = true`. Material base color is white, so instance colors aren’t tinted.
  - Manager wiring: `NodeAttributeManager.setMesh(mesh)` safeguards `updateRange/usage` on `instanceMatrix`, `instanceColor`, and `aOpacity`. On `registerNode`, it caches a baseColor, writes to its CPU color buffer and now marks color dirty so the first `flush()` uploads to GPU.
  - Initial state: For each node, adapter sets position to origin, opacity to 1, color (from `nodeColor` or default), and computes target positions. It then calls `mgr.flush()` to push CPU buffers to GPU before the first visible frame.
  - Forced-visibility path (trace=1): It sets per-node world positions immediately, opacity=1, color, calls `mgr.flush()`, and runs `zoomToFit` twice (immediate + delayed).
  - Burst path (trace=0): Per-frame it lerps positions from origin to targets, and after `t==1` runs `zoomToFit` twice (immediate + delayed). Each frame ends with a single `mgr.flush()`.

- What selection does (per code)
  - A `THREE.Raycaster` is created and a `pointerdown` listener is added on the canvas element.
  - Before each pick: `mesh.updateMatrixWorld(true)` and `camera.updateMatrixWorld(true)` are called; ray is set from NDC; `intersectObject(mesh, false)` is used.
  - On hit: it resolves `nodeId` via `mgr.idAt(instanceId)`, sets selection color (orange), and relies on the per-frame `flush()` to upload.
  - On miss: it restores previous selection color and calls `onBackgroundClick`. Separately, the R3F `<Canvas>` has `onPointerMissed` wired to `onBackgroundClick`, so background logs can also come from misses at the Canvas layer.

- Why your symptoms still show “no change” despite these edits (most probable)
  - Raycast miss persists: The canvas receives clicks but `intersectObject(mesh, false)` returns no hits. Given world matrices and bounds are updated, typical remaining causes are:
    - Camera is not framing the mesh at the time of clicking (mesh is off-screen or behind the near plane); “Background clicked” is consistent with the ray not intersecting any geometry.
    - Instances exist but their effective transforms are degenerate at the moment of pick (e.g., identity/zero translation) while camera is at the origin, yielding numerical issues.
  - Colors still appear black: We seed instance colors and mark color dirty for first `flush()`, but if the mesh is off-camera or entirely missed by the camera frustum you’ll never visually confirm color, and clicks will keep logging background. In short: even correct colors won’t be visible if the camera never frames the instanced mesh.

- Cross-checks that follow directly from code (no edits; run-time verification steps)
  - Verify the instances exist and have data
    - In console: get the mesh from `__FG.scene()` children (the `InstancedMesh`). Check:
      - `mesh.count` is 3
      - `mesh.instanceMatrix.count` is 3 and `mesh.instanceMatrix.needsUpdate === false` after a frame
      - `mesh.instanceColor && mesh.instanceColor.count === 3`
      - `mesh.material.vertexColors === true` and `mesh.material.color.getHexString() === 'ffffff'`
  - Verify position/opacity/color buffers contain expected values
    - `mesh.getMatrixAt(0, new THREE.Matrix4()).elements` shows a translation (indices 12–14 not all 0 after burst/trace=1)
    - `mesh.geometry.getAttribute('aOpacity').array.slice(0,3)` ~ [1,1,1]
    - `mesh.instanceColor.array.slice(0,9)` not all zeros (values ~0–1 floats)
  - Verify camera and framing actually occur
    - `__FG.camera().position` should be far from origin (positive z) after the immediate/delayed `zoomToFit` calls. If it remains near {0,0,0}, the framing never happened in practice even though code requests it.
  - Verify pickability
    - `typeof mesh.raycast === 'function'` and `mesh.raycast === THREE.InstancedMesh.prototype.raycast` is true
    - With the camera visible framing, `new THREE.Raycaster().intersectObject(mesh, false)` from the devtools console (using the current camera) returns hits with `instanceId`.

- Bottom line
  - The code paths for color seeding, first-flush upload, and raycast setup are present. Your logs (“Background clicked”) indicate the ray never intersects the mesh, which points to a framing/visibility issue at runtime, not the color pipeline itself. Until the camera is reliably moved to frame the instances (and we confirm via runtime checks above), changes to colors won’t be visible and picks will continue to miss.
