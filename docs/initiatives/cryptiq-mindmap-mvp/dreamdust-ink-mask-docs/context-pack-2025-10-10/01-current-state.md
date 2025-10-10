# Current State — What Works vs Gaps

Proven (with evidence)
- Input capture is solid; strokes/taps reach the app and update the ink texture. See `[PC] draw start/end` and `[PC] ink tex updated` in: docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-10-09-ink-interaction-smoke-test.md
- UV mapping is correct for scene‑03 (mirrorLR/UD defaults honored). Guard logs: `InkSurface.tsx` emit raw/clamped UV with mirror flags.
- Ink texture uploads at full signal (alpha up to 255) confirmed in DevTools.
- Performance acceptable (p50 ~8–9ms; p90 ~13–17ms). See smoke logs.

Gaps
- The visible effect path modulates tint/alpha but does not move particles, so it cannot deliver the “ink in air” feel by itself.
- Fragment vs vertex sampling mismatch previously obscured results; we now force screen‑space sampling for scene‑03, but motion still needs to be implemented.
- Console noise (dev‑tool warnings, HMR churn) can distract from key signals.

Relevant Files
- InkSurface pipeline: apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx
- Material/shader: apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts
- Stage orchestration: apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
- Mirror audit: docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-10-10-ink-mirroring-pipeline-audit.md

