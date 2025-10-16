---
title: Cursor OODA Ink Prototype – Resources Guide
date: 2025-10-16T15:14:01Z
commit: a4c4b0fd
branch: docs/ink-falloff-flag-latch-2025-10-12
tags: [resources, best-practices, ink, fluid, webgl, three]
---

### Executive summary
- **Shader preamble and GLSL3**: Use `ShaderMaterial` with `glslVersion: THREE.GLSL3`; do not put `#version` in sources. Avoid redeclaring injected attributes/varyings. Tie program variants to `customProgramCacheKey` when defines change.
  - Why this matters here: our materials already set GLSL3 and premultiplied output; adding manual `#version` would conflict.
  ```748:761:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts
    premultipliedAlpha: true,
    defines,
    glslVersion: (THREE as any).GLSL3,
  ```
- **Render‑target lifecycle and feedback loops**: Always restore previous target/state after offscreen passes; never read and write the same attachment in one pass.
  - Why this matters here: fluid passes save/restore target and autoclear correctly.
  ```164:175:apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts
  private renderPass(target: WebGLRenderTarget, material: ShaderMaterial) {
    const prevMaterial = this.quad.material
    this.quad.material = material
    const prevAutoClear = this.renderer.autoClear
    const prevTarget = this.renderer.getRenderTarget()
    this.renderer.autoClear = false
    this.renderer.setRenderTarget(target)
    this.renderer.render(this.scene, this.camera)
    this.renderer.setRenderTarget(prevTarget)
    this.renderer.autoClear = prevAutoClear
    this.quad.material = prevMaterial
  }
  ```
- **Float/half‑float RTs**: Prefer HalfFloat when available; fallback to Float; disable mipmaps; `ClampToEdgeWrapping` and appropriate filtering.
  - Why this matters here: our sim targets are RGBA, mipmaps off, clamp-to-edge.
  ```40:52:apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts
  const target = new (THREE as any).WebGLRenderTarget(size, size, {
    depthBuffer: false,
    stencilBuffer: false,
    type,
    format: (THREE as any).RGBAFormat,
    magFilter: (THREE as any).LinearFilter,
    minFilter: (THREE as any).LinearFilter,
    wrapS: (THREE as any).ClampToEdgeWrapping,
    wrapT: (THREE as any).ClampToEdgeWrapping,
  })
  target.texture.generateMipmaps = false
  ```
- **Fluid pass order**: addForce → advect → divergence → jacobi×N → project. Use ping‑pong buffers for velocity/pressure; clamp dt.
  - Why this matters here: our `step` implements the canonical sequence with swaps and dt clamp.
  ```206:246:apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts
  step(dt: number) {
    const clampedDt = Math.min(dt, this.dtClamp)
    // Advect
    this.renderPass(advectDst, this.advectMaterial); swap(this.velocity)
    // Divergence
    this.renderPass(this.divergence, this.divergenceMaterial)
    // Jacobi × iterations
    this.renderPass(pressureDst, this.jacobiMaterial); swap(this.pressure)
    // Project
    this.renderPass(projectVelocityDst, this.projectMaterial); swap(this.velocity)
  }
  ```
- **Blending/premultipliedAlpha**: Keep premultiplied output consistent end‑to‑end; depthWrite off for transparent points; pick blend mode prudently.
  - Why this matters here: fragment outputs are premultiplied; material uses `premultipliedAlpha: true`, `depthWrite: false`.
  ```690:692:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts
  // Premultiplied alpha output
  gl_FragColor = vec4(color * alpha, alpha);
  ```
- **R3F integration**: Update uniforms in `useFrame`, invalidate on demand frameloop, and keep sim targets out of default pipeline.
  - Why this matters here: velocity texture and invSize are updated inside the frame loop.
  ```900:920:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
  useFrame((state, delta) => {
    sim.step(delta)
    const texture = sim.getTexture()
    if (uniforms?.uVelocity && uniforms.uVelocity.value !== texture) {
      uniforms.uVelocity.value = texture
    }
    const inv = sim.getInvSize()
    ...
  })
  ```
- **CI smoke gates**: Production URL, deterministic viewport/DPR, assert no shader link/validate errors, capture screenshots and console.
  - Why this matters here: our Playwright smokes gate on console errors and persist screenshots to artifacts.
  ```6:9:tests/brain.smoke.spec.ts
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  ```
  ```54:63:tests/brain.smoke.spec.ts
  const outDir = process.env.SMOKE_OUT_DIR || '.clmem/artifacts/smoke'
  const runId = process.env.RUN_ID || `${Date.now()}`
  fs.mkdirSync(outDir, { recursive: true })
  const outPath = path.join(outDir, `brain-${runId}.png`)
  await page.screenshot({ path: outPath, fullPage: false })
  const stat = fs.statSync(outPath)
  const minBytes = Number(process.env.MIN_SMOKE_BYTES || '10000')
  expect(stat.size).toBeGreaterThan(minBytes)
  ```

### Quick‑start checklists
- **ShaderMaterial GLSL3 safe‑use**
  - Set `glslVersion: THREE.GLSL3`; do not include manual `#version`.
  - Don’t redeclare built‑in attributes/varyings.
  - Use `onBeforeCompile` for toggled defines and implement `customProgramCacheKey` when defines affect variants.
  - Keep sampler precision qualifiers consistent across stages.

- **WebGL2 RT sanity**
  - Prefer `HalfFloatType`; fallback to `FloatType`; verify `EXT_color_buffer_float`.
  - Use `RGBAFormat`; `NearestFilter` for velocity fields; `ClampToEdgeWrapping`.
  - Disable mipmaps on RTT; avoid sRGB for velocity/pressure.
  - No feedback loops; always restore previous target/viewport/scissor.

- **Fluid pipeline hygiene**
  - addForce → advect → divergence → jacobi×N → project; clamp `dt`.
  - Ping‑pong velocity/pressure; clear pressure before solve; clamp forces/radius.
  - Boundary handling strategy defined and tested; verify divergence after project.

- **Smoke test**
  - Hit prod server; fixed viewport and DPR; use native `page.mouse`.
  - Wait for reveal checkpoints; assert shader‑gate clean (no `THREE.WebGLProgram` errors).
  - Save screenshots to `cursor-ooda-ink-prototype/assets/` and console logs to `cursor-ooda-ink-prototype/console/` with commit/branch/timestamp.

### Best‑practice patterns (Do / Don’t)
- **Shader/material integration**
  - Do: use `ShaderMaterial` + `glslVersion`, update defines via `onBeforeCompile`.
  - Don’t: embed `#version`, redeclare injected attributes, or mutate materials per‑frame without cache keys.
  - Why this matters here: prevents shader cache churn and link errors in `DreamdustMaterial`.

- **Fluid sim passes**
  - Do: maintain pass order, swaps, and `dt` clamp; sanitize splat radius/strength.
  - Don’t: read/write same texture in a pass; skip pressure clear before Jacobi.
  - Why this matters here: our `addForce` clamps and swaps; `step` clears pressure then iterates Jacobi.

- **RT lifecycle/state restore**
  - Do: save/restore target, viewport, scissor, autoClear.
  - Don’t: leave offscreen target bound; don’t rely on defaults.
  - Why this matters here: `FluidSim` and telemetry utilities correctly restore state.

- **Visibility gating vs physics strength**
  - Do: gate visibility via alpha/point size/blending; keep physics strength in sim.
  - Don’t: couple ink visibility to force magnitude.
  - Why this matters here: `DreamdustMaterial` separates tint/size/offset from velocity magnitude.

- **Performance knobs**
  - Do: tune grid size and Jacobi iters; minimize autoClear toggles; avoid willReadFrequently in loop.
  - Don’t: oversubscribe effects/toneMapping; avoid redundant uniform churn.
  - Why this matters here: `FLUID_GRID_SIZE`, `FLUID_JACOBI_ITERS` are explicit in `PointCloudStage`.

### Deep dives (summaries + links)
- **Three.js core**
  - ShaderMaterial/RawShaderMaterial, `glslVersion`, `onBeforeCompile`, `customProgramCacheKey`; WebGLRenderer render‑target rules; Texture/RenderTarget formats/filters/wrap; blending, premultipliedAlpha, depthTest/depthWrite.
  - Learn more: `https://threejs.org/docs/#api/en/materials/ShaderMaterial`, `https://threejs.org/docs/#api/en/renderers/WebGLRenderer`, `https://threejs.org/docs/#api/en/renderers/WebGLRenderTarget`, `https://threejs.org/docs/#api/en/materials/Material`.
- **WebGL 2.0 + GLSL ES 3.00**
  - `#version 300 es` first, `in/out` replace attribute/varying, `texture()` replaces `texture2D`, precision, draw buffers, feedback loop prohibition; float/half‑float renderability via `EXT_color_buffer_float`.
  - Learn more: `https://www.khronos.org/registry/webgl/specs/latest/2.0/`, `https://www.khronos.org/registry/OpenGL/specs/es/3.0/GLSL_ES_Specification_3.00.pdf`.
- **GPU fluid simulation best practices**
  - Ping‑pong targets; canonical pass order; stable advection; clamping and boundaries; verify divergence‑free projection.
  - Learn more: `https://developer.nvidia.com/gpugems/GPUGems3/gpugems3_ch38.html`, `https://github.com/haxiomic/GPU-Fluid-Experiments`.
- **R3F/@react‑three/fiber**
  - Frame loop/invalidation; resource disposal; safe renderTarget usage; accessing renderer.
  - Learn more: `https://docs.pmnd.rs/react-three-fiber/getting-started/introduction`.
- **Spector.js / WebGL debugging**
  - Capture frames; verify program link, attachments, RT bindings; detect INVALID_OPERATION and feedback loops.
  - Learn more: `https://spector.babylonjs.com/`.
- **Precision/texture formats**
  - FloatType/HalfFloatType + RGBAFormat; extension checks; Nearest/Linear filter choice; ClampToEdge; disable mipmaps; avoid sRGB for velocity.
  - Learn more: `https://threejs.org/docs/#api/en/constants/Textures`.
- **Shader compilation & program caching**
  - Avoid manual `#version` with `ShaderMaterial`; use `glslVersion`; use `onBeforeCompile` and `customProgramCacheKey`.
  - Learn more: `https://threejs.org/docs/#api/en/materials/Material.onBeforeCompile`.
- **Premultiplied alpha & blending**
  - Normal vs Additive; depthTest/depthWrite for points; keep premult consistent.
  - Learn more: `https://threejs.org/docs/#api/en/renderers/WebGLRenderer`, `https://threejs.org/docs/#api/en/materials/Material`.
- **Performance guidance**
  - Measure p50/p90 (Chrome DevTools), inspect `renderer.info`; manage grid/iters; minimize autoClear toggles; avoid unnecessary post.
  - Learn more: `https://developer.chrome.com/docs/devtools/performance/`, `https://threejs.org/docs/#api/en/renderers/WebGLRenderer.info`, `https://discoverthreejs.com/`.
- **Playwright smoke testing**
  - Prod server; `page.mouse` for native interactions; wait for reveal; capture console/screenshots; deterministic viewport/DPR.
  - Learn more: `https://playwright.dev/docs/api/class-page`.
- **Cursor MCP browser automation**
  - Navigate → collect console → snapshot/screenshot; assert no program validation errors; place artifacts under `cursor-ooda-ink-prototype/` with commit/branch/timestamp.
  - Learn more: MCP spec (Model Context Protocol).

### Automated smoke infrastructure (Playwright + MCP)
- Playwright (CI‑ready)
  - Base URL and route from env; deterministic viewport/DPR; native `page.mouse` interactions; wait for reveal checkpoints; capture console/screenshot; fail on shader errors.
  - Why this matters here: our tests verify canvas visibility, collect console errors, and save screenshots for traceability.
  ```11:19:tests/brain.smoke.spec.ts
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
  const route = process.env.SMOKE_ROUTE || '/brain'
  const url = `${baseUrl}${route}`
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  const canvas = page.locator('canvas')
  await expect(canvas).toHaveCount(1)
  await expect(canvas.first()).toBeVisible()
  ```
  - Learn more: `https://playwright.dev/docs/api/class-page`.

- MCP (operator‑driven browser automation)
  - Navigate → collect console messages → take screenshot/snapshot; assert no program validation errors; store artifacts under `cursor-ooda-ink-prototype/{commit}/{branch}/{ts}/`.
  - Why this matters here: enables quick manual runs in Cursor to capture evidence and regressions without local Playwright setup.
  - Learn more: MCP spec (Model Context Protocol).
  - Run script reference: 09-runbooks.md#2-mcp-browser-smoke-operator-driven

- When to use which
  - Use Playwright for repeatable CI gates and PR checks; use MCP for exploratory, operator‑driven validation and rapid screenshot/console capture during local debugging.

### Crosswalk to our implementation (code anchors)
- **InkSurface splats and callbacks**
  ```296:325:apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx
  if (typeof onForceSplat === 'function') {
    const movePx = Math.hypot(client.x - lastClient.x, client.y - lastClient.y)
    const strength = Math.min(1, movePx / 24)
    onForceSplat([u, v], BRUSH_RADIUS_PX / TEXTURE_SIZE, strength)
  }
  ```
- **FluidSim addForce/step and swaps**
  ```191:204:apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts
  addForce(point, radius, strength) { /* clamps, writes to write target, swap */ }
  ```
  ```206:246:apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts
  step(dt) { /* advect → divergence → jacobi×N → project with swaps */ }
  ```
- **PointCloudStage uniform bridge**
  ```900:920:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
  if (uniforms?.uVelocity) { uniforms.uVelocity.value = texture }
  if (uniforms?.uVelTexInvSize) { target[0] = inv[0]; target[1] = inv[1] }
  if (uniforms?.uVelToNdc) { uniforms.uVelToNdc.value = velToNdc }
  if (uniforms?.uInkBlend) { uniforms.uInkBlend.value = inkBlend }
  ```
- **DreamdustMaterial displacement/tint**
  ```518:529:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts
  // Fluid-driven screen-space displacement (MVP)
  if (uVelToNdc > 1e-5) {
    vec2 vel = inside ? texture(uVelocity, sampleUv).xy : vec2(0.0);
    vec2 disp = vel * uVelToNdc;
    gl_Position.xy = mix(gl_Position.xy, gl_Position.xy + disp, clamp(uInkBlend, 0.0, 1.0));
  }
  ```
- **Renderer target/restore calls**
  ```164:189:apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts
  // save/restore setRenderTarget, autoClear, and material
  ```

- Known gaps to verify
  - Automated shader‑gate in CI to assert zero program link/validate errors.
  - Extension checks (e.g., `EXT_color_buffer_float`) plumbed into capability gating.
  - Visibility gates independent from physics strength across presets.
  - Deterministic smoke harness saving artifacts with `{commit}/{branch}/{ts}` pathing.

### Troubleshooting playbooks
- **Black screen**
  - Checks: Shader compile/link logs; Spector.js capture; framebuffer completeness; RT feedback loops; extension availability.
  - Fix: Remove manual `#version`; set `glslVersion`; restore previous RT/state; disable mipmaps; guard feedback.
- **No particles**
  - Checks: `uAlphaFloor`, point size path, depthWrite/test gates, blending mode.
  - Fix: Increase `uPointBaseSize`; ensure `depthWrite=false`; verify premult pipeline.
- **No motion**
  - Checks: `onForceSplat` firing; force clamp too low; `uVelToNdc`/`uInkBlend`; texture piping to uniforms.
  - Fix: Raise `TEMP_FORCE_SCALE`; verify `uVelocity` and `uVelTexInvSize` updates in frame loop.
- **Severe perf**
  - Checks: grid size, Jacobi iters, redundant clears/autoClear toggles, postprocessing chain.
  - Fix: Reduce grid or iters; batch state changes; disable extra post.
- **Wrong colors/halo**
  - Checks: premult alpha consistency; toneMapping; color space of inputs.
  - Fix: Ensure premult at output and renderer; avoid sRGB for velocity; tune rim/gamma.

### Reference links (curated)
- Three.js: ShaderMaterial, WebGLRenderer, WebGLRenderTarget, Material/blending, constants (textures)
  - `https://threejs.org/docs/#api/en/materials/ShaderMaterial`
  - `https://threejs.org/docs/#api/en/renderers/WebGLRenderer`
  - `https://threejs.org/docs/#api/en/renderers/WebGLRenderTarget`
  - `https://threejs.org/docs/#api/en/materials/Material`
  - `https://threejs.org/docs/#api/en/constants/Textures`
- WebGL/GLSL: WebGL 2.0, GLSL ES 3.00, EXT_color_buffer_float
  - `https://www.khronos.org/registry/webgl/specs/latest/2.0/`
  - `https://www.khronos.org/registry/OpenGL/specs/es/3.0/GLSL_ES_Specification_3.00.pdf`
  - `https://registry.khronos.org/webgl/extensions/EXT_color_buffer_float/`
- Fluids: GPU Gems Ch.38; Haxiomic GPU‑Fluid‑Experiments
  - `https://developer.nvidia.com/gpugems/GPUGems3/gpugems3_ch38.html`
  - `https://github.com/haxiomic/GPU-Fluid-Experiments`
- R3F: `https://docs.pmnd.rs/react-three-fiber/getting-started/introduction`
- Spector.js: `https://spector.babylonjs.com/`
- Perf: Chrome DevTools Performance, `renderer.info`, DiscoverThree
  - `https://developer.chrome.com/docs/devtools/performance/`
  - `https://threejs.org/docs/#api/en/renderers/WebGLRenderer.info`
  - `https://discoverthreejs.com/`
- Playwright: `https://playwright.dev/docs/api/class-page`
- MCP: `https://spec.modelcontextprotocol.io/`

Link availability note: All canonical links above were reachable as of 2025-10-16T15:14:01Z. If a resource is temporarily unavailable, prefer the vendor’s mirrored docs or archived versions (e.g., via web.dev, MDN, or the Internet Archive).

### Stubs for later evidence
- Last prod run: Prod server verified 200 OK; shader gate clean; fluid initialized; particles still not visually apparent in screenshots (`10-latest-smoke-evidence.md`).
- [STUB: screenshots_links]
- [STUB: console_log_links]
- TODO: dedicated Playwright smoke `tests/ink.smoke.spec.ts` (current `tests/brain.smoke.spec.ts` targets `/brain` overlay).
- MCP operator script: 09-runbooks.md#2-mcp-browser-smoke-operator-driven

---
Why this matters here callouts use our exact files and uniforms so a new engineer can jump in quickly, check the anchors, and run the smoke without guessing.
