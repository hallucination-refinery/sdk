---
name: dreamdust-telemetry
description: End-to-end Dreamdust telemetry debugging loop (plan → run → analyse → iterate)
args:
  - branch # optional branch checkout before starting; defaults to current HEAD
  - target_gate # optional gate to satisfy (buffers|samples|visibility|reactivity|aesthetic); default buffers
  - wait_ms # optional settle delay override for smoke-test (default 30000)
  - url_params # optional extra query params appended to the base suite
---

**Mission**
Run a full Dreamdust telemetry iteration with zero manual intervention. Claude must handle planning, code/document updates, telemetry capture, analysis, and repeat the loop until the requested gate is satisfied or a blocker is documented with evidence.

**High-Level Phases (repeat as needed)**

1. **Prep & Baseline**
   - `git fetch` and optionally `git checkout <branch>` if provided; ensure `git pull --ff-only`.
   - Verify clean tree (`git status --short`); if dirty, abort and report.
   - Export Chrome path: `export PUPPETEER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"` (customise if host differs).
   - Identify current blockers from the latest dated section in `2025-09-24-dreamdust-ink-mask-brief.md`.
2. **Plan Diagnostics/Fixes**
   - Summarise current gate status using `/tmp/dd-telemetry.json` from last run (if present) or the latest documentation entry.
   - Decide next diagnostic or code edit to unblock the target gate; record intent in the command’s output before executing (includes expected signals and fallback plan).
3. **Execute Changes**
   - Apply code edits (e.g., shader tweaks, logging) using `Edit`/`MultiEdit`; run targeted commands (`pnpm lint`, `pnpm test`, etc.) if modifications warrant it.
   - Update documentation templates if new procedures are introduced (e.g., add checklist to `telemetry-guide.md`).
   - `git status` and `git diff` after edits to verify scope; do not leave unrelated files touched.
4. **Telemetry Capture**
   - Build prod bundle: `pnpm --filter cryptiq-mindmap-demo run build`.
   - Start prod server in background on port 3000: `PORT=3000 pnpm --filter cryptiq-mindmap-demo run start > /tmp/dd-prod.log 2>&1 & echo $! > /tmp/dd-prod.pid`.
   - Wait for readiness: `until curl -fsS "http://127.0.0.1:3000/debug/caps" >/dev/null; do sleep 2; done` (abort after 60s with log excerpt).
   - Run harness:

   ```bash
   node scripts/smoke-test.js \
     --autoDev=false \
     --baseUrl "http://127.0.0.1:3000" \
     --path "quiz/archetype-v1" \
     --urlParams "pc=scene-02&debug=1&engine=sim&inkProbe=1&simProbe=1&simStats=1&inkStats=1&forceAlpha=1&vertexLog=1${url_params:+&${url_params}}" \
     --waitMs ${wait_ms:-30000} \
     --out docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs \
     --mode telemetry | tee /tmp/dd-telemetry.json
   ```

   - Stop server: `kill $(cat /tmp/dd-prod.pid) || true`.

5. **Analyse & Document**
   - Parse `/tmp/dd-telemetry.json`; capture key fields (status, gates, notes, capture availability) into the run summary.
   - Inspect generated artifacts under `docs/initiatives/.../assets/`; ensure PNG + JSONL + vertex log exist with today’s date.
   - Update documentation:
     - Append a dated section to `2025-09-24-dreamdust-ink-mask-brief.md` describing visuals, telemetry findings, gate booleans, and next actions.
     - Update `2025-09-24-test-protocol.md` automation notes (settle time, params, manual tweaks).
     - If new raw dumps/log templates needed, create them (e.g., `YYYY-MM-DD-vertex-log-raw.md`).
   - If blockers remain, explicitly state them with log excerpts and reference file paths.
6. **Commit & Report**
   - Stage relevant changes: `git add docs/... scripts/... apps/...` (only files touched this iteration).
   - Commit with clear message, e.g., `debug(telemetry): <YYYY-MM-DD> iteration — <short focus>`.
   - Run `git status --short` to confirm cleanliness after commit.
   - Produce a structured summary including:
     - Gate targeted vs. achieved
     - Key telemetry metrics (non-zero buffers/samples, etc.)
     - Artifacts paths and doc sections updated
     - Recommended next iteration (or declare success if gate met)

**Looping Rules**

- After reporting, evaluate whether the requested `target_gate` is satisfied:
  - `buffers` ⇒ `summary.gates.buffersNonZero === true`
  - `samples` ⇒ `summary.gates.samplesNonZero === true`
  - `visibility` ⇒ non-black screenshot + documented observation
  - `reactivity` ⇒ tap/stroke evidence in logs + docs
  - `aesthetic` ⇒ reference alignment with documented metrics (per brief)
- If satisfied, stop and mark success.
- If not satisfied, repeat Phases 2–6 with a new hypothesis. Abort only if a hard blocker is reached (e.g., build fails) and document the reason with log snippets.

**Guardrails**

- Do not leave background processes running (always kill prod server).
- Keep commits minimal (one per iteration) and push after final success or documented blocker.
- Never overwrite existing dated documentation sections; append chronologically.
- If any command fails, surface stderr, explain remediation attempt, and decide whether to retry or stop.

**Output Format**
At the end of the command execution, print:

```
Status: success|blocked
Target gate: <gate>
Result summary: <concise outcome>
Artifacts: <relative paths>
Docs updated: <files + sections>
Next step: <specific action or declare “none – goal met”>
```

Execute this loop autonomously; do not prompt the user unless explicit manual input is required (e.g., missing credentials).
