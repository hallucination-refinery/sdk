 - Audit blockers: feedback loop, TDZ/deps, pre-render step, first-splat, visibility knobs
 - Cross-reference vision/docs and current code to align acceptance gates
 - Define minimal file edits (FluidSim, PointCloudStage, InkSurface, Material) to resolve blockers
 - Specify console evidence and Playwright assertions for pass/fail
 - Produce a precise Codex system prompt encapsulating the above

 # EXECUTIVE SUMMARY

 ## Vision for current `Ink` interaction

 Touch must cause immediate, undeniable particle motion under the finger (≤2 frames), with a localized, screen‑space‑consistent footprint and smooth decay; camera remains fixed and overlays minimal.

 Validation: Aligned to 00-overview.md and brief lines 7–21; concise and specific.

 ## Integration of `Ink` within the broader `End Experience (aesthetic-only)`

 The fluid‑driven displacement is the reactive scaffold beneath the misty reveal: taps yield ripples/plumes; strokes advect vapor-like motion; later a palette cascade rolls hue across the cloud without disrupting framing.

 Validation: Matches “Right Direction” and acceptance gates; connects motion to the aesthetic cascade.

 ## The next concrete `GOAL` and how it advances the vision

 GOAL: Remove WebGL feedback loop/validation errors, guarantee a first splat on tap, step the sim pre‑render, and expose a safe visibility boost—so under‑finger motion is clearly visible within ≤2 frames on scene‑03.

 Validation: Directly targets the remaining blockers that prevent gate verification.

 # PROBLEM DECOMPOSITION

 1) Render‑target hygiene (FluidSim)
 - Save/restore previous render target per pass; strictly ping‑pong read/write textures; avoid sampling a texture currently bound for draw; do not clobber caller’s render target.
 - Dependency: none; touches FluidSim.ts.

 2) Frame scheduling (Stage)
 - Ensure sim.step(dt) runs pre‑render (useFrame priority or addEffect) and not during scene draw; keep step independent of material compilation.
 - Dependency: R3F hook ordering; no shader changes required.

 3) First‑splat & interaction plumbing
 - Guarantee on pointerdown an initial splat (radius ≥ 0.06, strength ~0.6) and log “[PC] fluid splat { uv, r, s }”.
 - Dependency: InkSurface emits, PointCloudStage routes to sim.addForce.

 4) Visibility knobs & rollback
 - Elevate `velToNdc` and `inkBlend` via a debug flag/URL/env with a safe default; ensure fast rollback (flag off).
 - Dependency: Stage constants; no shader edits.

 5) Material re‑apply guard
 - If materials recompile, re‑apply fluid uniforms (uVelocity, uVelTexInvSize, uVelToNdc, uInkBlend) without TDZ.
 - Dependency: Stage effects; avoid uniform cycles.

 6) Evidence and smoke assertions
 - Console markers: `[PC] fluid init`, `[PC] fluid uniforms prime`, `[PC] fluid splat`, absence of program/feedback warnings post‑reveal; screenshots pre/mid/post.
 - Dependency: none; scripting only.

 Validation: All subtasks map one‑to‑one to current failures and acceptance gates.

 # RESOURCE REVIEW

 - 00-overview.md (acceptance gates): under‑finger ≤2 frames; localized; smooth decay; fixed camera. Ensures we boost visibility only via `velToNdc`/`inkBlend` and do not alter camera.
 - Brief (lines 7–21): end‑experience ties; confirms we prioritize immediate, localized responses then cascade hue later.
 - GPU Gems Ch.38 & WebGLFundamentals: confirm correct pass order and FBO lifecycle (strict ping‑pong; restore binds).
 - three.js docs & R3F hooks: where to call step pre‑render and how to restore render targets safely.
 - Spector.js & SO feedbackLoop threads: canonical fixes for our exact error messages; capture frame to validate no read/write aliasing.
 - <missing: explicit runbook for enabling/disabling FLUID_DEBUG_BOOST via env/URL> (we will define now).

 Validation: Resources support each planned change; noted one missing toggle runbook.

 # MINIMAL UNBLOCK PLAN: STEP BY STEP

 1) FluidSim render‑target hygiene
 - In FluidSim.renderPass: capture `const prev = renderer.getRenderTarget()`; `renderer.setRenderTarget(dst)`; render; then `renderer.setRenderTarget(prev)`.
 - In step(): remove unconditional `renderer.setRenderTarget(null)`; instead rely on renderPass restore (prev). Confirm advect/div/jacobi/project use read→write pairs with a swap after each write.
 - Add a comment noting prevention of sampling from the write target; ensure divergence writes to a distinct RT (already the case).

 2) Pre‑render step scheduling
 - Add a small `FluidDriver` that calls `sim.step(delta)` with `useFrame((_,delta)=>..., 1)` (priority before scene render) or `addEffect` if available; guard `if (!fluidRef.current) return`.

 3) First splat + logging
 - Ensure PointCloudStage wires `onForceSplat={(uv,r,s)=>{ console.log('[PC] fluid splat', {uv,r,s}); fluidRef.current?.addForce(uv,r,s) }}`.
 - Keep InkSurface pointerdown first‑splat (radius ≥ 0.06, strength 0.6) and drag splats additive.

 4) Visibility knobs & rollback
 - Read `FLUID_DEBUG_BOOST` from `process.env.NEXT_PUBLIC_FLUID_DEBUG` or URL `?fluidBoost=1`; choose `velToNdc=0.045` and `inkBlend=1.0` only when enabled; otherwise baseline values.

 5) Re‑apply guard for uniforms
 - Add a light effect keyed on `[fallbackMaterial, prebakedMaterial]` that, when `fluidRef.current` exists, re‑applies `uVelocity`, `uVelTexInvSize`, `uVelToNdc`, `uInkBlend` to the new material instances (no `uniforms` in deps to avoid TDZ).

 6) Evidence & smoke
 - Update the smoke script to assert presence of `[PC] fluid init`, `[PC] fluid uniforms prime`, and `[PC] fluid splat`, and absence of `program not valid` / `Feedback loop formed` after reveal.
 - Capture pre/mid/post screenshots for tap and stroke.

 Validation: Steps are minimal, surgical, and map exactly to blockers; no shader rewrites or new deps.

 # PROMPT

```text
System: You are GPT‑5 Codex working in a Next.js + three.js + R3F codebase. Implement only the minimal, surgical changes listed. Do not introduce new dependencies, large refactors, or change camera behavior. Keep changes ≤150 LOC total. All edits must compile and run on Node 20.

Acceptance gates (must pass):
- No WebGL feedback loop/validation warnings post‑reveal
- First tap emits “[PC] fluid splat …” and produces visible under‑finger motion within ≤2 frames
- Drag shows localized plume following the path without popping
- Logs present: “[PC] fluid init …”, “[PC] fluid uniforms prime …”, “[PC] fluid splat …”

Files to edit:
1) apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts
  - In `renderPass`, save/restore previous render target: `const prev = renderer.getRenderTarget(); renderer.setRenderTarget(dst);` … draw … `renderer.setRenderTarget(prev);`
  - In `step`, remove unconditional `renderer.setRenderTarget(null)`; rely on renderPass restore. Confirm advect/divergence/jacobi/project each write to a distinct target and swap after writes. Add brief comments clarifying ping‑pong.

2) apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
  - Add a `FluidDriver` that runs `fluidRef.current?.step(delta)` with `useFrame((_, delta) => ..., 1)` (priority = 1). Guard against null.
  - Wire `onForceSplat={(uv, radius, strength) => { console.log('[PC] fluid splat', { uv, radius, strength }); fluidRef.current?.addForce(uv, radius, strength); }}` in the existing `InkSurface` usage.
  - Implement a small effect keyed on `[fallbackMaterial, prebakedMaterial]` that, when `fluidRef.current` exists, sets uniforms `uVelocity`, `uVelTexInvSize`, `uVelToNdc`, `uInkBlend` on the material(s). Avoid `uniforms` in deps; check existence inside effect to prevent TDZ.
  - Replace the hardcoded debug defaults with an environment/URL toggle: if `process.env.NEXT_PUBLIC_FLUID_DEBUG==='1'` or URL has `?fluidBoost=1`, use `velToNdc=0.045` and `inkBlend=1.0`; else use baseline values.

3) (No shader rewrites) apps/…/dreamdust/DreamdustMaterial.ts
  - Keep the dummy 1×1 velocity texture default as a compile‑time guard; no changes unless necessary. Vertex displacement remains gated by `uVelToNdc > 0`.

4) apps/…/dreamdust/InkSurface.tsx
  - Ensure pointerdown first‑splat (radius ≥0.06, strength 0.6) remains; no additional changes.

Verification (must implement a quick local check):
- Start server, open `/quiz/archetype-v1?pc=scene-03`, wait for reveal end.
- Confirm console: `[PC] fluid uniforms prime`, `[PC] fluid init`, then perform a tap; expect `[PC] fluid splat` and visible motion ≤2 frames. Perform a stroke; expect continuous plume and no WebGL validation warnings.

Non‑goals:
- Do not refactor unrelated systems, add new dependencies, or rewrite shaders.
- Do not change camera behavior or acceptance gates.
```

Validation: Prompt encapsulates the minimal code changes, acceptance criteria, and constraints; ready for Codex input.


