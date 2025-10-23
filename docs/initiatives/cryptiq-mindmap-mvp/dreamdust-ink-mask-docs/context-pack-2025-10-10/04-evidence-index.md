# Evidence Index — Quick Links

Primary Docs
- Mirror audit: docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-10-10-ink-mirroring-pipeline-audit.md
- Smoke tests: docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-10-09-ink-interaction-smoke-test.md
- Analysis: docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-10-09-ink-interaction-analysis.md
- Plan audit: docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/PLAN-AUDIT.md
- Reference notes (Codrops interactive particles): docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/06-reference-notes.md

Key Files
- InkSurface: apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx
- Material/Shader: apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts
- Stage: apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx

Run Artifacts — 2025-10-11
- Terminal: clean install/build/start with Node v22; prod server on :3000 (logs pasted in task).
- Console: scene init OK; strokes logged; uniform probe via `window.__vertexCaptureArgs?.material` returned `{}` (capture unavailable). See runbook “Regression triage” and “Iteration result”.
 - Follow-up: Phase A restored (global motion visible). Dev flag `&falloff=1` added for localized test; use `window.dreamdust.dumpUniforms()` to capture uniform values during strokes.
 - Latest trial: Using `&falloff=1`, `dumpUniforms()` during a long stroke shows `uTempIntensity` > 0 but `uTempFalloffOn: 0` throughout; visual: cloud jitter remains global. Recorded console excerpt in the task.
 - New failure (2025-10-11): Blank canvas with shader compile error: `THREE.WebGLProgram: Shader Error ... VERTEX ... 'viewPos' : undeclared identifier` at px-scaling block. See full console log in task.
 - New observation (2025-10-12): Scene renders; during long stroke, `uTempIntensity` increases but `uTempFalloffOn: 0` across samples; no local plume; slight global jitter may be perceptible. Full console + uniform logs pasted in task.

Run Artifacts — 2025-10-12
- Raw dump: docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-10-12-ink-falloff-inactive-smoke-raw.md
- Summary: Whole-cloud jitter persists; `uTempFalloffOn` stays 0 while drawing; prebaked path active; likely flag latch before material/uniforms exist.
 - Raw dump (same session): docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-10-12-ink-falloff-interval-smoke-raw.md
 - Summary: Falloff forced ON via interval; `uTempIntensity` rises, `uTempFalloffOn: 1`, yet no motion at all. Points to shader order bug: influence uses `vInkUv` before it’s assigned, yielding ~0 influence and zero displacement.

Run Artifacts — 2025-10-13
- Raw dump: docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-10-13-ink-inkboost-smoke-raw.md
- Summary: With `&falloff=1`, uniforms correct but motion faint; with `&inkboost=1.8`, slight localized motion appears; higher boosts (≥2.0) feel global.

Assets
- Initial load screenshot: docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/2025-10-09-Test-1-Initial-Load.png
- Camera framing: docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/2025-10-08-iteration-06-part-A-initial-camera-framing.png

Checkpoint
- Tag: checkpoint/scene-03-screen-space-ink-2025-10-10 (git checkout tags/checkpoint/scene-03-screen-space-ink-2025-10-10)
