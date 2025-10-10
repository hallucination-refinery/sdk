# Implementation Plan — Milestones & Steps

Milestone M1 — Force‑Field Prototype (Particles Are the Ink)
- Goal: visible particle motion under the finger with a single tap and a 2–3s stroke; no overlays; camera/framing unchanged.
- Steps (files to touch)
  - Add a small per‑point displacement/velocity field in the stage/material (apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx, DreamdustMaterial.ts). 
  - Feed a screen‑space force vector (from the existing input field) into the shader/uniforms; apply to positions (or offsets) with decay.
  - Guardrails: maintain current mirror rules; ensure controls lock while drawing.
- Pass/Fail
  - Pass: points visibly move under the pointer within 1–2 frames; effect decays when input stops.
  - Fail: no motion or motion offset from pointer.
- Runbook: see 05-runbooks.md#M1

Milestone M2 — Palette‑Mapped Cascade
- Goal: on stroke end, sample hue at gesture start, snap to curated palette, and roll that hue through all particles to a saturated end state.
- Steps
  - Add palette and nearest‑color selection util; expose palette editing in code.
  - Implement timed cascade uniform(s): cascade mix, color, size/alpha boost; apply across all particles.
- Pass/Fail
  - Pass: hue rolls across the cloud smoothly to a single color; timing is controllable; camera unchanged.
- Runbook: 05-runbooks.md#M2

Milestone M3 — Polish (Feel & Stability)
- Goal: “ink in air” feel via gentle curl/ripple, tuned tint/size gains; zero console noise during draws.
- Steps
  - Tune uTintGain/uOffsetGain/uCurlAmp defaults; add soft ripple on tap.
  - Rate‑limit or gate recurring logs; keep essential telemetry only.
- Runbook: 05-runbooks.md#M3

Milestone M4 — Verification & PR Baseline
- Goal: deterministic baseline per repo guide; artifact the evidence.
- Steps
  - Run baseline commands and paste stdout: install → typecheck → lint (warn only) → build → smoke.
  - Add screenshots and raw console blocks to docs; tag the commit for rollback.
- Runbook: 05-runbooks.md#M4

