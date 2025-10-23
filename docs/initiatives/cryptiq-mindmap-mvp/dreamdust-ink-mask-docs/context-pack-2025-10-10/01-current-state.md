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
- Localized falloff remains inactive in prod: during long strokes `uTempIntensity > 0` but `uTempFalloffOn` stays 0 (see raw dump). Result is whole‑cloud jitter instead of a local plume. Prebaked path is in use, so the one‑shot falloff latch likely ran before material/uniforms were attached.
- New (same session, 2025‑10‑12): Forcing falloff ON via interval (`ensureFalloff()`) eliminated global jitter but produced no motion at all, despite `uTempIntensity` rising. This strongly indicates a shader order bug: the falloff influence uses `vInkUv` before `vInkUv` is assigned, making influence ~0.

Relevant Files
- InkSurface pipeline: apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx
- Material/shader: apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts
- Stage orchestration: apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
- Mirror audit: docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-10-10-ink-mirroring-pipeline-audit.md
- Raw smoke dump (2025‑10‑12): docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-10-12-ink-falloff-inactive-smoke-raw.md
 - Raw smoke dump (same session, forced falloff): docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-10-12-ink-falloff-interval-smoke-raw.md

—

## 2025-10-12 Run — Observed vs Expected

Observed (with `?pc=scene-03&debug=1&falloff=1` after reveal end):
- `uTempIntensity` rises/decays during strokes as expected.
- `uTempRadius` ≈ 0.16; `uTempCenter` tracks the live UV; pointer guards log mirror flags.
- `uTempFalloffOn` remains 0 throughout multiple long strokes → localized branch never engages.
- Visual: slight whole‑cloud jitter; no localized plume under the pointer.

Implications:
- Prebaked latch likely didn’t apply in this session despite `falloff=1`. The uniform write may still be racing material readiness in prebaked mode.
- When falloff is OFF, only the global temp force contributes, explaining subtle whole‑cloud motion.
- Prior “falloff ON but zero motion” finding was traced to shader order (influence sampling before UV assignment). That ordering has been corrected to derive screen‑space UV from `clipPos` before influence. Next run must validate this fix with `uTempFalloffOn: 1` actually in effect.

Next validation (no code edits in this step):
- After reveal, confirm a one‑shot console log `[PC] falloff latch (prebaked) applied`. If absent, issue `window.dreamdust.ensureFalloff()` while drawing and re‑probe uniforms.
- Pass expectation for M1: with `uTempFalloffOn: 1`, a visible localized plume appears within ≤2 frames; displacement decays smoothly when input stops; camera stays fixed; no overlays.

—

## 2025-10-13 Run — With and without Inkboost

Observed
- First pass (`&falloff=1`): `uTempFalloffOn: 1`, live `uTempCenter`, `uTempRadius ~0.16`, `uTempIntensity` rises/decays; visuals mostly unreactive.
- Second pass (`&falloff=1&inkboost=1.8`): slight localized motion visible near cursor; uniforms consistent with first pass.

Implication
- Localized vertex offset is executing (uniforms correct), but the baseline displacement is too small to be obvious at Scene‑03 camera distance without a temporary boost.

Next
- Keep `uTempRadius ~0.16–0.18`; for the next run, either retain `&inkboost` for validation or modestly increase the effective offset gain so motion is undeniable without the flag. Palette cascade can begin once local motion is plainly visible at default settings.
