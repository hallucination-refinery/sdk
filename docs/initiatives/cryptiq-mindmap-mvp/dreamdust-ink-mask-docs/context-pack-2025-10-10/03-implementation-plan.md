# Implementation Plan — Milestones & Steps

Milestone M1 — Force‑Field Prototype (Particles Are the Ink)
- Goal: visible particle motion under the finger with a single tap and a 2–3s stroke; no overlays; camera/framing unchanged.
- Steps (files to touch)
  - Phase A (scaffolding; dev-only):
    - In `PointCloudStage.tsx`, inject temporary uniforms (`uTempForce` vec2, `uTempIntensity` float, `uTempCenter` vec2, `uTempRadius` float). Apply a quick vertex offset that pushes points along the latest pointer delta (keep scale modest) and use screen-space UV falloff to localize the effect.
    - Update these uniforms from `InkSurface` on each pointer event / frame (`useFrame` ~60 fps). When idle, multiply intensity by 0.9–0.98 per frame to decay; keep center/radius steady until motion ends; log values for debugging.
    - No new structs yet—goal is to see motion in minutes. Guardrails still apply (mirror handling, OrbitControls lock, camera/framing untouched).
  - Phase B (productionize after motion is confirmed):
    - Replace the temporary uniform with structured ones `uForceVector`, `uForceIntensity`, `uForceDecay`, `uForceActive` in DreamdustMaterial.ts. Optionally adopt the Codrops “uTouch” approach: draw pointer trail into an off-screen canvas texture (Raycaster → UV → canvas) and sample it in the vertex shader for parallel displacement (see 06-reference-notes.md).
    - Feed the new uniforms from the InkSurface loop; when input stops, set `uForceActive=0` and rely on `uForceDecay` (or decay the touch texture radius) to fade.
    - Move displacement logic into a dedicated helper inside the vertex shader (mirror-aware) using either direct vector math or the sampled `uTouch` texture. Ensure `material.needsUpdate = true` when toggling active state.
    - Remove Phase A scaffolding once Phase B works (record commit/tag before removal).
  - Guardrails: maintain mirror rules when mapping force vector; disable OrbitControls while drawing; keep camera fit untouched; limit force to active viewport area to protect perf.
  - Scaffolding teardown: once Phase B passes runbook, tag the commit and remove all Phase A code paths (document file paths/lines in PR description).
  - Phase A troubleshooting (2025-10-11): If no motion is visible in Scene‑03 while uniforms update, check pixel scaling: the ink offset path multiplies by `pxScale = viewDist / uFocal` before adding to `viewPos.xy`. Consider applying a similar scale to the temporary force to ensure perceptible screen‑space motion at current camera distances, or defer to Phase B’s structured path.
  - Revert path (2025-10-11): If Phase A falls back to “no visible motion” in production despite successful init and stroke logs, temporarily revert to the last commit that yielded visible displacement to satisfy M1’s “undeniable prototype” constraint, then re‑introduce falloff with correct pixel scaling as a small forward change.
  - Falloff flag application (2025-10-11): Observed `uTempFalloffOn` remained 0 in prod with `&falloff=1`. Plan: move falloff flag set to a post-material-ready hook (after material is attached), and add a single-shot console guard (if flag is requested and unset after reveal, set to 1).
  - Pixel scaling (pre‑B): When enabling falloff, multiply the temp force by `pxScale = viewDist / uFocal` to ensure screen‑space displacement remains perceptible at Scene‑03 distances.
  - Shader ordering guard (2025-10-11): Compute `pxScale` only after `viewPos`/`viewPos4` is defined in the vertex shader. Recommended placement: after `vec4 viewPos4 = viewMatrix * vec4(revealPos, 1.0); vec3 viewPos = viewPos4.xyz;` and `viewDist` derivation; then apply localized offset.
  - Falloff activation (2025-10-12): Ensure `uTempFalloffOn` is set after material attach and reveal end; re-check once on first uniform init to avoid missed latch. If still 0 in prod, allow a one-shot `window.dreamdust.ensureFalloff()` as a verification escape hatch.
  - Prebaked readiness guard (2025-10-12): In the prebaked path (no `onMaterialValid`), add a short RAF loop to wait for `points.material.program.glProgram` to exist, then call the falloff latch once. Log a guard message and capture uniforms (`dumpUniforms()`).
  - Pointer UV feed (2025-10-12): Update `uTempCenter` per pointer sample (screen-space UV), not a static default; guard/mirror UV as done in `InkSurface` logs.
  - Radius visibility (2025-10-12): If localized feel is subtle at Scene‑03, bump `uTempRadius` slightly (e.g., 0.14–0.18) for validation; then tune down.
  - Shader ordering (same session, 2025-10-12): Compute a local screen-space UV immediately before the falloff calculation and use it for influence:
    - `vec4 clip = projectionMatrix * viewPos4; vec2 ndc = clip.xy / max(1e-6, clip.w); vec2 ssUv = ndc * 0.5 + 0.5;`
    - Replace `distance(vInkUv, uTempCenter)` with `distance(ssUv, uTempCenter)` in the vertex path. Keep assigning `vInkUv` later for the fragment.
- Pass/Fail
  - Pass: tap near viewport center produces ≥5 px displacement within ≤2 frames; 2–3 s stroke advects particles along the path; motion decays smoothly when input stops; camera remains fixed.
  - Fail: no motion, motion lagging/past pointer, or camera interference.
  - Regression guard (same session): If `uTempFalloffOn: 1` with rising `uTempIntensity` yields zero motion, suspect influence computed before `vInkUv` assignment; apply the shader ordering fix above.
- Runbook: see 05-runbooks.md#M1

Milestone M2 — Palette‑Mapped Cascade
- Goal: on stroke end, sample hue at gesture start, snap to curated palette, and roll that hue through all particles to a saturated end state.
- Steps
  - Define curated palette (`CASCADE_PALETTE` array) and nearest-color helper in DreamdustMaterial.ts (or shared util).
  - Capture start color when a committed stroke begins; select nearest palette hue; store in `uCascadeColor`.
  - Add uniforms `uCascadeProgress`, `uCascadeColor`, `uCascadeSizeBoost`, `uCascadeCommit`, `uCascadeDuration`. Animate progress (2–3 s smoothstep) once `uCascadeCommit` flips true on stroke end (duration > threshold).
  - Apply cascade in shader: lerp particle tint, size/alpha boosts, and optionally curl intensity based on `uCascadeProgress`.
- Pass/Fail
  - Pass: cascade visibly rolls hue across all particles to the chosen palette color within configured duration; timing adjustable; camera unchanged; temporary scaffolding removed.
- Runbook: 05-runbooks.md#M2

Milestone M3 — Polish (Feel & Stability)
- Goal: “ink in air” feel via gentle curl/ripple, tuned tint/size gains; zero console noise during draws.
- Steps
  - Update defaults (useDreamdustUniforms.ts): adjust `uOffsetGain` (target 0.3–0.5), `uTintGain` (0.1–0.2), `uCurlAmp` (0.1–0.2) to support motion-first feel; add tap ripple impulse tied to `uForceVector` reset.
  - Trim logs/telemetry (PointCloudStage.tsx, InkSurface.tsx): keep `[PC] draw start/end`, cascade commit; rate-limit preset/controls logs.
- Runbook: 05-runbooks.md#M3

Milestone M4 — Verification & PR Baseline
- Goal: deterministic baseline per repo guide; artifact the evidence.
- Steps
  - Run commands (from repo root) and capture stdout verbatim:
    1. `pnpm install --frozen-lockfile`
    2. `pnpm --filter @refinery/schema exec tsc -p tsconfig.json --noEmit`
    3. `pnpm --filter cryptiq-mindmap-demo run lint`
    4. `pnpm --filter cryptiq-mindmap-demo run build`
    5. `pnpm run smoke`
  - Paste outputs + screenshots/raw console blocks into docs; create rollback tag.
- Runbook: 05-runbooks.md#M4
