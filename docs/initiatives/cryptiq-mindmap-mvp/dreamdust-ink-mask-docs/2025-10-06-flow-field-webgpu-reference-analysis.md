# External Reference — WebGPU Flow Field (Pavel Mazhuga)

- Demo: https://pavelmazhuga.com/lab/flow-field/webgpu
- Source: https://github.com/pavel-mazhuga/portfolio/tree/main/src/app/lab/flow-field/webgpu
- Date: 2025-10-06

**Executive Summary**
- This is a Three.js WebGPU+TSL particle advection demo. It loads a GLTF mesh (face), uses its vertex positions as seeds for instanced sprites, and updates positions each frame via a ComputeNode driven by curl noise (4D with time) plus fractal noise velocity, pointer attraction, and life-based resets.
- Rendering uses `SpriteNodeMaterial` with additive bloom via the Node postprocessing chain. Interaction comes from a custom pointer class projecting to a plane in scene space.
- Relevance to Dreamdust: It exemplifies “gentle advection” with curl-noise flow fields and bloom halos — closely aligned with our Gentle Drift recommendation (no heavy fluid sim).

**Evidence Index (raw links)**
- Core demo: src/app/lab/flow-field/webgpu/demo.ts
  - https://raw.githubusercontent.com/pavel-mazhuga/portfolio/main/src/app/lab/flow-field/webgpu/demo.ts
- Page and React wrapper:
  - https://raw.githubusercontent.com/pavel-mazhuga/portfolio/main/src/app/lab/flow-field/webgpu/experience.tsx
  - https://raw.githubusercontent.com/pavel-mazhuga/portfolio/main/src/app/lab/flow-field/webgpu/page.tsx
- Noise nodes:
  - curlNoise4d: https://raw.githubusercontent.com/pavel-mazhuga/portfolio/main/src/utils/webgpu/nodes/noise/curlNoise4d.ts
  - simplexNoise3d: https://raw.githubusercontent.com/pavel-mazhuga/portfolio/main/src/utils/webgpu/nodes/noise/simplexNoise3d.ts
- Pointer utility:
  - https://raw.githubusercontent.com/pavel-mazhuga/portfolio/main/src/utils/webgpu/Pointer.ts

**Pipeline Overview**
- Renderer
  - `WebGPURenderer` with `ACESFilmicToneMapping`; DPR clamped to 1.5; scene background is a low-amplitude fractal noise node.
- Geometry seed
  - Loads `face2.glb` (GLTF), converts to non-indexed, centers and rotates X, then uses `geometry.attributes.position` as the particle base positions; `amount = vertexCount`.
- GPU buffers (per-instance Storage)
  - Base positions, current positions, velocities (vec3), life (float), and a strength buffer (float) for pointer contact/intensity. Created via `StorageInstancedBufferAttribute` and `storage(...)` TSL nodes.
- Initialization compute
  - Zero velocities, randomize life to [0,10) via `hash(instanceIndex).mul(10)`, set initial `strength=0`. Executed once with `renderer.computeAsync`.
- Update compute (per-frame)
  - ComputeNode function built with TSL `Fn(...)` updates velocity and position by combining:
    - Fractal noise velocity with friction.
    - Pointer attraction (direction from pointer to particle).
    - Flow field from curlNoise4d (position,time), split into “wandering” baseline and strength-gated push.
    - Life increases with distance-based decay; particle resets to base when `life>1` then wraps via `mod(1)`.
- Rendering
  - `SpriteNodeMaterial` with `positionNode` sourced from positions buffer, `scaleNode` combining life ramps, randomness, base scale, and contact strength, `colorNode` from `hash(instanceIndex)` plus strength. Discards outside circular sprite (radius 0.5) for soft round dots.
- Postprocessing
  - Node-based `bloom(scenePassColor, 0.12, 0.05, 0.25)` mixed additively with scene output.
- Interaction
  - `Pointer` class projects client pointer into scene via ray-plane intersection; exposes uniforms `uPointer`, `uPointerDown`, and smoothed `uPointerVelocity`.
- Controls
  - Tweakpane exposes cursor radius, base particle scale, pointer attraction strength, hover power/duration, wandering speed, contact scale multiplier, and a toggle for postprocessing.

**Key Code Evidence**
- Update compute (advection, life, pointer; demo.ts)
```
// demo.ts (selected)
this.updateParticlesCompute = Fn<any>(() => {
  const position = this.particlesPositionsBuffer!.element(instanceIndex);
  const basePosition = this.particlesBasePositionsBuffer!.element(instanceIndex);
  const velocity = this.particlesVelocitiesBuffer!.element(instanceIndex);
  const life = this.particlesLifeBuffer!.element(instanceIndex);
  const strength = strengthBuffer.element(instanceIndex);

  // velocity from fractal noise, then friction
  const vel = mx_fractal_noise_vec3(
      position.mul(this.params.turbFrequency),
      this.params.turbOctaves,
      this.params.turbLacunarity,
      this.params.turbGain,
      this.params.turbAmplitude,
  ).mul(life.add(0.015));
  velocity.addAssign(vel);
  velocity.mulAssign(float(this.params.turbFriction).oneMinus());

  // Cursor gating (strength)
  const distanceToCursor = this.pointerHandler.uPointer.distance(basePosition);
  const cursorStrength = float(this.uniforms.cursorRadius).sub(distanceToCursor).smoothstep(0, 1);
  strength.assign( strength.add(cursorStrength).sub(deltaTime.mul(this.uniforms.hoverDuration)).clamp(0, 1) );

  // Pointer attraction
  const pointerAttractionDirection = normalize(position.sub(this.pointerHandler.uPointer));
  const pointerAttraction = pointerAttractionDirection.mul(this.uniforms.pointerAttractionStrength);
  position.subAssign(pointerAttraction);

  // Flow field (curl noise) + wandering baseline
  const flowField = curlNoise4d(vec4(position, time)).toVar();
  const wandering = flowField.mul(this.uniforms.wanderingSpeed);
  position.addAssign(wandering.add(flowField.mul(deltaTime).mul(strength)));

  // Velocity push in XY when in contact
  position.xy.addAssign(velocity.mul(strength).mul(deltaTime).mul(this.uniforms.hoverPower));

  // Life/decay and reset
  const decayFrequency = 1;
  const distanceDecay = basePosition.distance(position).remapClamp(0, 1, 0.2, 1);
  const newLife = life.add(deltaTime.mul(decayFrequency).mul(distanceDecay)).toVar();
  If(newLife.greaterThan(1), () => { position.assign(basePosition); });
  life.assign(newLife.mod(1));
})().compute(this.amount);
```

- Curl noise 4D (time-varying curl of 3D simplex noise)
```
// curlNoise4d.ts (selected)
export const curlNoise4d = Fn(([p_immutable]) => {
  const p = vec4(p_immutable).toVar();
  const e = float(0.1);
  const dx = vec4(e, 0.0, 0.0, 1.0).toVar();
  const dy = vec4(0.0, e, 0.0, 1.0).toVar();
  const dz = vec4(0.0, 0.0, e, 1.0).toVar();
  const p_x0 = vec3(snoise3(p.sub(dx))).toVar();
  const p_x1 = vec3(snoise3(p.add(dx))).toVar();
  const p_y0 = vec3(snoise3(p.sub(dy))).toVar();
  const p_y1 = vec3(snoise3(p.add(dy))).toVar();
  const p_z0 = vec3(snoise3(p.sub(dz))).toVar();
  const p_z1 = vec3(snoise3(p.add(dz))).toVar();
  const x = float(p_y1.z.sub(p_y0.z).sub(p_z1.y).add(p_z0.y)).toVar();
  const y = float(p_z1.x.sub(p_z0.x).sub(p_x1.z).add(p_x0.z)).toVar();
  const z = float(p_x1.y.sub(p_x0.y).sub(p_y1.x).add(p_y0.x)).toVar();
  const divisor = float(div(1.0, mul(2.0, e)));
  return normalize(vec3(x, y, z).mul(divisor));
}).setLayout({ name: 'curl', type: 'vec3', inputs: [{ name: 'p', type: 'vec4' }] });
```

- Sprite material (scale/color and soft circle)
```
// demo.ts (selected)
const material = new SpriteNodeMaterial({ depthWrite: false, sizeAttenuation: true });
material.positionNode = this.particlesPositionsBuffer!.element(instanceIndex);
material.scaleNode = Fn(() => {
  const strength = strengthBuffer.element(instanceIndex);
  const life = this.particlesLifeBuffer!.element(instanceIndex);
  const scale = min(smoothstep(0, 0.1, life), smoothstep(0.7, 1, life).oneMinus());
  scale.mulAssign(
    hash(instanceIndex).remap(0.5, 1)
      .mul(float(0.3).mul(this.uniforms.scale).add(strength.mul(0.3).mul(this.uniforms.contactScale)))
  );
  return scale;
})();
material.colorNode = Fn(() => {
  const strength = strengthBuffer.element(instanceIndex);
  Discard(distance(uv(), vec2(0.5)).greaterThan(0.5));
  return vec4(
    hash(instanceIndex).add(strength), hash(instanceIndex.add(1)), hash(instanceIndex.add(2)), 1
  );
})();
```

- Postprocessing bloom
```
// demo.ts (selected)
const scenePass = pass(this.scene, this.camera);
const scenePassColor = scenePass.getTextureNode('output');
const bloomPass = bloom(scenePassColor, 0.12, 0.05, 0.25);
this.postProcessing.outputNode = scenePassColor.add(bloomPass);
```

**Parameters (defaults surfaced in code)**
- `cursorRadius: 10`
- `baseParticleScale: 1`
- `pointerAttractionStrength: 0.015`
- `hoverPower: 1`
- `hoverDuration: 1` (UI mapping converts to 1/duration for decay)
- `wanderingSpeed: 0.003`
- `contactParticleScaleMultiplier: 1`
- Noise (fractal) controls: `turbFrequency: 0.5`, `turbAmplitude: 0.5`, `turbOctaves: 2`, `turbLacunarity: 2.0`, `turbGain: 0.5`, `turbFriction: 0.01`
- Postprocessing toggle: `usePostprocessing: true`

**What It Is (precise)**
- A GPU-resident, instanced-sprite particle system driven by a curl-noise flow field, implemented using Three.js TSL on the WebGPU backend.
- Compute phase runs each frame on the GPU (`renderer.computeAsync`) to update per-particle state (pos/vel/life/strength), avoiding JS-side loops.
- Render phase draws a single instanced plane geometry as round sprites with size attenuation; color and alpha controlled in the Node graph; additive-like bloom added via a post-processing node.

**How Motion Emerges**
- Baseline “wandering” term: `curlNoise4d(position, time) * wanderingSpeed` ensures continuous drift even without pointer interaction.
- Strength-gated advection: additional `flowField * deltaTime * strength` pushes particles more strongly only near the cursor (strength rises when basePosition is within `cursorRadius`, then decays).
- Optional velocity push: XY velocity accumulated from fractal noise acts when in contact, modulated by `hoverPower`.
- Life-controlled reset: particles drift from base, then return once life crosses a threshold; life grows faster as distance from base increases (distance-based decay term).

**Why This Matters for Dreamdust**
- This demo captures the “gentle drift with coherent push” we measured in the reference video: slow advection, not high-energy fluid sim.
- It demonstrates a compact, performant pattern we can adopt:
  - Storage buffers for per-particle state.
  - A single compute kernel per frame to update all particles.
  - Sprite-based rendering with bloom for ethereal glow.
  - Optional user bias (pointer or scripted vector) layered on curl noise.

**Adoption Notes (Actionable)**
- If using Three’s WebGPU/TSL stack:
  - Mirror the buffer layout: base pos, pos, vel, life, strength.
  - Port `curlNoise4d` or equivalent curl of simplex noise; keep `e≈0.1` sample spacing.
  - Keep speeds in the 5–15 px/s range at 720p by tuning `wanderingSpeed`, friction, and bloom threshold to preserve halos without washing mid-tones.
- If staying with our current pipeline:
  - Implement a compute/SSBO pass (or transform feedback analogue) for `pos += flow * dt`; use curl noise seeded by time for coherence, add a “strength” mask to choreograph regions.
  - Preserve bloom halo: aim for halo:core ≈ 2–3× at peak, additive blend or thresholded bloom.

**Quick Parity Checklist**
- [ ] Curl-noise advection term with time
- [ ] Strength field (region- or interaction‑driven) gating extra push
- [ ] Life ramp with distance‑based decay and base reset
- [ ] Sprite scale from life ramps + per‑particle randomness
- [ ] Node/post bloom roughly matching `0.12, 0.05, 0.25`

**Appendix — Full Pointers**
- Pointer projection and smoothing
```
// Pointer.ts (selected)
this.rayCaster.setFromCamera(this.pointer, this.camera);
this.rayCaster.ray.intersectPlane(this.iPlane, this.scenePointer);
this.uPointerVelocity.value.addScalar(this.scenePointer.distanceTo(this.uPointer.value));
const damp = 1 - Math.exp(-0.55 * 1000 * Math.max(0.001, this.delta));
this.uPointerVelocity.value.multiplyScalar(damp);
this.uPointer.value.x = this.scenePointer.x; // ...
```

- Page wrapper (Next.js)
```
// page.tsx (selected)
export const metadata = { title: 'Flow Field (WebGPU)', description: 'WebGPU Flow Field using TSL' };
<ExperimentLayout sourceLink="https://github.com/pavel-mazhuga/portfolio/tree/main/src/app/lab/flow-field/webgpu">
  <div className="canvas-wrapper"><Experience /></div>
</ExperimentLayout>
```

**Notes**
- Evidence above is verbatim from the upstream repository (raw links). Parameters and function names are preserved for traceability.
- GLTF path `/gltf/face2.glb` implies a bundled asset in the portfolio repo; exact model content isn’t needed for the motion model.
