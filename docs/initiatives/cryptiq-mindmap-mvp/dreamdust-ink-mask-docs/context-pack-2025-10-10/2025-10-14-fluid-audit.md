# 1. Audit of Claude Sonnet 4.5 Work

## 1.1 Investigative Process
- Pulled latest branch state (`docs/ink-falloff-flag-latch-2025-10-12`) and inspected working tree (`git status -sb`) to confirm only `PointCloudStage.tsx` and `DreamdustMaterial.ts` are touched in runtime code plus doc scaffolding.
- Reviewed `git diff HEAD` for `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx` to trace relocation of the fluid init `useEffect` (now below uniform creation, deps `[rendererReadyTick, setUniform]`, and dev-note about excluded materials).
- Examined `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts` diff around defaults block (lines 90‑115) to verify dummy `DataTexture` initialization and removal of optional `USE_FLUID_VELOCITY` guards.
- Confirmed no other files were modified by cross-checking `rg` scan for `USE_FLUID_VELOCITY` or other new symbols across repo; none found.
- Validated logging expectations remain (search for `[PC] fluid` markers) ensuring Claude’s adjustments didn’t remove instrumentation.
- Cross-referenced STATUS UPDATE claims with actual code: effect placement, dependency arrays, dummy texture, runtime guards, and absence of shader define toggles.

## 1.2 Findings
- TDZ mitigation is now explicit: effect executes after `uniforms` memoization, eliminating the `tE` reference error observed earlier.
- Dependency array trimmed to `[rendererReadyTick, setUniform]` with lint override; however, comment notes reliance on materials outside deps—warrants follow-up.
- Dummy velocity texture ensures shader links before fluid sim spins up; this matches the observed validation errors (`VALIDATE_STATUS false`) when sampler was null.
- No evidence of the earlier `USE_FLUID_VELOCITY` define remains; runtime gating depends solely on `uVelToNdc`.
- Claude’s doc claim about removing the misplaced effect block aligns with diff history; there is no residual duplication around `useImageData`.

# 2. Consolidated Context for Finishing the Implementation

## 2.1 Vision & Goals
- Deliver screen-space fluid interaction: immediate under-finger displacement, screen-aligned footprint, graceful decay, zero camera churn.
- Achieve MVP pipeline: WebGL2 ping-pong solver (`FluidSim.ts` + shaders), integration in `PointCloudStage`, vertex displacement in `DreamdustMaterial`.

## 2.2 Current Architecture Snapshot
- `FluidSim.ts`: manages velocity & pressure render targets, GLSL passes (`advect`, `addForce`, `divergence`, `jacobi`, `project`), exposes `addForce`, `step`, `getTexture`, `getInvSize`.
- `PointCloudStage.tsx`: instantiates `FluidSim` on renderer ready, wires `FluidDriver` to advance simulation, routes pointer splats from `InkSurface`, syncs uniforms (`uVelocity`, `uVelTexInvSize`, `uVelToNdc`, `uInkBlend`), logs instrumentation.
- `DreamdustMaterial.ts`: defaults for velocity uniforms (dummy texture), samples velocity post-projection with guard, blends displacement by `uInkBlend`.
- Tooling pipeline (baseline): `pnpm install --frozen-lockfile`, targeted `tsc`, `next lint`, `next build`, `pnpm run smoke`. Node 18.17 environment currently blocks Next lint/build (requires ≥18.18).

## 2.3 Data & State Flows
- Pointer events (InkSurface) → normalized UV + derived radius/strength → `FluidSim.addForce`.
- `FluidSim.step` executes per frame via `FluidDriver` hooking into `useFrame`.
- Uniform propagation: Stage sets dreamdust uniforms on both fallback/prebaked materials; `FluidDriver` keeps textures & scaling factors up-to-date.
- Vertex shader consumes `uVelocity` texture using clip-space → UV mapping; displacement scaled by `uVelToNdc` and `uInkBlend`.

## 2.4 External References
- Original plan (GPU Gems 38 style passes) already satisfied by existing shader assets.
- Browser crash logs (`browser_wait_for-2025-10-14T22-35-11-840Z.log`) preserve evidence of TDZ and shader validation failures.
- Documentation runbooks (`2025-10-09-ink-interaction-smoke-test.md`, `05-runbooks.md`) detail smoke expectations and verification artefacts.

# 3. Synthesis of Key Gaps / Risks / Mistakes

## 3.1 Codebase Gaps
- **Dummy Texture Lifecycle**: Currently recreated on module load; never disposed. Acceptable for singleton, but note for memory hygiene.
- **Effect Dependencies**: `FluidSim` init effect omits material refs intentionally; risk of stale material uniforms if materials are rebuilt post-init (e.g., preset switch). Needs explicit re-sync guard.
- **Force Mapping**: `applyTempForce` logs indicate zero forces; suggests coupling between InkSurface deltas and sim splats still misaligned (strength normalization may be too aggressive).

## 3.2 Tooling / Build Risks
- Node version mismatch prevents lint/build baseline from passing locally; critical to resolve before CI.
- WebGL errors (`VALIDATE_STATUS false`, feedback loop) suggest potential simultaneous read/write of same target. Need to audit render target usage for double-binding during logging or fallback path.

## 3.3 Integration Mistakes
- Earlier TDZ fix introduced by rearranging effect but left comment referencing removed define logic; ensure docs align.
- Smoke test navigation misstep (wrong URL) indicates missing runbook clarity; environment start instructions need reinforcement.

# 4. Retrospective on Recent Iterations

## 4.1 What Went Wrong
- TDZ crash stemmed from effect ordering oversight; indicates insufficient code review around hook dependencies after major refactor.
- Shader validation errors appeared because uniforms weren’t initialized defensively; highlights gap in offline test coverage (no automated headless GL validation).
- Smoke execution confusion (wrong route) underscores lack of scripted navigation/test harness.

## 4.2 Areas for Improvement
- Establish lint rule or helper to detect references to variables declared below hook dependency arrays.
- Add small WebGL harness/testing utility to assert shader programs link with default uniforms pre-runtime.
- Expand smoke runbook with canonical URLs and expected console markers to avoid manual guesswork.
- Consider feature flag to bypass fluid sampling during incremental rollout, easing debug toggles.

# 5. Plan to Finalize Implementation Before Next Smoke Test

1. **Stabilize Environment**
   - Upgrade Node to ≥18.18 locally; rerun baseline commands to ensure lint/build succeed.
2. **Validate FluidSim Lifecycle**
   - Instrument/devtools inspection to confirm `FluidSim` init effect re-runs if materials recompile (e.g., toggle presets). If not, plan to reapply uniforms post-rebuild (code change pending future task).
3. **Investigate WebGL Errors**
   - Reproduce validation failure; inspect WebGL inspector for feedback loop culprit (likely reading/writing same texture in frame). Trace through `FluidSim.step` and `FluidDriver` to identify simultaneous binding; prepare fix plan.
4. **Force/Tap Diagnostics**
   - Analyze `InkSurface` deltas vs. resulting splat strength; capture logs for non-zero pointer movement to ensure velocity impulse triggers. Adjust normalization strategy if logs remain zero (future change).
5. **Smoke Test Script**
   - Update internal runbook to emphasize correct route (`/quiz/archetype-v1?pc=scene-03`) and log expectations; ensure screenshots/log capture steps ready.
6. **Pre-Test Checklist**
   - Confirm `[PC] fluid uniforms prime`, `[PC] fluid init`, `[PC] fluid splat`, absence of WebGL errors before proceeding to full QA.
7. **Contingency**
   - Define rollback lever (e.g., set `FLUID_VEL_TO_NDC = 0`) documented for on-call usage should fluid path regress during testing.


---

# 6. Assistant Audit Addendum — 2025-10-14 (Evening)

## 6.1 What I verified in code (exact locations)
- Fluid init effect now runs after uniforms API exists:
  - `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx` (effect starting near the block that logs `[PC] fluid uniforms prime`). Deps: `[rendererReadyTick, setUniform]`.
- Dummy velocity texture default to prevent shader validation on first compile:
  - `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts` defaults block — `uVelocity` now initialized via a `DataTexture(1×1 RGBA Float32)`.
- Velocity sampling path in vertex shader is runtime-gated (no compile-time define required):
  - Same file, vertex shader block guarded by `if (uVelToNdc > 1e-5)`.
- WebGL2 sim + passes exist and are referenced:
  - `apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts` and `fluid/shaders/{advect,addForce,divergence,jacobi,project}.ts`.

## 6.2 Evidence from the latest run (console markers)
- Seen (good):
  - `[PC] fluid uniforms prime { invSize, velToNdc, inkBlend }`
  - `[PC] fluid init { size: 256, iters: 10 }`
  - `[PC] uniforms after-reveal { uTempRadius: 0.14, uTempFalloffOn: 1, forceScale: 220, velToNdc: ... }`
  - `[Dreamdust] reveal end { duration: 2 }`
- Errors (blocking):
  - `THREE.WebGLProgram: Shader Error ... VALIDATE_STATUS false`
  - `WebGL: INVALID_OPERATION: useProgram: program not valid` (repeated)
  - `GL_INVALID_OPERATION: glDrawElements: Feedback loop formed between Framebuffer and active Texture`
- Interaction logs:
  - Tap/drag show `force compute` with `magnitude: 0` and `uTempIntensity: 0`; `ink tex updated` occurs, but plume displacement not visible.

## 6.3 Diagnosis (why errors persist)
- The TDZ on `uniforms` is fixed, but shader validation failures indicate a render-target feedback issue after reveal:
  - Likely cause: a fluid RTT bound for writing is also sampled during the point cloud draw in the same frame.
  - Secondary cause candidate: render target not restored to default framebuffer after fluid passes, leaving an invalid program state for subsequent draws.
- Interaction path shows zero deltas for tap (no movement), so first splat is never issued; only drag splats run, and normalization may zero out small motions.

## 6.4 Minimal, surgical fixes recommended before next run
1) Fluid render-target hygiene (break feedback loop):
   - In `FluidSim.ts` ensure each pass restores prior target, and after the last pass call both:
     - ThreeJS path: `renderer.setRenderTarget(null)`
     - Raw GL path (if used): `gl.bindFramebuffer(gl.FRAMEBUFFER, null)`
   - Verify no pass samples from a texture currently bound as the write target; enforce ping‑pong strictly.
2) Frame ordering in R3F:
   - Step fluid with a higher priority so all FBO work finishes before scene render. Example: `useFrame(() => sim.step(delta), 1)` in the Fluid driver.
3) Guaranteed first splat on tap:
   - In `InkSurface`, on pointerdown fire `onForceSplat(uv, radius := max(0.06, BRUSH_RADIUS_PX/TEXTURE_SIZE), strength := 0.6)` regardless of movement; keep drag splats additive.
4) Visibility knob for displacement:
   - Temporarily set `FLUID_VEL_TO_NDC = 0.045` and `FLUID_INK_BLEND = 1.0` to exceed the ≤2‑frame perceptibility gate during validation.

## 6.5 Why this addresses the logs
- Feedback loop warnings disappear once RTTs are fully unbound before the geometry draw — prevents invalid program/validate failure spam.
- A forced first splat guarantees an initial plume impulse on tap, satisfying the “under‑finger within ≤2 frames” gate.
- Raising `velToNdc` and `inkBlend` temporarily ensures the displacement is unambiguously visible for the smoke decision.

## 6.6 Acceptance gates and current status
- ≤2‑frame under‑finger motion: FAIL (current)
- Localized 10–20% footprint: N/A (not reached)
- Smooth decay: N/A (not reached)
- Fixed camera: PASS

## 6.7 Next execution (script)
1. `nvm use 20`
2. Apply the three code tweaks above (RTT unbinds, `useFrame` priority, first splat on tap).
3. `rm -rf apps/cryptiq-mindmap-demo/.next && pnpm --filter cryptiq-mindmap-demo run build && pnpm --filter cryptiq-mindmap-demo run start`
4. Load `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03`
5. Verify logs: `[PC] fluid uniforms prime`, `[PC] fluid init`, no WebGL validation errors post‑reveal.
6. Tap then drag; expect `[PC] fluid splat …` and clear under‑finger displacement.
7. Capture pre/mid/post screenshots and console log excerpt; append to evidence doc.
