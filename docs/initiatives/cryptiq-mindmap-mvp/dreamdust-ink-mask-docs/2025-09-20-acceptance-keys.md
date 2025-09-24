# Dreamdust Ink — Acceptance Keys Registry (2025-09-20)

## Canonical log keys (exact strings or regex you will use)

| Key label | Regex anchor | Must appear once? | Sample line |
| --- | --- | --- | --- |
| `[dreamdust] caps` | `^\\[dreamdust\\] caps\\s` | Yes — single snapshot per session | `[dreamdust] caps { vertexInkOk: true, floatOk: true, aliasedPointSizeRange: [1, 64], dpr: 2, dprClamp: 1.8 }` |
| `[PC] instances` | `^\\[PC\\] instances:` | Yes — emit after geometry upload | `[PC] instances: 89441` |
| `[Dreamdust] reveal start` | `^\\[Dreamdust\\] reveal start\\b` | Yes — one per reveal cycle | `[Dreamdust] reveal start { duration: 2.000 }` |
| `[Dreamdust] reveal end` | `^\\[Dreamdust\\] reveal end\\b` | Yes — completes each reveal | `[Dreamdust] reveal end { duration: 2.000 }` |
| `[dreamdust] frame-percentiles` | `^\\[dreamdust\\] frame-percentiles\\s` | Yes — single sample once ≥240 frames collected | `[dreamdust] frame-percentiles { sampleCount: 240, p50Ms: 12.4, p90Ms: 18.7 }` |
| `[dreamdust] ink-latency` | `^\\[dreamdust\\] ink-latency\\s` | Yes — first successful ink latency capture | `[dreamdust] ink-latency { ms: 16.667, frames: 1.00 }` |
| `[Dreamdust] compile timeout — falling back to PointsMaterial` | `^\\[Dreamdust\\] compile timeout — falling back to PointsMaterial$` | No — only when shader watchdog triggers fallback | `[Dreamdust] compile timeout — falling back to PointsMaterial` |
| `[Dreamdust] ink-tex bind` | `^\\[Dreamdust\\] ink-tex bind\\s` | Yes — once on first non-null ink texture | `[Dreamdust] ink-tex bind { width: 256, height: 256, needsUpdate: true }` |
| `[PC] ink-uv guard ok` | `^\\[PC\\] ink-uv guard ok\\s` | Yes — once per session when first stroke normalizes | `[PC] ink-uv guard ok { raw: [0.52, 0.49], clamped: [0.52, 0.49], mirror: { lr: false, ud: true } }` |
| `[PC] ink-uv guard violation` | `^\\[PC\\] ink-uv guard violation\\s` | No — indicates out-of-range or mirror mismatch | `[PC] ink-uv guard violation { raw: [1.02, -0.01], clamped: [1.00, 0.00], mirror: { lr: false, ud: false } }` |
| `[dreamdust] caps-fanout` | `^\\[dreamdust\\] caps-fanout\\s` | Yes — once after caps hydrate | `[dreamdust] caps-fanout { stage: true, provider: true, hud: true, metrics: true }` |
| `[VTFSanity] aSimUv samples` | `^\\[VTFSanity\\] aSimUv samples` | Yes — proves VTF UV diversity under debug runs | `[VTFSanity] aSimUv samples { idx:0, uv:[0.00167,0.00167] }, …` |
| `[VTFSanity] using USE_SIM_POS=true, uSimPositionTex!=null` | `^\\[VTFSanity\\] using USE_SIM_POS` | Yes — confirms SIM position texture bound | `[VTFSanity] using USE_SIM_POS=true, uSimPositionTex!=null` |
| `[debugSim] points-material bypass ON` | `^\\[debugSim\\] points-material bypass ON$` | Optional — only when `debugSim=1` is exercised | `[debugSim] points-material bypass ON` |

## Source of truth objects

- Caps snapshot emits from `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx` via the `logOnce('caps', …)` helper in `metrics.ts` and must fire exactly once when the stage binds Dreamdust uniforms. That payload is the frozen source of truth for `vertexInkOk`, `dprClamp`, and instance guardrails across all consumers.

## Thresholds & single-shot policy

- Desktop DPR clamp must remain ≤ **1.8**; any deviation should flag a regression in the caps payload.
- Desktop instancing budget stays ≤ **150,000** points; `[PC] instances` should report the actual count and must not exceed this guardrail.
- Frame percentiles taken after ~240 frames: enforce **p50 ≤ 16 ms** and **p90 ≤ 28 ms** while instrumentation is active (tighten once perf tuning lands).
- Ink latency measurement should land ≤ **20 ms** (≤1.2 frames) to preserve the responsive “ink-in-air” feel.
- Reveal start/end remain a paired one-shot per cascade: once `[Dreamdust] reveal start` fires, exactly one `[Dreamdust] reveal end` should close the cycle within 1–3 s.
- Compile timeout log only appears if the shader watchdog trips; absence of this line confirms the main Dreamdust program compiled successfully.

## Validation notes

- Audit log captures to ensure every “Yes” key appears exactly once per smoke session; duplicate caps/percentiles/ink-latency entries indicate a regression in the one-shot guards.
- When fallback triggers, confirm the compile-timeout log is singular and that the system continues with the PointsMaterial path without repeating the watchdog message.
- Cross-check caps payload against reveal logs: mismatched `vertexInkOk` or `dprClamp` readings imply the source-of-truth snapshot is drifting.
- Verify frame-percentile thresholds alongside the instances count to ensure performance guardrails (≤100 k points at ≤28 ms p90 during Batch 0) remain intact.
