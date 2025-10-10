# Implementation Plan — Milestones & Steps

Milestone M1 — Force‑Field Prototype (Particles Are the Ink)
- Goal: visible particle motion under the finger with a single tap and a 2–3s stroke; no overlays; camera/framing unchanged.
- Steps (files to touch)
  - Stage/material plumbing (apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx, apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts):
    - Introduce uniforms `uForceVector` (vec2 screen-space delta), `uForceIntensity` (float 0–1), `uForceDecay` (float decay per frame), `uForceActive` (bool/int flag).
    - Feed `uForceVector` from InkSurface pointer deltas each frame; when input stops, set `uForceActive=0` and rely on `uForceDecay` to fade.
  - Shader logic (DreamdustMaterial.ts): add displacement accumulation in the vertex shader using the current mirror-aware screen-space vector, e.g. `displacedPosition += uForceVector * uForceIntensity * forceWeight`; decay existing offset by multiplying with `uForceDecay`.
  - Update cadence: uniform updates tied to the 60 fps render loop (`useFrame`); ensure `material.needsUpdate = true` when toggling active state.
  - Guardrails: maintain mirror rules when mapping force vector; disable OrbitControls while drawing; keep camera fit untouched.
- Pass/Fail
  - Pass: tap near viewport center produces ≥5 px displacement within ≤2 frames; 2–3 s stroke advects particles along the path; motion decays smoothly when input stops; camera remains fixed.
  - Fail: no motion, motion lagging/past pointer, or camera interference.
- Runbook: see 05-runbooks.md#M1

Milestone M2 — Palette‑Mapped Cascade
- Goal: on stroke end, sample hue at gesture start, snap to curated palette, and roll that hue through all particles to a saturated end state.
- Steps
  - Define curated palette (`CASCADE_PALETTE` array) and nearest-color helper in DreamdustMaterial.ts (or shared util).
  - Capture start color when a committed stroke begins; select nearest palette hue; store in `uCascadeColor`.
  - Add uniforms `uCascadeProgress`, `uCascadeColor`, `uCascadeSizeBoost`, `uCascadeCommit`, `uCascadeDuration`. Animate progress (2–3 s smoothstep) once `uCascadeCommit` flips true on stroke end (duration > threshold).
  - Apply cascade in shader: lerp particle tint, size/alpha boosts, and optionally curl intensity based on `uCascadeProgress`.
- Pass/Fail
  - Pass: cascade visibly rolls hue across all particles to the chosen palette color within configured duration; timing adjustable; camera unchanged.
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
