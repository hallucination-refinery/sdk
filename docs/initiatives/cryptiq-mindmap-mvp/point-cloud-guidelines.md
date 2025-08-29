## Executive Summary

This reference consolidates authoritative guidance for rendering a single‑image airy point cloud in a React Three Fiber / three.js stack. It covers camera/controls ergonomics, PV⁻¹ capture with forward projection, post‑processing pass ordering, color management/tonemapping, WebGL limits, depth precision, and attribute binding. Following these prevents common failures like “tiny white dot/off‑frustum,” screen‑locked reprojection, composer not drawing, and washed or over‑bloomed frames.

## Highlights

- **OrbitControls essentials (target, damping, distance bounds)**: Set a meaningful target at the cloud’s center for visible parallax; enable damping for natural feel and ensure `controls.update()` advances; bound `minDistance`/`maxDistance` so zoom doesn’t silently cap.
- **R3F/drei control wiring and frameloop hygiene**: Use `<OrbitControls makeDefault />` so R3F routes pointer/wheel correctly. With `frameloop="demand"`, damping/autorotate won’t advance without `invalidate()`; prefer `frameloop="always"` while interacting.
- **EffectComposer / UnrealBloom: pass order and screen output**: Passes run in insertion order; the last pass must render to screen. Feed a `RenderPass` into bloom, then ensure the final pass writes to screen to avoid a black or unchanged canvas.
- **PV⁻¹ capture + forward projection (avoid screen‑locked reprojection)**: In three.js, PV⁻¹ = `camera.matrixWorld * camera.projectionMatrixInverse`. Capture once (after camera settles) to reconstruct world positions from NDC, then project each frame with current `P·V`.
- **Attribute binding and shader inputs**: Provide custom per‑vertex data via `BufferGeometry.setAttribute(name, BufferAttribute)`; attribute names/types must match shader inputs, with correct `itemSize` and consistent counts. Mismatches often render as a single dot.
- **Color management and tonemapping**: Use a linear workflow and exactly one output transform path (renderer tone mapping/output color space, or an equivalent post pass). Avoid double conversions that wash or over‑bloom.
- **WebGL limits to diagnose “tiny dot”**: Query `ALIASED_POINT_SIZE_RANGE`, `MAX_VERTEX_ATTRIBS`, `MAX_TEXTURE_SIZE`, and `DEPTH_BITS`. Low max point size clamps points to ~1px; attribute slot overuse drops data.
- **Depth precision (near/far choice)**: Precision is dominated by the near plane; push near out and pull far in so the cloud’s depth band lies in a high‑precision range.
- **Texture origin & Y‑flip only when indicated**: Flip Y at upload only if textures appear upside‑down; don’t flip NDC or geometry.

## Source Index

- three.js — OrbitControls (examples): [https://threejs.org/docs/examples/en/controls/OrbitControls.html](https://threejs.org/docs/examples/en/controls/OrbitControls.html)
- React Three Fiber — Canvas API & frameloop: [https://r3f.docs.pmnd.rs/api/canvas](https://r3f.docs.pmnd.rs/api/canvas)
- drei — Controls introduction (makeDefault): [https://drei.docs.pmnd.rs/controls/introduction](https://drei.docs.pmnd.rs/controls/introduction)
- three.js — EffectComposer: [https://threejs.org/docs/examples/en/postprocessing/EffectComposer.html](https://threejs.org/docs/examples/en/postprocessing/EffectComposer.html)
- three.js example — Unreal Bloom: [https://threejs.org/examples/webgl_postprocessing_unreal_bloom.html](https://threejs.org/examples/webgl_postprocessing_unreal_bloom.html)
- MDN — WebGL model‑view‑projection: [https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_model_view_projection](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_model_view_projection)
- three.js — Matrix4 / Camera matrices: [https://threejs.org/docs/api/en/math/Matrix4.html](https://threejs.org/docs/api/en/math/Matrix4.html)
- three.js — ShaderMaterial: [https://threejs.org/docs/api/en/materials/ShaderMaterial.html](https://threejs.org/docs/api/en/materials/ShaderMaterial.html)
- three.js — BufferGeometry: [https://threejs.org/docs/api/en/core/BufferGeometry.html](https://threejs.org/docs/api/en/core/BufferGeometry.html)
- three.js — BufferAttribute: [https://threejs.org/docs/api/en/core/BufferAttribute.html](https://threejs.org/docs/api/en/core/BufferAttribute.html)
- three.js — WebGLProgram: [https://threejs.org/docs/api/en/renderers/webgl/WebGLProgram.html](https://threejs.org/docs/api/en/renderers/webgl/WebGLProgram.html)
- three.js — Renderer constants (Tone Mapping): [https://threejs.org/docs/api/en/constants/Renderer.html](https://threejs.org/docs/api/en/constants/Renderer.html)
- three.js — Material.toneMapped: [https://threejs.org/docs/api/en/materials/Material.html](https://threejs.org/docs/api/en/materials/Material.html)
- three.js — Color Spaces: [https://threejs.org/docs/api/en/constants/Core.html#color-spaces](https://threejs.org/docs/api/en/constants/Core.html#color-spaces)
- Khronos — WebGL 2.0 Quick Reference: [https://www.khronos.org/files/webgl20-reference-guide.pdf](https://www.khronos.org/files/webgl20-reference-guide.pdf)
- MDN — getParameter & constants: [https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter)
- MDN — pixelStorei(UNPACK_FLIP_Y_WEBGL): [https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/pixelStorei](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/pixelStorei)
- MDN — Using textures in WebGL: [https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL)
- OpenGL Wiki — Depth Buffer Precision: [https://www.khronos.org/opengl/wiki/Depth_Buffer_Precision](https://www.khronos.org/opengl/wiki/Depth_Buffer_Precision)

## Sanity Checks

- **Flat‑sheet via captured PV⁻¹**: Reconstruct a flat sheet at a mid‑depth from a single image using a one‑time captured PV⁻¹ and project with the current camera. If you see a dot or nothing, suspect empty/mismatched attributes or point‑size clamps.
- **PLUS/MINUS forward march**: For a given pixel ray, sample forward along the ray (PLUS) to the depth band, then offset slightly closer/farther. Asymmetric shift suggests PV timing or depth mapping errors.
- **Delayed PV⁻¹ capture**: Capture once after a couple frames (post‑layout) so aspect/FOV are final; first‑frame capture can produce screen‑locked reprojection.
- **NDC Y‑flip verification**: Use a labeled test grid; if letters are upside‑down only in textures, flip texture upload (image origin) — not geometry/NDC.
- **Composer output check**: Run once without composer (direct renderer), then with composer ensuring the last pass writes to screen; check for double tonemapping/color‑space conversions.
- **Controls bounds probe**: Temporarily set generous `minDistance`/`maxDistance`, confirm target is on the cloud, and verify damping advances over frames.
- **WebGL limits probe**: Log `ALIASED_POINT_SIZE_RANGE`, `MAX_VERTEX_ATTRIBS`, `MAX_TEXTURE_SIZE`, `DEPTH_BITS` to choose safe parameters.
- **Depth band sweep**: Adjust near/far and the band span while orbiting; if you see z‑fighting/popping, tighten the ratio (push near out, pull far in).
## Executive Summary

This reference consolidates authoritative guidance for rendering a single‑image airy point cloud in a React Three Fiber / three.js stack. It focuses on camera/controls ergonomics, PV⁻¹ capture with forward projection, pass ordering for post‑processing, color management/tonemapping, WebGL limits, depth precision, and attribute binding. Following these prevents common failures like the “tiny white dot/off‑frustum,” screen‑locked reprojection, composer not drawing, and washed or over‑bloomed frames.

## Highlights
	1.	OrbitControls essentials (target, damping, distance bounds).
Source: three.js docs — OrbitControls. Set a meaningful target at the cloud’s center so orbiting produces visible parallax; enable damping for natural feel but call controls.update() each frame; and bound minDistance/maxDistance so zoom doesn’t cap out silently. These avoid “no visible motion” when the target is off‑scene and “zoom feels capped” when bounds are too tight.  ￼
	2.	R3F/drei control wiring and frameloop hygiene.
Sources: drei docs — Controls intro; R3F docs — Canvas & scaling performance. Use <OrbitControls makeDefault /> so R3F’s event system routes pointer/wheel to this controller (avoids multiple competing controls). If you run frameloop="demand", remember damping/auto‑rotate won’t advance without invalidate(); use on‑demand invalidation or frameloop="always" while interacting. This prevents “controls feel dead” on demand‑rendered canvases.  ￼ ￼
	3.	EffectComposer / UnrealBloom: pass order and screen output.
Sources: three.js docs — EffectComposer; three.js example — Unreal Bloom. Passes execute in insertion order; the last pass renders to screen. Ensure a RenderPass feeds bloom, then finish with a screen‑writing pass. Misordering or omitting the final output makes the canvas black or unchanged, and “double rendering” (composer and direct renderer) causes over‑bright frames.  ￼
	4.	PV⁻¹ capture + forward projection: avoid screen‑locked reprojection.
Sources: MDN — WebGL model‑view‑projection; three.js docs — Camera/Matrix4. In three.js, PV⁻¹ = camera.matrixWorld · camera.projectionMatrixInverse. Capture once (after camera settles) and use it to reconstruct world positions from image NDC; then project every frame with the current P·V. Recomputing PV⁻¹ from the current camera each frame and then re‑projecting with that same camera collapses to identity, causing “screen‑locked” points.  ￼ ￼
	5.	Attribute binding and shader inputs (silent collapses).
Sources: three.js docs — ShaderMaterial; BufferGeometry/BufferAttribute; WebGLProgram built‑ins. Custom per‑vertex data (e.g., aDepth, stochastic keep flags) must be provided via BufferGeometry.setAttribute(name, BufferAttribute); names/types must match your shader inputs, and arrays must have correct itemSize and consistent counts across attributes. Missing or mismatched attributes (e.g., wrong itemSize, zero‑length array) often render as a single bright dot. Built‑ins available are position, uv, color, and standard camera/object matrices.  ￼
	6.	Color management and tonemapping: one, correct output transform.
Sources: three.js docs — Renderer constants (Tone Mapping); Material.toneMapped; Core constants (Color Spaces); R3F Canvas. Use a linear workflow: tag color textures appropriately and ensure one output transform path: renderer toneMapping plus output color space, or an equivalent pass at the end of post‑processing — not both. Materials respect toneMapped by default; disable it if a pass or overlay must remain untonemapped. Mismatches or double conversion lead to washed/over‑bloomed frames.  ￼ ￼
	7.	WebGL limits to diagnose “tiny dot” and attribute failures.
Sources: Khronos — WebGL 2.0 Quick Reference; MDN — getParameter & constants. Query ALIASED_POINT_SIZE_RANGE (point size clamp), MAX_VERTEX_ATTRIBS (attribute slots), MAX_TEXTURE_SIZE (image→attribute baking), and DEPTH_BITS. On hardware with low point‑size maxima, points can clamp to 1px (appearing like a pin‑prick); exceeding attribute limits silently drops data. Use gl.getParameter(...) to confirm.  ￼ ￼
	8.	Depth precision: choose near/far for point clouds.
Source: OpenGL Wiki — Depth Buffer Precision. Precision is non‑linear and dominated by the near plane; push near out and pull far in to improve effective depth resolution across your band. Excessive far/near ratios cause z‑fighting/quantization that makes sparse, airy clouds flicker or collapse.  ￼
	9.	Texture origin & Y‑flip only when data indicates it.
Sources: MDN — pixelStorei(UNPACK_FLIP_Y_WEBGL); “Using textures in WebGL”. HTML images are top‑left–origin while GL expects bottom‑left; flip Y at upload only for image‑derived data that’s visibly upside‑down. Don’t “flip” NDC or geometry — NDC is standardized (−1..1 cube), and flipping the wrong thing misaligns color and depth, causing off‑frustum warping.  ￼

## SOURCE INDEX
	•	three.js — OrbitControls (examples docs): https://threejs.org/docs/examples/en/controls/OrbitControls.html  ￼
	•	React Three Fiber — Canvas API & frameloop: https://r3f.docs.pmnd.rs/api/canvas  ￼
	•	drei — Controls introduction (makeDefault): https://drei.docs.pmnd.rs/controls/introduction  ￼
	•	three.js — EffectComposer: https://threejs.org/docs/examples/en/postprocessing/EffectComposer.html  ￼
	•	three.js example — Unreal Bloom: https://threejs.org/examples/webgl_postprocessing_unreal_bloom.html  ￼
	•	MDN — WebGL model‑view‑projection: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_model_view_projection  ￼
	•	three.js — Matrix4 / Camera matrices (projectionMatrixInverse, matrixWorld): https://threejs.org/docs/api/en/math/Matrix4.html  ￼
	•	three.js — ShaderMaterial; BufferGeometry; BufferAttribute; WebGLProgram (built‑ins):
https://threejs.org/docs/api/en/materials/ShaderMaterial.html; https://threejs.org/docs/api/en/core/BufferGeometry.html; https://threejs.org/docs/api/en/core/BufferAttribute.html; https://threejs.org/docs/api/en/renderers/webgl/WebGLProgram.html  ￼
	•	three.js — Renderer constants (Tone Mapping); Material.toneMapped; Color Spaces:
https://threejs.org/docs/api/en/constants/Renderer.html; https://threejs.org/docs/api/en/materials/Material.html; https://threejs.org/docs/api/en/constants/Core.html#color-spaces  ￼
	•	Khronos — WebGL 2.0 Quick Reference (limits): https://www.khronos.org/files/webgl20-reference-guide.pdf  ￼
	•	MDN — getParameter & constants; pixelStorei(UNPACK_FLIP_Y_WEBGL); Using textures:
https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getParameter; https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants; https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/pixelStorei; https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Using_textures_in_WebGL  ￼
	•	OpenGL Wiki — Depth Buffer Precision: https://www.khronos.org/opengl/wiki/Depth_Buffer_Precision  ￼

## SANITY CHECKS
	•	Flat‑sheet via captured PV⁻¹. Reconstruct a flat sheet at a mid‑depth from a single image using a one‑time captured PV⁻¹ and project with the current camera. Expect a full, stable sheet that orbits correctly. If you see a dot or nothing, suspect empty/mismatched attributes or point‑size clamps.
	•	PLUS/MINUS forward march. For a given pixel ray, sample forward along the ray (PLUS) to the depth band, then offset slightly closer/farther. The projected shift should be small and symmetric; asymmetric drift suggests PV timing or depth mapping errors.
	•	Delayed PV⁻¹ capture. Capture once after a couple frames (post‑layout) so aspect/FOV are final. A first‑frame capture that races layout can produce screen‑locked reprojection.
	•	NDC Y‑flip verification. Render a labeled test grid: if letters are upside‑down only in textures, flip texture upload (image origin) — not geometry/NDC. Mixed flips between color and depth indicate misalignment.
	•	Composer output check. Run once without the composer (direct renderer), then with composer ensuring the last pass writes to screen. If composer path is black, check pass order/output stage; if it’s over‑bright, look for duplicated tonemapping/color‑space conversions.
	•	Controls bounds probe. Temporarily set a generous minDistance/maxDistance, confirm target is on the cloud, and observe that enableDamping is advancing (visible decay over successive frames).
	•	WebGL limits probe. Log ALIASED_POINT_SIZE_RANGE, MAX_VERTEX_ATTRIBS, MAX_TEXTURE_SIZE, DEPTH_BITS. If point‑size max is small, prefer sizeAttenuation and adequate density; if attributes approach limits, reduce per‑point data.
	•	Depth band sweep. Nudge near/far and the depth band span while orbiting; z‑fighting or popping implies far/near is too extreme for the cloud’s scale — push near out and trim far.