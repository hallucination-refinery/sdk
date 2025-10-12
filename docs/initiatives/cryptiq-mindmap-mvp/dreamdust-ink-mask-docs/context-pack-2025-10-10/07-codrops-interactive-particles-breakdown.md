Adaptation notes (2025-10-11)
- Our desired state differs (no overlays, camera fixed, particles-as-ink), but Codrops’ localized trail via a texture uniform is relevant. If we adopt a `uTouch` canvas, the falloff gating becomes texture-driven and independent of per-frame uniform toggles.
- Key lift: set the localized influence texture (or uniform flag) only after material is ready (post-reveal) to avoid race conditions; then sample in vertex and apply pixel scaling for screen-space displacement.
 - Shader ordering: ensure any view-dependent scale (e.g., `viewDist / uFocal`) is computed after view-space variables (`viewPos` / `viewPos4`) are defined to avoid compile errors.
- Flag latching: in production, post‑material/reveal timing is critical. If adopting a `uTouch` texture approach, the localized influence comes from the texture and avoids the risk of a forgotten boolean; still, initialize the texture only after material binding to avoid null uniforms.
 - Race avoidance (2025-10-12): Our prebaked path attaches the material directly to `<points>` without an `onMaterialValid` hook; a one-shot falloff write before attach is a no-op. Add a program-ready guard (RAF) or migrate to texture‑driven gating (`uTouch`) to eliminate boolean timing risk.
How the Codrops “Interactive Particles with Three.js” interaction works

Interactive particles are rendered with GPU instancing and are displaced by a cursor-driven texture. CPU does not touch particles per frame. The shader does the work.  ￼

⸻

What you are building
	•	A grid of quads, one per visible pixel in a source image. Quads render as circular sprites.  ￼
	•	An invisible plane captures cursor UVs via a Raycaster.  ￼
	•	A small off-screen canvas records a fading trail. That canvas is a CanvasTexture uniform.  ￼
	•	The vertex shader samples the trail texture and pushes nearby particles along randomized directions.  ￼

⸻

System components
	•	Instanced geometry: InstancedBufferGeometry with per-instance attributes: index, offset, angle. One quad is reused N times.  ￼
	•	Material: RawShaderMaterial with custom vertex and fragment shaders. Uniforms include time, size, randomness, depth, source image, texture size, and the touch texture.  ￼
	•	Interactivity: Raycaster against an invisible PlaneBufferGeometry that matches the particle field. Use intersection UVs to draw the trail to an off-screen canvas. Upload as CanvasTexture.  ￼
	•	Optimization: Pre-discard dark pixels to reduce instance count.  ￼

⸻

Data flow
	1.	Preprocess image → instances
	•	Draw the source image to a temporary <canvas>. Read pixels.
	•	Keep pixels above a brightness threshold. Each surviving pixel becomes one instance. Store:
	•	pindex (instance id)
	•	offset = (x, y, 0) in pixel space
	•	angle = random per-instance angle
	•	Result: arrays for InstancedBufferAttributes.  ￼
	2.	Per-frame updates on CPU
	•	Raycast cursor → UV on the invisible plane.
	•	Append UV to a short trail buffer with easing for radius.
	•	Clear and draw the trail to an off-screen canvas.
	•	Mark the CanvasTexture needsUpdate = true. Pass it to the shader as uTouch.  ￼
	3.	Per-vertex work on GPU
	•	Compute per-instance position from offset.
	•	Add small random/noise displacements and time-based depth wobble.
	•	Sample uTouch at the per-instance UV to get a scalar influence t.
	•	Displace x, y, z by t * rnd * scale along a direction derived from angle.
	•	Compute point size from noise and source image brightness.  ￼
	4.	Per-fragment work on GPU
	•	Sample source image color at the same UV. Convert to greyscale (luminosity).
	•	Apply circular alpha falloff so each quad looks like a soft particle.  ￼

⸻

Geometry layout
	•	One quad template: 4 vertices, 2 triangles, with positions and uvs in local quad space. Instances reference this template.  ￼
	•	Key per-instance attributes:
	•	offset: vec3 → pixel position (x, y, 0) in the image grid
	•	pindex: uint → id used for stable randomness
	•	angle: float → motion direction seed  ￼
	•	UV mapping to the image:
	•	puv = (offset.xy + 0.5) / uTextureSize inside the shader. This aligns each instance to its source pixel. (The article implies this standard mapping.)  ￼

⸻

Material and uniforms
	•	Material: RawShaderMaterial to control all shader inputs explicitly. Include MVP matrices in the shader.  ￼
	•	Uniforms:
	•	uTime, uRandom, uDepth, uSize control animation and sprite size
	•	uTexture and uTextureSize reference the source image
	•	uTouch is the trail texture generated per frame  ￼

⸻

Interactivity pipeline
	1.	Capture cursor
	•	Add an invisible PlaneBufferGeometry with same width and height as the particle grid.
	•	raycaster.setFromCamera(ndc, camera) and test intersection with the plane.
	•	Read intersection.uv.  ￼
	2.	Build the trail
	•	Maintain a queue of recent UVs and radii.
	•	Animate radii with in/out easing.
	•	Draw filled circles to an off-screen <canvas>. Old marks fade by drawing a translucent rect over the canvas each frame.
	•	Wrap the canvas as new THREE.CanvasTexture(canvas), set needsUpdate = true.  ￼
	3.	Use the trail in the shader
	•	Sample t = texture2D(uTouch, puv).r.
	•	Apply t as a force multiplier: push along (cos(angle), sin(angle)) and add depth.  ￼

⸻

Fragment shader sprite shaping
	•	Sample source image RGB at puv. Convert to greyscale via luminosity.
	•	Compute a circular alpha with smoothstep on the quad UV to get a soft disc.
	•	Output greyscale color with computed alpha.  ￼

⸻

Performance notes
	•	Instancing is the lever. One draw call renders tens of thousands of sprites. Avoid per-particle CPU updates.  ￼
	•	Cull dark pixels up front. Thresholding reduces instances and improves frame time.  ￼
	•	Small touch texture. Keep the off-screen canvas modest (for example 256–512 px). Update once per frame. Use linear filtering. (Standard CanvasTexture practice.)  ￼
	•	Transparency and depth. The demo disables depth test for predictable layering. Consider sorting if artifacts appear.  ￼

⸻

Minimal scaffold (pseudocode)

// geometry
const quad = new THREE.InstancedBufferGeometry();
// set quad positions/uvs and index once
// compute indices, offsets, angles from image pixels
quad.setAttribute('pindex', new THREE.InstancedBufferAttribute(pindex, 1));
quad.setAttribute('offset', new THREE.InstancedBufferAttribute(offsets, 3));
quad.setAttribute('angle',  new THREE.InstancedBufferAttribute(angles, 1));

// material
const uniforms = {
  uTime: {value: 0},
  uRandom: {value: 1.0},
  uDepth: {value: 2.0},
  uSize: {value: 0.0},
  uTexture: {value: imageTexture},
  uTextureSize: {value: new THREE.Vector2(w, h)},
  uTouch: {value: touchTexture}
};
const mat = new THREE.RawShaderMaterial({uniforms, vertexShader, fragmentShader, depthTest: false, transparent: true});

// mesh
const mesh = new THREE.Mesh(quad, mat);
scene.add(mesh);

// interactivity
const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(w, h), invisibleMat);
scene.add(plane);
const raycaster = new THREE.Raycaster();

function onPointerMove(e){
  // set ray, intersect plane, get uv
  // push uv + radius into trail buffer
}

function drawTrail(){
  // fade, draw circles, touchTexture.needsUpdate = true
}

function render(t){
  uniforms.uTime.value = t * 0.001;
  drawTrail();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

References for APIs: InstancedBufferGeometry, RawShaderMaterial, CanvasTexture, Raycaster.  ￼

⸻

Common pitfalls and fixes
	•	Wrong UV space. Use the plane’s intersection UV, not screen pixels. The shader expects [0,1].  ￼
	•	Trail not visible. Ensure CanvasTexture.needsUpdate = true. Confirm the canvas draws non-transparent marks.  ￼
	•	RawShaderMaterial compile errors. Provide projectionMatrix, modelViewMatrix, and position in the vertex shader.  ￼
	•	Too many instances. Apply brightness threshold before building attributes.  ￼

⸻

Why this approach
	•	GPU-first interaction. Texture-driven displacement scales to tens of thousands of particles. Per-particle CPU forces do not.  ￼
	•	Temporal trail. The texture keeps cursor history and easing without per-particle state.  ￼

⸻

Verify and extend
	•	Run the original demo and code. The repo shows project setup and dependencies. Use npm start.  ￼
	•	Swap the sprite shape. Replace circular alpha with a signed-distance field for custom shapes. (Standard fragment shaping.)
	•	Use Points as an alternative. Viable for simple discs but lacks per-instance quads and custom UV shaping. See Three.js points raycasting examples if needed.  ￼

⸻

Sources
	•	Codrops tutorial and explanation.  ￼
	•	Live demo and GitHub code.  ￼
	•	Three.js docs: InstancedBufferGeometry, RawShaderMaterial, CanvasTexture, Raycaster.  ￼

⸻

Notes on rigor and limits
	•	The article’s shader snippets and attribute names are authoritative for this effect. I followed its structure and cross-checked API behavior against the official docs.  ￼
	•	Exact GLSL varies by project setup (glslify, defines, include paths). The pipeline above remains valid across versions. The GitHub repo confirms build steps and library list.  ￼
