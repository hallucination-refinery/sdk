# Dreamdust Ink — Mask Round Brief (v{n})

## Metadata

- Date: {YYYY-MM-DD} Time: {HH:MM TZ}
- Route: `/quiz/archetype-v1?pc=scene-02&debug=1`
- Device/Browser: {e.g., M1 Pro / Chrome 140 incognito}
- Scene: `scene-02` (prebaked cat) DPR clamp: ≤1.8 Point cap: ≤150k

## End Experience (aesthetic-only)

- {Mist → image in 1–3s (eased), calm “breathy” hold, soft falloff}
- {Short tap: gentle curls/ripples; quick, graceful decay}
- {Long stroke: vapor diffusion along path → full‑canvas color takeover}
- {Color semantics: takeover hue maps to concept category}
- {Minimal HUD + immediate meta‑commentary}
- {Payoff: centered label “what you drew”}

## Guardrails (performance & resilience)

- Performance: ≥60 FPS proxy via frame‑percentiles; DPR ≤1.8; ≤150k points
- Resilience: vertex fail → fragment‑only tint or PointsMaterial fallback (no spam)
- Determinism: single caps snapshot; single percentiles sample; single instances log

## Architecture Choices (locked)

- Flow: pointer → off‑screen interaction texture → shader sampling → curl+FBM → post/bloom
- Tunables: {revealDuration, curlFactor, evolution, inkGain, rimGamma, breathAmp}
- Presets: {named preset list with values for A/B}
- References: {link + 1‑line why}

## Implementation Touchpoints (exact paths, reference only)

- Material/uniforms: `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts`
- GLSL chunks: `apps/cryptiq-mindmap-demo/app/components/dreamdust/glsl/chunks.ts`
- Stage/fallback: `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx`
- Ink capture: `apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx`
- Uniform drivers: `apps/cryptiq-mindmap-demo/app/components/dreamdust/useDreamdustUniforms.ts`
- Metrics: `apps/cryptiq-mindmap-demo/app/components/dreamdust/metrics.ts`
- Route: `apps/cryptiq-mindmap-demo/app/quiz/[slug]/page.tsx`

## Current Evidence (attach assets; verbatim logs)

- Screenshot(s): `./assets/{YYYY-MM-DD}-reveal-end.png`
- Caps: `[dreamdust] caps {...}`
- Instances: `[PC] instances: {N}`
- Reveal: `[Dreamdust] reveal start/end { duration: ~{1–3} }`
- Percentiles: `[dreamdust] frame-percentiles { p50Ms: x, p90Ms: y }`
- Ink: `{draw start/end logs, ink-latency}`; note if visual reaction occurred

## Non‑Visual Acceptance Criteria (checklist)

- [ ] No shader/invalid‑program errors; no watchdog timeout
- [ ] Single caps snapshot; single instances log (≤150k); reveal 1–3s
- [ ] Input ownership: pointer captured; camera locked during draw; released on end
- [ ] Material samples ink texture (one‑shot log `uInkTex.value.image {w,h}`); visible effect under debug gain
- [ ] One frame‑percentiles sample (~240 frames); no duplicate logs
- [ ] If fallback triggers: exactly one timeout log; interactivity preserved

## Test Protocol (deterministic)

1. `rm -rf apps/cryptiq-mindmap-demo/.next` → dev → hard reload route above
2. Observe expected one‑shot logs; capture reveal‑end screenshot
3. Draw: one short tap, one long stroke; record logs and any visual change
4. Save preset deltas if tuned

## Tiny PR Batches (planning stub)

- PR-{n}: Title — Files touched — Parallelizable? — Checks (install → thin typecheck → lint warn → build → smoke logs) — Rollback conditions

## Iterate → Freeze

- Timebox: {e.g., 30–60m}; record preset values and screenshots
- Freeze on preset {name}; note rationale

## Open Questions

- {List decisions needed to progress}
