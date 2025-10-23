# Dreamdust Ink — Target Architecture & Experience Map (2025-09-20)

## Experience Goals (recap)

- Mist should ease into the prebaked image within 1–3 seconds, then settle into a calm, “breathy” silhouette with stable brightness.【F:docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-09-20-dreamdust-ink-mask-brief.md†L11-L20】
- Short taps trigger localized curls and soft point-size/tint pulses that resolve within ~2 seconds while respecting the held shape.【F:docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-09-20-dreamdust-ink-mask-brief.md†L13-L15】
- Long strokes vaporize into a smoke-like cascade that recolors the full canvas with the active concept hue, delivering a single payoff label moment.【F:docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-09-20-dreamdust-ink-mask-brief.md†L15-L20】
- HUD remains minimal (Clear/Undo/Auto/FPS) while Dreamdust emits a single caps snapshot as the source of truth for vertex ink and DPR clamp.【F:docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-09-20-dreamdust-ink-mask-brief.md†L17-L20】【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L1415-L1429】

## Why these targets

- The latest smoke run hit all one-shot logs (`caps`, `[PC] instances`, reveal start/end, frame percentiles, ink latency) but the cloud still read as a “vibrating haze” with no visible ink response despite heatmap activity, so the targets focus on clarity, curl staging, and ink gains to close that gap.【F:docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-09-20-dreamdust-ink-mask-brief.md†L64-L69】

## Target Data Flow

1. Pointer events feed the off-screen Dreamdust ink canvas, painting gradients into a `THREE.DataTexture` and throttling flushes to a single RAF per frame.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx†L93-L149】
2. The interaction texture streams into the stage uniforms through `PointCloudStage` so Dreamdust uniforms always reference the live `uInkTex` and caps-derived toggles.【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L703-L798】
3. Vertex processing unprojects mist positions, applies curl+FBM forces, breath modulation, and ink-driven offsets to drive the reveal path.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts†L208-L299】
4. Fragment shading samples soft-sprite and rim helpers, blending cascade color and ink tint fallbacks when vertex ink is unavailable.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts†L315-L400】
5. Optional bloom renders through an `EffectComposer` pass after the Dreamdust draw to reinforce the luminous payoff.【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L496-L528】
6. HUD overlays (`InkFieldHost`) lock controls, push ink stats, and emit latency metrics while the telemetry layer logs percentiles once per session.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/InkFieldHost.tsx†L177-L307】【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/metrics.ts†L300-L409】
7. The quiz route mounts Dreamdust inside `DreamdustProvider`, ensuring the stage and HUD remain the single interactive surface for the mask round.【F:apps/cryptiq-mindmap-demo/app/quiz/[slug]/page.tsx†L119-L228】

## Module Responsibilities (target)

- **Ink capture (`InkSurface.tsx`)** — Maintain RAF-throttled texture flushes, pointer distance logging, and gradient painting while preparing for pressure-aware tap vs stroke thresholds.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx†L120-L218】
- **Dreamdust stage (`PointCloudStage.tsx`)** — Bind live ink textures, propagate caps to uniforms, enforce the single `logOnce('caps', …)` snapshot, and keep bloom optional for devices under budget.【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L703-L817】【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L1415-L1446】
- **Material & uniforms (`DreamdustMaterial.ts`)** — Keep vertex/fragment GLSL aligned with curl, vapor, tap impulses, rim lighting, and ink tint fallbacks without leaking attribute declarations into shared chunks.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts†L208-L400】
- **GLSL chunks (`glsl/chunks.ts`)** — Preserve pure helper functions for FBM, curl, rim falloff, and depth fades so material assembly can inline without side effects.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/glsl/chunks.ts†L327-L416】
- **Metrics (`metrics.ts`)** — Continue one-shot ink latency and frame percentile logging, tighten tunable clamps, and expose preset-safe ranges to the HUD.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/metrics.ts†L144-L209】【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/metrics.ts†L341-L409】
- **Route (`app/quiz/[slug]/page.tsx`)** — Ensure Dreamdust remains the default scene when `pc` is present, with the HUD layered once over the full-viewport stage container.【F:apps/cryptiq-mindmap-demo/app/quiz/[slug]/page.tsx†L119-L228】

## Tunables & Presets (target ranges)

- `revealDuration`: 1–3 s to keep mist→image pacing tight while staying within the stored `revealMs` clamp range.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/metrics.ts†L144-L209】
- `breathAmp`: 0–0.15 so the `uBreath` modulation stays calm and avoids haze jitter in the mist hold.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts†L226-L283】
- `curlFactor`: 0–0.6 (maps to `uDriftAmp * uCurlAmp`) to stage localized twirls without overwhelming the silhouette.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts†L260-L268】【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L731-L743】
- `evolution`: 0–1 to gate reveal noise speed and vapor FBM blend, keeping the countdown smooth before cascade onset.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts†L352-L375】
- `inkGain`: 0–2 across offset/size/tint channels so ink reactions read instantly without clipping point size or tint.【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L738-L743】【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts†L287-L295】
- `rimGamma`: 1–3 to balance soft sprite falloff vs rim accent for both mist hold and cascade payoff.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts†L326-L397】
- `cascadeRate`: 0–1, mapping to `uCascade` and vapor gain so the long-stroke recolor remains deterministic and single-shot.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts†L260-L275】【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts†L387-L395】
- Presets: maintain a calm default (mid revealDuration, low curlFactor, low inkGain) and a vapor takeover preset (short revealDuration, higher cascadeRate, elevated inkGain) built from these ranges.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/metrics.ts†L144-L209】

## Acceptance (non-visual)

- `[dreamdust] caps` and `[PC] instances` log exactly once, with the instances count ≤150 k and DPR clamp ≤1.8.【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L1415-L1429】
- Reveal start/end pair within 1–3 s alongside single-shot frame percentiles and ink latency output.【F:docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-09-20-dreamdust-ink-mask-brief.md†L64-L69】【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/metrics.ts†L341-L409】
- Pointer logs (`[PC] draw start/end`) bracket each interaction while `uInkTex` stays bound and reactive in Dreamdust uniforms.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/InkFieldHost.tsx†L177-L340】【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts†L287-L299】

## Migration Plan

1. Finalize the RAF-gated ink pipeline and expose reveal/evolution tunables in the HUD for live range testing.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx†L140-L218】【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/metrics.ts†L144-L209】
2. Tighten Dreamdust uniform defaults (breath, curl, ink gains) to land mist clarity and tap curls, then validate with smoke logs.【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L731-L743】
3. Author cascade presets (calm hold vs vapor takeover) and ensure `[Dreamdust] reveal start/end` timings align with the 1–3 s window.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts†L260-L395】
4. Re-enable bloom selectively with guardrails for mobile/low-power caps, keeping luminous payoff without perf spikes.【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L496-L528】【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L1415-L1429】
5. Lock presets and tunable storage once visuals read correctly, then capture baseline smoke evidence for sign-off.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/metrics.ts†L214-L409】

## Risks & Mitigations

- **Perf spikes** — Excess curl or bloom can drop frame percentiles; clamp DPR and point budgets via caps and disable bloom when caps fail.【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L1415-L1446】【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/metrics.ts†L400-L409】
- **Driver quirks** — Strictly pure GLSL chunks and compile watchdog fallback keep undefined behavior from crashing the reveal path.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/glsl/chunks.ts†L327-L371】【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L420-L434】
- **Ink desync** — If the HUD and stage diverge on caps, enforce the single caps snapshot through `DreamdustProvider` before updating uniforms.【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L1415-L1429】【F:apps/cryptiq-mindmap-demo/app/quiz/[slug]/page.tsx†L119-L228】

## Open Questions

- Should cascade presets also adjust bloom strength to maintain rim readability across calm vs vapor modes?【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L496-L528】
- Do we need additional HUD affordances to surface preset state without cluttering the minimal controls?【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/InkFieldHost.tsx†L177-L307】
