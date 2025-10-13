# Meta Workflow — Automation‑First Operational Plan

## Critique of Manual‑Heavy Approach (brief‑anchored)
- **Boundary violations → distrust**: Edits despite “No edits” gate [A1] created rework and anxiety.
- **Tooling thrash → lost days**: Node/corepack/pnpm churn and rebuild loops blocked validation [A2/T1].
- **Param‑gated defaults → surprise**: Framing hidden behind `?controls=1` caused mismatch to vision [A5/T3].
- **Assumptions before tracing → misdiagnosis**: Reading `ink‑latency` without code source led to time loss [A4/T4].
- **Scope whiplash**: Aesthetics vs core interaction tug‑of‑war delayed “particles are ink” [A3].
- **Manual capture fatigue**: Repeating DevTools, console copy, screenshots, uniform dumps across runs is the primary pain [P2].
- **Audit/rebuild latency**: Deterministic builds help [P3], but manual evidence steps dominate wall‑clock.

## Existing Automation Infrastructure (discovered via grep/read)
- **Playwright config**: `playwright.config.ts` (single worker, headless, auto webServer if BASE_URL unset).
- **Smoke specs**:
  - `tests/brain.smoke.spec.ts`: ready gate + baseline screenshot + console error gate.
  - `tests/mindmap.smoke.spec.ts`: canvas presence + baseline screenshot gate.
  - `tests/draw3d.smoke.spec.ts` and `apps/cryptiq-mindmap-demo/tests/draw3d.smoke.spec.ts`: boot/HUD checks.
- **Scripts**:
  - `scripts/smoke.sh`: brain‑oriented runner using `.clmem` state; stamps screenshot.
  - `scripts/smoke-test.js` (Puppeteer): starts server (optional), builds URL, captures screenshot and console JSONL into `docs/.../assets`, writes JSON summary.
  - `scripts/ensure-playwright.sh`, `scripts/watch-smoke.cjs` (watch‑dog), `scripts/diagnose.sh` (legacy demo diagnostics).
- **Gap for scene‑03 ink validation**:
  - No spec drives `/quiz/archetype-v1?pc=scene-03&debug=1` interactions.
  - No automated tap/drag, `ink‑latency` timing capture, uniform dumps, mid‑stroke screenshot, or gate assertions for the acceptance criteria.

## Automation Proposal (concrete, low‑risk)
- **Exact files to adapt**:
  - Add new spec (no app edits): `tests/ink-interaction.spec.ts`.
  - Optional: extend `scripts/smoke-test.js` with `mode: 'ink'` to emit the same evidence bundle for manual/CI runs.
- **Spec behavior**:
  - Navigate: `/quiz/archetype-v1?pc=scene-03&debug=1&cinematic=1`.
  - Hook console: collect all logs; persist `docs/.../assets/YYYY-MM-DD-ink-console.jsonl`.
  - Dump uniforms if available: `page.evaluate(() => window?.dreamdust?.dumpUniforms?.())`; persist to `evidence.json`.
  - Simulate input:
    - Tap: center of `canvas` → `mouse.click(x, y)`; capture screenshot at t+100ms → `YYYY-MM-DD-ink-tap.png`.
    - Drag: `mouse.down` → move +180px over 250ms → mid‑stroke screenshot → `YYYY-MM-DD-ink-stroke.png` → `mouse.up`.
  - Gate assertions (vision‑anchored):
    - **≤2 frames immediate motion**: parse latest `[dreamdust] ink-latency { frames/ms }`; assert `frames ≤ 2` or `ms ≤ 33`.
    - **10–20% footprint (localized)**: before/after tap screenshots diff; assert non‑zero and `maxDiffPixelRatio ≤ 0.20` (coarse proxy to start).
    - **Screen‑space consistency**: during micro‑drag (20px), pointer‑linked log updates or follow‑up `ink‑latency` within drag window.
    - **Smooth decay**: after `mouse.up`, wait 1s; ensure no new high‑amplitude logs and visual diff stabilizes vs mid‑stroke.
    - **Fixed camera / zero overlays**: assert overlay selectors absent and FOV stable via `page.evaluate`.
- **Outputs**:
  - `PASS/FAIL` summary to stdout, plus: `evidence.json` (console/uniforms/timings), `ink-tap.png`, `ink-stroke.png`, and `ink-console.jsonl` in `docs/.../assets/`.
- **Rollback**:
  - Remove/skip a single new spec; existing tests and app code remain untouched.

## The Hybrid Loop (≤20 min per iteration; ≤5 min user time)
1) **LLM proposes change** (vision‑anchored): “Increase force scale 180→220 so plume is undeniable within ≤2 frames at defaults — closer to ‘tap ripple’.”
2) **User authorizes** (binary): “EXECUTE: OK” or “REJECT: <reason>”.
3) **LLM edits code** (if authorized): one edit; commit ties to vision gate.
4) **LLM runs automation**: rebuild (once), start server, run spec, capture console/uniforms/screenshots, verify gates.
5) **LLM reports** (≤100 words): “PASS: ≤2‑frame plume; 12% footprint; smooth decay; camera fixed” OR “FAIL: footprint 35% (>20%) — recommend revert.”
6) **User decides next** (binary): “APPROVED” (lock and pick next variable) or “REVERT” (auto‑rollback, propose Option B).

## Human‑Only Prompts (copy‑pasteable)
- **Authorization**
```
EXECUTE: <OK or REJECT + reason>
```
- **Decision**
```
<APPROVED or REVERT>. Creative feedback: <optional 1 sentence on feel>.
```

## Guardrails & Stop Rules
- 20‑minute timebox per iteration; loop stops on timer.
- One variable per iteration; for non‑binary, LLM presents two options (A/B) and waits.
- No environment churn: single rebuild; reuse server unless hard failure.
- User never opens DevTools; automation captures all evidence.
- Any gate fails → declare FAIL; user replies APPROVED or REVERT (no mid‑run retuning).
- Acknowledge past burns: adapt existing Playwright/Puppeteer; manual fallback URL always available.

## Collaboration Contract (User ↔ LLM)
- **Roles**: LLM owns roadmap, code changes, automation, quality verification [[memory:2235411]]; User owns creative vision, binary approvals, feel feedback.
- **Vision‑first**: Every edit must state how it moves toward “particles are ink” (tap ripple, drag advection, palette cascade) and why.
- **Automation‑first**: Rebuild, run, console capture, screenshots, gate checks are automated with existing tools; human time is approvals only.
- **Evidence exchange**: LLM provides PASS/FAIL + one screenshot + key uniforms; User replies APPROVED/REVERT + optional one‑sentence feel.
- **Either/or**: At most two options per choice; no branching plans.

## Next Concrete Action (what to do immediately after reading this plan)
- **LLM**: implement `tests/ink-interaction.spec.ts` to drive scene‑03, collect console/uniforms, simulate tap/drag, save artifacts, and assert the gates above.
- **User**: review and authorize with `BUILD AUTOMATION: OK` or `SKIP AUTOMATION: proceed manual.`
- **Estimated user time**: <5 minutes to review and authorize.
