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

Assets
- Initial load screenshot: docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/2025-10-09-Test-1-Initial-Load.png
- Camera framing: docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/2025-10-08-iteration-06-part-A-initial-camera-framing.png

Checkpoint
- Tag: checkpoint/scene-03-screen-space-ink-2025-10-10 (git checkout tags/checkpoint/scene-03-screen-space-ink-2025-10-10)
