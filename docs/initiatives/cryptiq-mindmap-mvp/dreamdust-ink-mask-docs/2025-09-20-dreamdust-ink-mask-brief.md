### Cryptiq Mindmap MVP — Dreamdust Ink: Single Source Brief

- Scope: End-to-end smoke of “Dreamdust Ink” in `apps/cryptiq-mindmap-demo` only; no cross‑workspace edits.

### END EXPERIENCE

**NOTE:** This is, by far, the _most_ important thing; I **do not** care about anything but the beauty of the end experience.

- Cinematic countdown → prompt → on your first paint, a misty point cloud eases into the image over 1–3 seconds and then holds as a calm, “breathy” silhouette with soft falloff.
- The look is ethereal: wispy tendrils, feathered edges, luminous dots (not harsh sprites), steady brightness, and only subtle breathing—no jitter or visual noise.
- Feel is immediate: taps/strokes respond within 1–2 frames and decay gracefully; everything reads like “ink in air,” never laggy or blotchy.
- Short tap/brief hold: gentle, local buoyant curls and ripples with a light size/tint nudge, settling back to the held shape in ~1–2 seconds.
- Long stroke: along the path the image diffuses into vapor, advects like smoke, and triggers a cascading recolor that ultimately saturates the entire canvas in a single hue.
- Color semantics: the final takeover hue maps to the active brain concept/category, so the wash visually telegraphs meaning.
- Interaction ergonomics: the canvas fully owns input while drawing (no camera fight); heatmap overlay aligns under your pointer; controls re‑enable on release.
- Mask page framing: minimal HUD (Clear/Undo/Auto/FPS), immediate meta‑commentary that notices and reframes your choices without delay.
- Payoff moment: after the cascade completes, a centered label surfaces “what you drew,” pairing the dreamy reveal with a crisp interpretation beat.
- Pacing and stability: smooth 60‑FPS feel, single elegant reveal per round, and visuals that remain legible and calm throughout the hold.

### Test Route (canonical)

- Local: `http://localhost:3000/quiz/archetype-v1?pc=scene-02&debug=1`
- Scene: `pc=scene-02` (prebaked “cat” positions/colors)

### END EXPERIENCE

**NOTE:** This is, by far, the _most_ important thing; I **do not** care about anything but the beauty of the end experience.

- Cinematic countdown → prompt → on your first paint, a misty point cloud eases into the image over 1–3 seconds and then holds as a calm, “breathy” silhouette with soft falloff.
- The look is ethereal: wispy tendrils, feathered edges, luminous dots (not harsh sprites), steady brightness, and only subtle breathing—no jitter or visual noise.
- Feel is immediate: taps/strokes respond within 1–2 frames and decay gracefully; everything reads like “ink in air,” never laggy or blotchy.
- Short tap/brief hold: gentle, local buoyant curls and ripples with a light size/tint nudge, settling back to the held shape in ~1–2 seconds.
- Long stroke: along the path the image diffuses into vapor, advects like smoke, and triggers a cascading recolor that ultimately saturates the entire canvas in a single hue.
- Color semantics: the final takeover hue maps to the active brain concept/category, so the wash visually telegraphs meaning.
- Interaction ergonomics: the canvas fully owns input while drawing (no camera fight); heatmap overlay aligns under your pointer; controls re‑enable on release.
- Mask page framing: minimal HUD (Clear/Undo/Auto/FPS), immediate meta‑commentary that notices and reframes your choices without delay.
- Payoff moment: after the cascade completes, a centered label surfaces “what you drew,” pairing the dreamy reveal with a crisp interpretation beat.
- Pacing and stability: smooth 60‑FPS feel, single elegant reveal per round, and visuals that remain legible and calm throughout the hold.

### Guardrails (performance and resilience)

- DPR clamp ≤ 1.8 desktop; persistent Canvas; ≤ 150,000 points on desktop; ≥ 60 FPS proxy via frame‑percentiles.
- Graceful fallback: if vertex path not viable, fragment‑only tint or `PointsMaterial` fallback; single‑shot logs only (no spam).
- App‑only scope; smallest reversible diffs; unified caps snapshot (single source of truth at Canvas creation).

### Implementation Touchpoints (exact file paths)

- Shader assembly and uniforms: `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts`
- GLSL chunks (FBM/curl/soft‑sprite): `apps/cryptiq-mindmap-demo/app/components/dreamdust/glsl/chunks.ts`
- Stage wiring, geometry, fallback material, orbit: `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx`
- Ink capture (off‑screen canvas → DataTexture): `apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx`
- Reveal/clock/uniform drivers: `apps/cryptiq-mindmap-demo/app/components/dreamdust/useDreamdustUniforms.ts`
- Metrics (one‑shot caps, frame‑percentiles): `apps/cryptiq-mindmap-demo/app/components/dreamdust/metrics.ts`
- Quiz entry route: `apps/cryptiq-mindmap-demo/app/quiz/[slug]/page.tsx`

### Current Evidence (last smoke test)

- Caps (single): `[dreamdust] caps { vertexInkOk: true, dprClamp: 1.8, ... }`
- Instances (single): `[PC] instances: 134162`
- Reveal timeline: `[Dreamdust] reveal start { duration: 2 }` then `reveal end { duration: 2 }`
- Perf proxy (single): `[dreamdust] frame-percentiles { sampleCount: 240, p50Ms: ~8.3, p90Ms: ~9.1 }`
- Input plumbing: `[PC] draw start/end ...`, `[dreamdust] ink-latency { ms: ~16.7, frames: 1 }`
- Visual note: cloud legibility low (“vibrating haze”); no visible ink reaction despite events/heatmap ON.

### Non‑Visual Acceptance Criteria (pass/fail, next smoke)

- Rendering/reveal
  - No `THREE.WebGLProgram` errors; no compile watchdog timeout.
  - Single caps snapshot; single instances log ≤ 150,000; reveal start/end within 1–3s.
- Input/ink reaction
  - On pen down: `[PC] draw start` once; Orbit disabled; pointer captured.
  - On end: `[PC] draw end { type, durationMs, distancePx }`; Orbit re‑enabled.
  - Material samples ink texture: one‑shot log confirms `uInkTex.value.image { width, height }` bound; visible local effect under elevated debug gain.
- Metrics/stability
  - One frame‑percentiles sample after ~240 frames; no duplicate caps/percentiles logs; no WebGL invalid‑program spam.
  - If fallback ever engages: exactly one `[Dreamdust] compile timeout — falling back to PointsMaterial` and continued interactivity (depthWrite=false).
- Caps coherence
  - A single frozen caps object is emitted once at Canvas creation and consumed by stage/host consistently; no conflicting `vertexInkOk` readings.

### Test Protocol (deterministic)

- Prep: `rm -rf apps/cryptiq-mindmap-demo/.next`; start dev; load the canonical route; empty cache + hard reload.
- Observe only the single expected logs; take a screenshot at reveal end; draw a short tap and a long stroke to validate local reaction vs cascade.
- Record: caps payload, instances count, reveal timings, frame‑percentiles, ink‑latency, and any fallback log.
