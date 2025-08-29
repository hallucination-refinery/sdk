## DESIRED END-STATE

Ship a compelling, high-quality Cryptiq Mindmap app: visually polished, performant, and accessible. The left panel presents the quiz UI with precise typographic parity; the right panel renders a captivating 3D “airy point‑cloud” derived from static images, with smooth interaction, stable performance on consumer laptops, and clean code paths that are easy to tune and extend.

## GOAL (W)

Achieve the airy point‑cloud aesthetic for a single test image (Hong Kong neon) in the quiz page:

- Visible depth relief reconstructed from image + depth map
- Stochastic gaps/density for “smoke/air” feel
- Subtle world‑stable drift per particle
- Gentle bloom and filmic tonemapping
- Natural orbit/zoom; image recognizable from specific angles only
- Deterministic/static result given fixed inputs; tuning via code constants

## CURRENT STATUS

**Date/Time:** 10:15 AM NYC TIME, 29-08-2025

Symptoms

- Canvas side intermittently black and laggy; previously a small bright dot visible, not a full sheet/cloud.
- OrbitControls events fire but zoom feels capped/ineffective when dot appears.

Working implementation (key points)

- React Three Fiber `PointCloudStage` builds CPU attributes: `aUv` (uv), `aDepth` (normalized from 16‑bit packed RG), `color`.
- Custom shader intended to reconstruct world positions using a captured inverse view‑projection (`uPVInvCapture`), then project with current `P·V` for proper orbiting.
- Postprocessing bloom wired via `EffectComposer` with `renderToScreen = true`.
- Debug path currently committed to bypass unprojection and draw directly in clip space from NDC to validate attributes; PV^-1 is deliberately unused in this mode. Despite this, user still sees a dot/black screen.

Blocker hypotheses

1. Attribute/geometry integrity issue: generated buffers may be empty/tiny (e.g., `stride`, `keepRatio`, or width/height mismatch), producing only a handful of points → appears as a dot, bloom amplifies it.
2. Shader path not executing as expected (e.g., material program invalid, attributes not bound, or `gl_PointSize` extremely small), though clip‑space debug should have shown a sheet.
3. Runtime resource/DOM overlay: canvas covered or cleared by another element; however prior logs indicate pointer events reach the canvas and composer renders.
4. GPU/driver precision/perf cliff: excessive point count or browser throttling causing frame starvation; but we cap to ≤250k points.

What we tried / evidence

- Captured PV⁻¹ once and used world‑space unprojection; then changed to forward march (PLUS) and widened band (commit `e7a590dc`).
- Added two‑frame delay before PV⁻¹ capture to avoid aspect/FOV timing issues (same commit).
- Forced flat‑sheet at fixed depth (800) — still a dot (commit `a438d109`).
- Bypassed PV⁻¹ entirely; render in clip space from NDC using explicit `aUv` attribute — still not a sheet (commit `c50c5134`). This strongly suggests an attribute/geometry or point count issue, not matrix math.

Most likely current blocker

- The generated attribute buffers (`positions`, `uvs`, `depths`, `colors`) are nearly empty due to an index/stride or size mismatch, causing only a tiny number of points to render; bloom and tone mapping then make it appear as a bright dot. Alternatively, `gl_PointSize` could be <1 due to device pixel ratio or size clamping, but the debug shader sets a base size.

## LINKS

- apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx — core viewer component (attributes, shader, controls)

```apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
<bufferGeometry>
  <bufferAttribute attach="attributes-position" args={[positions, 3]} />
  {/** @ts-expect-error attachObject is supported at runtime */}
  <bufferAttribute attachObject={["attributes","aUv"]} args={[uvs, 2]} />
  {/** @ts-expect-error attachObject is supported at runtime */}
  <bufferAttribute attachObject={["attributes","aDepth"]} args={[depths, 1]} />
  <bufferAttribute attach="attributes-color" args={[colors, 3]} />
</bufferGeometry>
```

```apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
const capturedRef = React.useRef(false)
const captureDelayRef = React.useRef(2)
useFrame(({ camera }, dt) => {
  const mat = matRef.current
  if (!mat) return
  const u = mat.uniforms as { uTime?: { value:number }; uPVInvCapture?: { value:THREE.Matrix4 } }
  if (u.uTime) u.uTime.value += dt
  if (!capturedRef.current && u.uPVInvCapture) {
    if (captureDelayRef.current > 0) { captureDelayRef.current -= 1; return }
    const pvInv = new THREE.Matrix4().copy((camera as THREE.PerspectiveCamera).matrixWorld)
      .multiply((camera as THREE.PerspectiveCamera).projectionMatrixInverse)
    u.uPVInvCapture.value.copy(pvInv)
    capturedRef.current = true
  }
})
```

```apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
// Debug: NDC clip-space path to validate attributes
vec2 ndc = aUv * 2.0 - 1.0;
gl_Position = vec4(ndc, 0.0, 1.0);
```

- apps/cryptiq-mindmap-demo/app/quiz/[slug]/page.tsx — integrates the stage into the quiz canvas; passes `sceneId`, etc. (search for `PointCloudStage` usage around where the canvas is rendered).
- tools/depth-cli/depth_cli.py — MiDaS depth map generator, outputs 16‑bit depth and RG‑packed PNG used by the viewer.

## PLAN

Short‑circuit to a known‑good baseline, then re‑enable features stepwise.

1. Verify attribute buffer sizes on CPU and log once (counts only).
   - Compute and log: `w,h`, candidate points, kept points, and Float32Array/Uint16Array lengths.
   - If kept points < 100, disable stochastic keep (`keepRatio=1`, `keep=1`).
    - Also log final `positions/uvs/depths/colors` lengths and first few samples.
2. Minimal render path (baseline toggle first).
   - CPU‑compute `positions` in view/world as a flat sheet using NDC→PV⁻¹ (single mid‑depth), then render with `<points><pointsMaterial size=2 sizeAttenuation /></points>`.
   - Expect a visible sheet; if not, it’s definitely attributes or point count.
    - Provide a runtime flag (prop or constant) to toggle Baseline vs Shader.
3. Restore custom shader gradually (re‑enable PV⁻¹ stepwise):
   - Step A: Shader uses `aUv` only, clip‑space sheet; confirm sheet.
   - Step B: Switch to PV⁻¹ world‑space with constant depth; confirm sheet moves with orbit.
   - Step C: Reintroduce depth band mapping and drift; confirm cloud.
4. Controls sanity.
   - Temporarily set `minDistance=100`, `maxDistance=5000`, `target={[0,0,0]}`.
   - Ensure canvas `pointerEvents='auto'` and no overlay divs on top.
5. Performance safeguards.
   - Cap points to ≤150k initially; `stride`≥2 (page default currently 1; raise during bring‑up).
   - Bloom off until geometry verified; then enable strength≈0.12.
6. Once the sheet/cloud renders reliably, tune for “tweet look”.
   - Density: stochastic keep by luma and depth, `stride`, point size by luma.
   - Depth feel: band tightening and `uGamma`.
   - Aesthetics: subtle drift basis in world, additive bloom.

Deliverables for this pass

- A working CPU‑verified sheet via `pointsMaterial`.
- Logged counts showing adequate point numbers (≥20k typical).
- A switchable flag to toggle shader vs. baseline; once green, default to shader.

## RUNNING NOTES

## UNCERTAINTIES

- Are color/depth images the same dimensions at runtime? We min() them but mismatches may zero out sampling and, more critically, misindex buffers.
- Is `stride` or keep‑ratio eliminating almost all points on certain images? We need explicit counts.
- Any DOM overlay/z‑index clearing the canvas after render? Inspect with DevTools’ layers.
- Are we hitting a Three.js point size clamp on the device? Baseline will confirm.
- Is PV⁻¹ captured before camera aspect/FOV settle on first frame? Delay should mitigate; baseline path removes this dependency.
 - Data‑integrity risk: color/depth indexing currently uses a shared `w` for both; when `cw != dw` or `ch != dh` we must compute `pColor = y*cw + x` and `pDepth = y*dw + x`. Make this fix early.

### Asset layout expectations
- Viewer loads assets at `.../<sceneId>/{color.png, depth16.png, depth_rg.png}`. Ensure CLI outputs are renamed and placed accordingly.
