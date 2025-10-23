# Ink Mirroring Pipeline Audit — 2025-10-10

## Scope
- Understand how left/right and up/down mirroring is applied end‑to‑end across the stage (geometry/shader) and input (ink heatmap), and identify the single, correct place to apply the transform so ink follows the pointer.

## Sources Consulted
- Stage orchestration: apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:2261
- Stage → context mirror fan‑out: apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:2266
- Stage → InkSurface mirror props: apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:2777
- Debug toggles for mirrors: apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:3121
- Shader (screen‑space UV derivation): apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:458
- Shader (vertex ink sampling): apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:339
- Shader (fragment ink sampling): apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:575
- Overlay host (proven ink path): apps/cryptiq-mindmap-demo/app/components/dreamdust/InkFieldHost.tsx:613
- Pointer capture helper: apps/cryptiq-mindmap-demo/app/components/dreamdust/StrokeCaptureCanvas.tsx:310
- Ink heatmap (stroke → texture): apps/cryptiq-mindmap-demo/app/components/dreamdust/InkField.ts:24
- InkSurface pointer→UV + guard logging: apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx:210

## 1) Current Mirror Pipeline (Stage)
- The stage computes a local reflection scale from UI mirror flags: PointCloudStage.tsx:2261
  - `mirrorScale = [ ui.mirrorLR ? -1 : 1, ui.mirrorUD ? -1 : 1, 1 ]`
- It propagates mirror flags to the Dreamdust context so downstream consumers know the current orientation: PointCloudStage.tsx:2266
  - `dreamdustCtx.setMirrorFlags(!!ui.mirrorLR, !!ui.mirrorUD)`
- It also passes the same flags into `InkSurface` via props: PointCloudStage.tsx:2777
- In the shader, the ink sampling UV is derived from clip‑space to screen‑space (NDC → [0,1]): DreamdustMaterial.ts:458 (`vInkUv = ss`).
  - Mirroring the geometry (via `mirrorScale`) flips the screen‑space mapping for the mesh itself; `vInkUv` reflects the final on‑screen position of each point.
  - There is no separate “mirror define” in the shader; mirroring happens by transforming geometry, not by conditionally inverting UVs in shader code.

Implication: If the ink heatmap is defined in screen‑space UVs, it should not be flipped twice. A single geometry mirror should suffice; the ink texture sampling will track on‑screen positions via `vInkUv`.

## 2) Proven Ink Path (Overlay)
- `InkFieldHost` renders a separate capture canvas and produces the ink heatmap. It does not explicitly mirror stroke coordinates; strokes are normalized from pointer events to [0,1]: StrokeCaptureCanvas.tsx:310.
- `InkField` consumes normalized coordinates and paints into a texture; it has no mirroring logic; it resolves coordinate modes but does not multiply by ±1: InkField.ts:24.
- Mirroring still worked historically because the stage mirrored geometry; the overlay wrote strokes in screen UV as‑is, and the shader sampled in screen UV. No double flip was performed in the overlay.

Implication: The “working” pipeline applied mirroring only in the stage (geometry), never in the stroke painter.

## 3) InkSurface Path (New Input)
- `InkSurface` converts pointer client coordinates to normalized UV based on the R3F canvas bounds and logs a guard with raw/clamped values and current mirror flags: InkSurface.tsx:210.
- The stage passes `mirrorLR`/`mirrorUD` flags into `InkSurface` (PointCloudStage.tsx:2777), and it also pushes those flags into context (PointCloudStage.tsx:2266), providing a single source of truth for orientation.

Observed at runtime (from recent sessions):
- Guard logs show mirrored clamped UVs (e.g., raw X 0.094 → clamped X 0.906 with `mirrorLR: true`), meaning InkSurface was applying an extra flip while the stage already mirrored geometry. This leads to “teal shows on the opposite side” because the data was flipped twice end‑to‑end.

## 4) Decide The True Transform
- Shader ink sampling UV (`vInkUv`) is the on‑screen position of each point; geometry mirroring already changes which points occupy which screen UVs.
- Therefore, the correct approach is:
  - Pointer → heatmap (InkSurface): do NOT mirror; write strokes in raw screen UV ([0,1]).
  - Stage: apply mirror via geometry scale only (as it already does).
  - Shader: sample `uInkTex` in screen UV space (`vInkUv`) without additional flip logic.

Derived rule (expected):
- When `mirrorLR` is true: geometry is mirrored on X; do not invert pointer UV.x again in the painter.
- When `mirrorUD` is true: geometry is mirrored on Y; do not invert pointer UV.y again in the painter.

Why this is correct:
- The ink texture is a screen‑space field; the mesh samples it using its final screen‑space coordinates. Mirroring the mesh naturally changes which parts of the texture it samples. A second flip of the texture writes (or of the sampled UV) would produce the “opposite‑side” artifact.

## Risks / Edge Cases
- If any other code path secretly flips UVs (e.g., debug mirroring in the shader, or a post‑processing pass that swaps X/Y), we could still see inversions. A quick search found no shader “mirror” defines; only `vInkUv = ss` (DreamdustMaterial.ts:458) and geometry mirroring.
- If the canvas bounds used by InkSurface do not match the R3F canvas (e.g., due to CSS scaling or DPR mismatches), pointer UV could be offset or stretched. Current guard logs print viewport; verify it matches `uniforms.uViewport` at gesture time.

## Validation Plan (Pre‑implementation)
1) With `?debug=1&inkProbe=1`, confirm the teal overlay follows the pointer when `mirrorLR`/`mirrorUD` are toggled (individually and together). Expect no inversion if InkSurface writes raw UVs and stage mirrors geometry.
2) Watch `[PC] ink-uv guard … raw/clamped … mirror: { … }` from InkSurface.tsx:210 and ensure clamped UVs equal raw UVs (i.e., no painter flip) while mirrors are applied in stage only.
3) Confirm `window.debugDreamdustUniforms.uViewport.value` matches the canvas CSS size (PointCloudStage sets it; useDreamdustUniforms keeps it updated).

## Implementation Outline (After validation)
- Ensure InkSurface writes raw screen UVs (no per‑stroke mirroring). Use mirror flags only for diagnostics.
- Keep stage geometry mirroring via `mirrorScale` (PointCloudStage.tsx:2261) and context flags fan‑out (PointCloudStage.tsx:2266).
- No changes needed in shader code; it already samples `uInkTex` at `vInkUv` (DreamdustMaterial.ts:458, 575).

## Acceptance Checklist (Post‑change)
- Teal overlay appears directly under the pointer for all four mirror combinations (LR on/off × UD on/off).
- `[PC] ink-uv guard` shows clamped ≈ raw and correct mirror flags.
- No “opposite side” artifact when drawing horizontally or vertically across the viewport.

