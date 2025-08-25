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

- Branded landing (Cryptiq Mindmap · Cryptiq × Refinery), then a particle intro: scattered points assemble into the brain silhouette, orbs glow on settle (reduced‑motion fallback).
- Bottom‑right HUD slides in: “Import your Cryptiq memories (Coming soon)” or “Start” a fast 10‑question run.
- 10 rapid questions (images/choices/sliders) feed an analysis bar to 100%; each answer live‑updates concepts (size/halo; category color) on the brain.
- Composite result: up to 3–5 archetypes (not a single label) with 2–3 lines of insight and share; replay loop to try another pack.

---

### 4) IA & User Flows

- Landing → branded hero → particle intro → HUD (Import Coming Soon / Start) → 10‑question quiz → composite result card → share → try another.
- Result page: headline + composite archetype stack, short insight, top concept/category chips, share buttons, “play again.”
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
  - `resultMapping`: rules to compute composite archetypes (sum/normalize tag weights; top 3–5 with thresholds).
  - `archetypes[]`: `{ key, label, group: 'Passion'|'Morals'|'Methods'|'Judgment'|'Daring', description }` (inspired by Refind Self groupings).
- Mapping to visualization
  - Deterministic vertex assignment uses `id` hashing; weights modulate size/halo (no position changes).
  - Maintain silhouette with a decorative ambient particle layer (non‑interactive) to avoid “sparse” look.

#### Intro animation & reduced‑motion

- Sequence: scatter field → converge to brain silhouette (1–2s) → subtle glow pulse on orbs (0.5s); then unlock HUD.
- Respect `prefers-reduced-motion`: skip scatter/converge; fade‑in brain and show HUD immediately.

---

### 6) Lenses and Interaction (MVP)

- Affinity lens (ship): category→color (≥7 distinct hues; overflow to gray).
- Temporal lens (optional behind flag): recency→brightness using `firstSeen/lastSeen` from the session.
- Causal lens (defer): no edges in MVP; on selection we may show a basic related‑concepts list instead of lines.
- Interaction: hover tooltip (label, category, weight), click opens a compact details panel with “made by: answer chips”.

---

### 7) Result and Sharing

- Result card: composite profile (top 3–5 archetypes with short lines), 2–3 line summary, top 3 concept chips, CTA (try another / copy link).
- OG/Twitter cards: 1200×630 static image with title + brand; dynamic OG endpoint for result URLs.
- Social validators in CI: Facebook Sharing Debugger, Twitter Card Validator.
- Optional (flagged): comparison link accepts a friend’s result ID and displays side‑by‑side archetype stacks.

---

### 8) Accessibility & Performance

- Accessibility: WCAG 2.2 AA; alt text for images; focus styles; semantic buttons; keyboard navigation; color contrast checked.
- Performance: Core Web Vitals targets — LCP ≤ 2.5s, INP ≤ 200ms, CLS < 0.1.
- Delivery: critical JS/CSS ≤ 100KB; preconnect fonts; lazy‑load non‑critical media; preload quiz pack JSON; reduced‑motion path avoids animation cost.

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
- Intro animation jank → Gate with reduced‑motion; cap particles; allow skip after 1.5s.

---

### 11) Implementation Plan (repo mapping)

- Data & state
  - Add `quizSlice` to `packages/store`: holds `pack`, `responses`, derived `scoreboard`, reducer to apply `ConceptDelta`.
  - Extend `conceptSlice` to accept live concept upserts from `quizSlice`.
  - Quiz packs as JSON under `apps/cryptiq-mindmap-demo/public/packs/*.json` (static, cacheable).
- UI (apps/cryptiq-mindmap-demo)
  - Routes: `/` (landing + intro), `/quiz/[slug]` (play), `/result/[id]` (result card), `/compare` (flagged), `/api/og` (OG image).
  - Components: `BrandHeader`, `IntroParticles`, `HUDPrompt` (Import Coming Soon / Start), `QuizRunner`, `AnalysisBar`, `ChoiceGrid`, `ResultComposite`, `ShareButtons`, `ComparePanel` (flagged).
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
- [ ] Quiz flow with analysis bar to 100% and instant feedback animation on the brain.
- [ ] Live concept generation (weights/categories) and deterministic mapping.
- [ ] Affinity lens + minimal details panel (top 3 “made by” answers).
- [ ] Composite result card (top 3–5 archetypes) + share; dynamic OG.
- [ ] Desktop perf pass and accessibility pass.
- [ ] Particle intro with reduced‑motion fallback; HUD prompt (Import Coming Soon / Start).

---

### 13) Backlog (post‑MVP)

- Daily prompt/new pack rotation; lightweight notification opt‑ins.
- Temporal lens; simple “related concepts” panel; optional minimal edges when focused.
- Pack builder tooling for fast authoring; translation/localization.
- Compare mode (friend code/ID), per‑archetype explainers, replay insights (“what changed this run”).

---

### 14) Open Questions

- How many concepts should be visible at rest for best readability on desktop (200 vs 500)?
- Do we time‑gate packs (daily) or let users freely browse sets at launch?
- Do we support result permalink without storing PII (encode scoreboard in URL hash)?
- Composite size: cap at top 3 vs top 5 archetypes for clarity?
- Should we allow “Import memories” placeholder to collect email for notification (compliant opt‑in)?

---

### 15) Acceptance Criteria

- End‑to‑end: user completes a pack in ≤60s, sees a result card, shares a link, and the brain reflects their answers in real time.
- Metrics fire for start/answers/complete/share; OG cards render correctly on major platforms.
- Accessibility and performance budgets pass on a standard desktop/laptop device.
- Intro animation respects reduced‑motion and completes or can be skipped within 2s before HUD appears.
