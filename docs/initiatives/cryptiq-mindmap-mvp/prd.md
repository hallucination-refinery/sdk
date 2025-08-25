## Cryptiq Mindmap MVP — Quiz-Driven Self‑Discovery PRD

### 0) Current state snapshot (context)

- Visuals: brain silhouette is locked (“good enough”) with translucent shell + glow orbs; no further shader/camera iteration in MVP.
- Codebase: R3F scene (`packages/canvas-r3f`) stable; deterministic vertex mapping in place; screenshot/automation infra available; consolidation branch updated.
- Data reality: legacy demo data is representative; enrichment pipeline is out of scope. We will generate concepts in‑app from a lightweight quiz/chat loop.

---

### 1) Vision and Audience

- Vision: a fast, sticky, entertaining self‑discovery mini‑experience that produces playful, shareable results (not diagnosis).
- Audience: 16–34, web/desktop‑only for MVP; low‑friction entry (no login; optional consent for saving).

---

### 2) Goals, Non‑Goals, KPIs

- Goals
  - Deliver a 30–60s “play and see your mindmap” loop with immediate visual payoff.
  - Generate concepts live from answers; update the brain deterministically without background services.
  - Make results shareable (OG/Twitter cards) and repeatable (try another pack/prompt).
- Non‑Goals
  - No clinical/diagnostic claims; no deep psychometrics; no heavy data collection.
  - No server‑side enrichment pipeline; no multi‑minute onboarding; no complex edge analytics.
- KPIs (MVP)
  - Start→Complete ≥ 60%; avg time to complete 30–90s; Share CTR ≥ 5%; D1 return ≥ 10%.

---

### 3) Core Experience Pillars

- 6–12 rapid questions (image choices, forced choices, sliders), visible progress.
- Immediate narrative result: “archetype” + 2–3 lines + call‑to‑action + share.
- Instant brain morph: answers map to concept updates (create/update weights/categories) rendered on the brain.
- Repeat loop: offer daily prompt/new pack after result.

---

### 4) IA & User Flows

- Landing → Quiz (≤12 questions) → Result card → Share → Try another.
- Result page: headline, 2–3 lines, highlight chips (top concepts/categories), share buttons.
- Desktop‑first: keyboard/mouse navigation, clear focus states, responsive layout for laptop/desktop breakpoints.

---

### 5) Mechanics and Data Model

- Concept model (session‑generated)
  - `id: string` — stable across session (e.g., `packId:conceptKey`).
  - `label: string` — user‑legible concept name.
  - `category: string` — for Affinity coloring (4–10 bins, e.g., values/traits/emotions/coping/goals).
  - `weight: number` — [0..1] salience; answers increment by rule.
  - `createdFrom: string[]` — question/answer IDs that produced/updated this concept.
  - `firstSeen: string` | `lastSeen: string` — ISO timestamps when the concept first/last changed (for optional Temporal lens).
  - `secret?: boolean` — always false in MVP; placeholder for future privacy modes.
- Quiz pack config
  - `pack`: `{ id, title, slug, theme, archetypes[] }`.
  - `questions[]`: `{ id, type: 'choice'|'image-choice'|'slider', prompt, options[] }`.
  - `options[]`: `{ id, label|image, tags: string[], effects: ConceptDelta[] }`.
  - `ConceptDelta`: `{ conceptKey, deltaWeight (0..1), category?, label? }`.
  - `resultMapping`: rules to compute top archetype (e.g., sum of tag weights).
- Mapping to visualization
  - Deterministic vertex assignment uses `id` hashing; weights modulate size/halo (no position changes).
  - Maintain silhouette with a decorative ambient particle layer (non‑interactive) to avoid “sparse” look.

---

### 6) Lenses and Interaction (MVP)

- Affinity lens (ship): category→color (≥7 distinct hues; overflow to gray).
- Temporal lens (optional behind flag): recency→brightness using `firstSeen/lastSeen` from the session.
- Causal lens (defer): no edges in MVP; on selection we may show a basic related‑concepts list instead of lines.
- Interaction: hover tooltip (label, category, weight), click opens a compact details panel with “made by: answer chips”.

---

### 7) Result and Sharing

- Result card: `archetype`, 2–3 line copy, top 3 concept chips, CTA (try another / copy link).
- OG/Twitter cards: 1200×630 static image with title + brand; dynamic OG endpoint for result URLs.
- Social validators in CI: Facebook Sharing Debugger, Twitter Card Validator.

---

### 8) Accessibility & Performance

- Accessibility: WCAG 2.2 AA; alt text for images; focus styles; semantic buttons; keyboard navigation; color contrast checked.
- Performance: Core Web Vitals targets — LCP ≤ 2.5s, INP ≤ 200ms, CLS < 0.1.
- Delivery: critical JS/CSS ≤ 100KB; preconnect fonts; lazy‑load non‑critical media; preload quiz pack JSON.

---

### 9) Privacy & Data Handling

- Collect the minimum; default to local/session storage; explicit opt‑in to persist.
- No DOB/time unless astrology skin is enabled (opt‑in only); clearly explain purpose; allow reset/delete.

---

### 10) Risks & Mitigations

- Low engagement content → Ship 2 packs (archetype + rapid reactions) and A/B titles/images.
- Visual sparsity with few concepts → Use decorative ambient layer; scale halos/size by weight for readability.
- Overfitting archetypes → Keep results falsifiable and specific; avoid Barnum copy; iterate via analytics.
- Desktop perf spikes → Limit shaders, cap instances at 500, defer edges; measure with stats overlay on dev only.

---

### 11) Implementation Plan (repo mapping)

- Data & state
  - Add `quizSlice` to `packages/store`: holds `pack`, `responses`, derived `scoreboard`, reducer to apply `ConceptDelta`.
  - Extend `conceptSlice` to accept live concept upserts from `quizSlice`.
  - Quiz packs as JSON under `apps/cryptiq-mindmap-demo/public/packs/*.json` (static, cacheable).
- UI (apps/cryptiq-mindmap-demo)
  - Routes: `/` (landing), `/quiz/[slug]` (play), `/result/[id]` (result card), `/api/og` (OG image).
  - Components: `QuizRunner`, `ProgressBar`, `ChoiceGrid`, `ResultCard`, `ShareButtons`.
  - Analytics events: `quiz_start`, `answer_select`, `quiz_complete`, `share_click`.
- Canvas integration (`packages/canvas-r3f`)
  - Expose `ConceptParticles` props to accept live `concepts` from store; size/halo from `weight`.
  - Keep deterministic mapping; update colors via Affinity categories.
  - Maintain current brain material (screenshot mode off in prod).
- Share & SEO
  - Add OG meta tags; generate dynamic OG via Satori/canvas or prebuilt templates.
  - Validate with platform tools in CI/manual checklist.

---

### 12) MVP Scope Checklist

- [ ] Pack 1 (Archetype, 8 types, 8–10 questions) with images and choices.
- [ ] Quiz flow with progress and instant feedback animation on the brain.
- [ ] Live concept generation (weights/categories) and deterministic mapping.
- [ ] Affinity lens + minimal details panel (top 3 “made by” answers).
- [ ] Result card + share; dynamic OG.
- [ ] Desktop perf pass and accessibility pass.

---

### 13) Backlog (post‑MVP)

- Daily prompt/new pack rotation; lightweight notification opt‑ins.
- Temporal lens; simple “related concepts” panel; optional minimal edges when focused.
- Pack builder tooling for fast authoring; translation/localization.

---

### 14) Open Questions

- How many concepts should be visible at rest for best readability on desktop (200 vs 500)?
- Do we time‑gate packs (daily) or let users freely browse sets at launch?
- Do we support result permalink without storing PII (encode scoreboard in URL hash)?

---

### 15) Acceptance Criteria

- End‑to‑end: user completes a pack in ≤60s, sees a result card, shares a link, and the brain reflects their answers in real time.
- Metrics fire for start/answers/complete/share; OG cards render correctly on major platforms.
- Accessibility and performance budgets pass on a standard desktop/laptop device.
