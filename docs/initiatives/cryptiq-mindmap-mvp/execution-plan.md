# Cryptiq Mindmap — 24‑Hour Ship Brief

---

## 1) UPDATED PRD (incorporates Refind‑Self inspo, pre‑seeded mind, archetype radar, hover‑only edges)

### 0) Context Snapshot (frozen for MVP)

- **3D Brain**: Translucent shell + glowing orbs; deterministic concept→vertex mapping; ambient particles for silhouette.
- **Codebase**: R3F scene stable; routes exist; analysis bar; result view; basic OG endpoint placeholder.
- **Constraint**: Desktop‑first MVP; ship in 24h; entertainment‑only (no clinical claims).

### 1) Vision & Audience

- **Vision**: A 35–60s, “play‑as‑personality‑test” micro‑experience that lights up a **pre‑seeded mind** and yields a **shareable composite profile**.
- **Audience**: 16–34, socials‑native, desktop web (result page readable on mobile for shared links).

### 2) Golden Path (Single Run)

Landing → (≤1s skip‑able) intro → **Start** → **8–10 rapid questions** (images/choices; keyboardable) → **live brain updates + left “Archetype Meter”** after each answer → **Result** (top‑3 archetypes + radar + top concepts) → **Share** → “Play again”.

### 3) UI Layout (HUD + Meters)

- **Bottom‑Right HUD Panel**: Start / Question prompt / Progress / Result (composite copy + Share).
- **Lower‑Left Archetype Meter**: 6–10 bars (one per archetype) with tiny character avatar; animates +“ding” on change.
- **Top‑Center Micro‑HUD (optional)**: small helper text (“Hover highlighted nodes to reveal links”).

### 4) Mechanics & Data Model (Pre‑Seeded Mind + Radar)

- **Pre‑Seeded Concepts (300–500)**:  
  `Concept { key, label, category(≤8), vector{archetype->weight}, neighbors[string[3..8]] }`
- **Archetypes (6–10)**: label, short description, emoji/avatar ref, color token (for meter/radar—**not** node color).
- **Activation**: User radar `u` (normalized) from quiz; per‑concept activation `a = dot(u, v)` in [0..1].
- **Visualization**: Color = `category` palette (≤8 WCAG‑checked hues). Size/halo = activation. Render **top ~300** activations (cap 500).
- **Deterministic Placement**: `hash(packId:conceptKey) → vertexIndex` (stable across sessions/links).
- **Archetype Radar**: Polar chart on Result; bar meter at run‑time (left HUD).

### 5) Edges (Hover‑Only, Affinity Lens)

- **When**: On hover (or focus via keyboard) of a visible concept.
- **What**: Show up to **K=8** curved edges to pre‑computed `neighbors` that are also active.  
  `score_e(i,j) = cosine(v_i, v_j) * min(a_i, a_j) * prox(i,j)`; render if `score_e > τ` (e.g., 0.35).
- **Why‑Edges** (optional): faint spokes to top‑1 archetype anchor for explanation (`v[k]*u[k]` highest).
- **Motion**: Respect `prefers-reduced-motion` → fade only; no pulses.

### 6) Content (Pack) Shape

```json
{
  "id": "archetype-v1", "packVersion": 1,
  "title": "Archetypes",
  "archetypes": ["Explorer","Planner","Connector","Analyst","Guardian","Creator","Maverick","Sage"],
  "categories": ["Values","Traits","Emotions","Methods","Goals","Contexts","Social","Energy"],
  "questions": [ /* 8–10 items: choice | image-choice */ ],
  "concepts": [ /* 300–500 Concept as above */ ],
  "resultMapping": { "topKDefault": 3, "expandIfDeltaBelow": 0.02, "dominanceDelta": 0.08 }
}

7) Result & Sharing
	•	Composite Result: top‑3 archetypes (expand to 5 if clustered), 2–3‑line summary, “made‑by” chips per top concept (largest v[k]*u[k] contributors), radar chart, top 3 concept chips.
	•	Shareable Link: Minimal server result blob keyed by short signed ID (ULID/base62), TTL 30d, no PII.
ResultBlob { id, packId, packVersion, radar, topArchetypes[], topConcepts[], createdAt }
	•	OG/Twitter: /r/:id server‑renders OG image (title + avatars + radar); static fallback on error.

8) Accessibility & Performance
	•	A11y: WCAG 2.2 AA; keyboardable choices; visible focus; ARIA labels; alt text; high‑contrast toggle for node colors.
	•	Perf: Landing critical JS/CSS ≤100KB; lazy‑load 3D on quiz route; ≤500 active instances; LCP ≤2.5s, INP ≤200ms, CLS <0.1.

9) Analytics (actionable)
	•	Events: quiz_start (first answer), answer_select{qid,option}, quiz_complete{dur_ms}, share_click{type}, hover_edge{count}.
	•	Context: packId, packVersion, reduced_motion, device hints.

10) Non‑Goals (MVP)
	•	No clinical claims, no DOB/time, no import memories, no compare mode, no temporal/causal global edges, no sliders if they risk a11y.

11) Risks & Guards
	•	OG without server → solved by minimal result store (signed IDs).
	•	Color confusion → cap to 8 categories + palette audit + high‑contrast toggle.
	•	Mushy results → dominance rules + “balanced blend” copy variant.
	•	Perf spikes → cap instances, edge pool size, lazy shaders.

12) Acceptance Criteria
	•	Complete run ≤60s; brain updates live on each answer; left meter “dings” and animates.
	•	Hovering a node reveals ≤8 readable edges; reduced‑motion path fades only.
	•	Share URL renders correct OG card; result reads on mobile.
	•	A11y and Core Web Vitals targets pass on a reference laptop.

⸻

2) WHERE WE STAND (objective reflection)

Done / Solid
	•	Deterministic concept→vertex mapping; ambient particles; reduced‑motion in particles; routes for / → /quiz/[slug] → /result/[id]; analysis bar to 100%; Affinity color lens exists; basic OG endpoint placeholder.

Partial
	•	Live “answer → ConceptDelta → weight/halo update” loop (verify end‑to‑end).
	•	Result composition (needs concise copy, radar chart, “made‑by” chips).
	•	A11y scaffolding (needs full keyboarding/focus/alt/contrast audit).
	•	Analytics stubs (need real events + provider).
	•	Edges (API exists; hover‑only edges + pool not yet wired).
	•	Visual defaults (gel shell params; hide dev overlays; intro skip).

Missing (for MVP)
	•	Pre‑seeded Pack v1: 300–500 concepts with vectors + neighbors; 8–10 Q with images and option effects.
	•	Archetype Meter (left bar chart) with avatars and per‑answer animation.
	•	Hover‑Edges implementation (pool, scoring, bezier curves, reduced‑motion handling).
	•	Minimal result store + /r/:id OG rendering that includes radar + avatars.
	•	Copy & share art: concise result lines; OG template; avatar/mood sprites.
	•	A11y/perf audits + fixes; analytics wiring; privacy copy + reset/delete.

⸻

3) STEP‑BY‑STEP PLAN TO LAUNCH (24‑hour execution map)

Assumption: solo builder, existing repo w/ Next.js + R3F. Work in three tracks that converge: Content, UI/UX, Platform. Keep scope brutal. Treat unchecked items as cut.

T‑24h → T‑16h (Foundation & Content)
	1.	Freeze defaults & strip dev UI
	•	Set gel shell material params in prod config; hide debug overlays/orbit controls; ensure intro skip at ≤1s; honor reduced‑motion globally.
	2.	Pack v1 authoring (fast)
	•	Archetypes (8): finalize labels, 1‑line descriptions, color tokens, 32×32 avatar placeholders (AI‑gen ok).
	•	Questions (8–10): image/choice only; each option maps to 1–2 archetypes (simple weights).
	•	Concepts (≈400): start from seed list; assign category and vector (primary 0.6–0.8; secondary 0.1–0.3).
	•	Neighbors: precompute 3–5 cosine nearest for each concept (cap within same/adjacent categories).
	•	Save to /public/packs/archetype-v1.json (with packVersion:1).
	3.	Anchors JSON (determinism)
	•	Export/commit brain-anchors-500.json; keep worker fallback only for dev.
	4.	Copy & assets
	•	Result copy variants: dominant vs balanced blend; 2–3 lines total.
	•	OG template: 1200×630; title, 3 avatars, radar, brand lockup.
	•	Sound: tiny “ding” for meter (muted by default per autoplay policies; enable on first interaction).

T‑16h → T‑8h (UI/UX & Mechanics)
	5.	Left Archetype Meter
	•	Component ArchetypeMeter: bars + avatars; animate on each answer; announce change via ARIA live region (polite).
	6.	Answer → Activation Loop
	•	Normalize u; compute a=dot(u,v); update particles (size/halo). Limit active render to top 300.
	7.	Hover‑Only Edges
	•	Implement pooled bezier lines (max=16).
	•	Scoring score_e = cosine * min(a_i,a_j) * prox; threshold τ=0.35; sort by score; fade in/out; depthTest on.
	•	Optional “why‑spoke” to top‑1 archetype anchor (single faint line).
	8.	Result Page
	•	Radar chart (SVG/canvas; no heavy libs), top‑3 archetypes (expand to 5 if Δ≤0.02), top concepts (chips) with “made‑by” contributors.
	•	“Copy link” + “Share” buttons; mobile‑readable layout (no 3D).

T‑8h → T‑2h (Platform, A11y/Perf, Share)
	9.	Minimal Result Store & OG
	•	API: POST /api/result → {id}; GET /api/result/:id; GET /r/:id SSR page + OG meta.
	•	Blob: { id, packId, packVersion, radar, topArchetypes, topConcepts, createdAt }, signed, TTL 30d, delete endpoint.
	•	OG render (Satori/canvas or node-canvas) → cache by id; static fallback if render fails.
	10.	Analytics & Privacy

	•	Wire events to provider; include packId, packVersion, duration_ms, reduced_motion.
	•	Add consent toggle for local/session save; Reset/Delete; brief privacy note link.

	11.	A11y & Perf audit (quick)

	•	Keyboard‑only run; focus rings; ARIA/alt; high‑contrast toggle.
	•	Core Web Vitals smoke: LCP/INP/CLS on reference laptop; lazy‑load 3D on quiz; preconnect fonts; prefetch pack JSON.

	12.	Edge Cases / Errors

	•	Pack load failure → friendly retry; missing OG → static fallback; no WebGL → show Result‑only explainer.

T‑2h → T‑0h (QA & Ship)
	13.	Share Validation

	•	/r/:id renders with correct OG in validators; link unfurls in Slack/Twitter/X; mobile view readable.

	14.	Runbook & Smoke Tests

	•	Three golden‑path runs (dominant, balanced, extreme).
	•	Hover dense area → ≤8 edges; reduced‑motion checked; meter dings; copy variants correct.

	15.	Deploy & Post‑Launch Checks

	•	Deploy; hit validators; verify analytics live; monitor error logs.
	•	Prepare quick announcement copy + screenshot/GIF.

⸻

CUT LIST (if time slips)
	•	Drop “why‑spokes” (keep only neighbor edges).
	•	Reduce concepts to ~300 (still fine).
	•	Skip sound effect.
	•	OG fallback only (static template), store still required.
	•	Result copy single‑variant (no balanced/ dominant split).

⸻

QUICK CHECKLIST (paste into issue tracker)
	•	Pack v1 JSON (archetypes, questions, concepts+vectors+neighbors).
	•	Anchors JSON committed; prod uses static anchors.
	•	ArchetypeMeter (left) animates per answer.
	•	Activation loop updates node size/halo; cap top 300.
	•	Hover‑only edges (pool, scoring, fade, τ=0.35).
	•	Result page (radar, top‑3, chips, copy).
	•	Minimal result store + /r/:id OG image.
	•	A11y/perf pass; analytics wired; privacy/reset.
	•	Share validation passes; mobile result readable.
	•	Dev flags removed; deploy + smoke tests.

⸻
```
