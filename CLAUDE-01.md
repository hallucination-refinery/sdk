# CLAUDE.md — Cryptiq Mindmap (Spec Bake-Off)

> **Purpose**: Treat this file as **authoritative system rules**. Produce a concise, decision-ready **SPEC-[##].md** and phased implementation plan for the **Cryptiq Mindmap** demo. This is an SDK-first, offline, physics-free experience with neurons anchored to a brain surface. (Claude Code reads CLAUDE.md as strict project rules.)

> **Note:** [##] simply means number you increment (i.e SPEC-01.md or CLAUDE-01-scratchpad.md )

## WARNING

1. **Every** tool call, file view, and action is automatically logged and cross-checked against the notes in your scratchpad. _Any_ divergence—whether factual, procedural, or contrary to the spirit of the task—counts as the worst mistake and will trigger an immediate $10 000 fine plus disciplinary action. This outcome is **unacceptable.**
2. **Think carefully** and only action the specific task you were given with the most concise and elegant solution that changes as little code as possible.
3. **Create** a new scratchpad in @docs/cryptiq-mindmap/scratchpads (REQUIRED FORMAT: CLAUDE-[##]-scratchpad.md).
4. **Repo status:** fragmented and brittle with many stray branches; active branch is refactor/context-consolidation-aug17, ~229 commits ahead of main. CI/tests are unreliable and many code paths are stale—treat only this branch’s code as authoritative, and ensure any plan/spec targets this branch without relying on historical docs or other branches compiling.

## Ground Truth (use these; do not invent alternatives)

- **Use Refinery SDK end-to-end**: canvas • store • lens • intent (no ad-hoc render/state paths).
- **Deterministic & physics-free**: neurons are **mapped to brain-surface vertices**; no simulated drift.
- **Lenses in scope**: **Affinity / Temporal / Causal** — **attribute-only** effects (color/brightness/size/pulses), not geometry shuffles.
- **Connectivity:** **Connected (strict)** — allowed calls: (1) `GET /dataset.json` (pre-enriched graph) or (2) `POST /enrich` with `memories[]` → graph; same-origin only, TLS, no third-party services, no analytics/LLM calls, minimal PII, ephemeral processing; all visualization client-side; **no WebGPU**.
- **Immutable input**: `memories[]` schema is fixed:
  - `{ id: string, sentence: string, conceptIds: string[], secret: boolean, date: YYYY-MM-DD, originalCategory: string }`
- **Experience anchors**: glowing wireframe brain canvas; particle “neurons”; optional curved “synapse” edges; minimal HUD; details panel.
- **Demo-specific visuals & components (e.g., brain mesh/shaders/HUD):** live in the app layer and must use SDK contracts; they are not part of the SDK core.

## Where you must exercise judgment (decide, justify, list risks)

- **Node basis**: MVP nodes = **memories** or **derived concepts**; specify exact mapping from `memories[]`.
- **Edge policy**: which edge types (causal/affinity/temporal), **directionality**, default **on/off**, and when to show **pulse** animations.
- **Scale target & fixture**: propose `~N nodes / M edges`; include a tiny **sample JSON** you design against.
- **Interactions**: single vs multi-select, details fields, timeline granularity (day/week/month), filter semantics (include/exclude).
- **Vertex assignment**: strategy when nodes > brain vertices (e.g., vertex reuse with jitter shell, stratified sampling) while preserving silhouette.
- **Accessibility & UI minimalism**: keyboard navigation, reduced motion toggle, minimal HUD that still proves value.

## Acceptance Bars (hold yourself to these)

- **Perf**: ~**1k nodes @ ≥60 fps** pan/zoom; lens switch **≤800 ms**; click→highlight **≤100 ms**; first frame **≤2 s** on mid-range laptop.
- **Determinism**: same input + params ⇒ identical positions/attributes.
- **UX**: 30-second walkthrough to “first insight” without training.

## Required Output (single file)

Create `docs/cryptiq-mindmap/spec-proposals/SPEC-[##].md` (3-5 pages) containing:

1. **Executive Summary** (≤10 lines): user promise, what this proves, top risks.
2. **End-User Experience**: refined 30-sec journey; primary flows; key states (happy/empty/error).
3. **Data Plan**: how you consume/derive from `memories[]`; color map (Affinity), time binning (Temporal), causal signal/trigger; include a small **sample fixture**.
4. **Rendering Plan**: brain-surface mapping algorithm; handling vertex oversubscription; particle attributes; synapse edges (tubes) + pulse rules; FPS fallback if edges are costly.
5. **SDK Integration**: which packages/modules implement canvas, store slices, lens functions, intent handlers; end-to-end event flow.
6. **Milestones (M0–M3)**: outputs and demoable checkpoints.
7. **Perf & QA**: measurement method, budgets, tunable knobs; minimal smoke tests.
8. **Risks & Fallbacks (top 5)**: each with a concrete mitigation.
9. **Assumptions & Open Questions**: every assumption you made; only the minimum blocking questions.

## File Boundaries

- **Safe to read**: SDK packages (@packages), current branch context (@docs/context-consolidation/final-docs), this @CLAUDE.md, PRD/brief materials (@docs/cryptiq-mindmap/cryptiq-mindmap-brief.md)
- **Avoid unless necessary**: legacy/stalled docs; if referenced, treat as _unverified_ and list assumptions.
- **Never**: modify build/CI, delete files, or introduce WebGPU/network dependencies in the plan.

## Workflow (follow in order)

1. Restate **context, task, constraints & acceptance bars** in your scratchpad.
2. Make the required **judgment calls** above; justify clearly; list risks.
3. Draft **SPEC-[##].md** per the Required Output.
4. End with a detailed step by step **implementation plan & checklist** for M0 (brain canvas + minimal HUD + tiny fixture), then M1–M3.
