# Dreamdust Ink — Target Architecture & Experience Map (Template)

## Experience Goals (recap)

- Mist→image (1–3s), breathy hold; tap curls; stroke vapor + color takeover; minimal HUD; payoff label.

## Target Data Flow

- Pointer → Interaction FBO/DataTexture (accumulating) → Shader sampling (vertex+fragment) → Curl+FBM field → Post/Bloom → HUD/Meta.

## Module Responsibilities (target)

- Ink capture: accumulate strokes per-frame; throttle updates to ≤1 per RAF
- Material: bind `uInkTex`, `uCascade`, `uRimGamma`, reveal/breath uniforms; no attribute declarations in chunks
- Chunks: pure functions only (FBM, curl, soft-sprite + rim)
- Stage: caps snapshot once; fallback guard; camera locked; one-shot logs
- Post: optional bloom with low-cost params; disabled on mobile if needed

## Tunables & Presets (target ranges)

- revealDuration: 1–3s; curlFactor: {0–1}; evolution: {0–1}; inkGain: {0–2}; rimGamma: {1–3}; breathAmp: {0–0.2}
- Preset A/B: {name → values}

## Acceptance (non-visual)

- Single caps/instances logs; reveal start/end within window; percentiles once
- Draw start/end logs; ink-latency ≤ 1 frame average; material bound to live `uInkTex`

## Migration Plan

- Step 1: wire FBO/DataTexture path; Step 2: tune reveal/hold; Step 3: tap/ stroke gains; Step 4: bloom; Step 5: presets

## Risks & Mitigations

- Perf spikes → clamp DPR/points; fallback early
- Driver quirks → avoid undefined GLSL, keep chunks pure

## Open Questions

- {weights map? mobile profile? cascade palette?}
