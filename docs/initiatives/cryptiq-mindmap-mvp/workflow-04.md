# Workflow 04: Cryptiq Mindmap MVP — Post‑Run Audit & Verification (with Minimal Corrections)

Created: 2025‑08‑22
Scope: Audit, verify, and only if required, correct the previous orchestrated run.
Target Run: 20250822152645-cryptiq-mindmap-mvp-ALL ("W03 final run")
Constraints: Read‑only bias; prefer verification over regeneration; no snapshot updates; only apply narrow, reversible edits if a gate fails. All checks are browser‑gated where applicable.

---

## Section A — Audit Objectives (what we must prove)

1. Artifacts from the target run are complete, consistent, and tamper‑free.
2. Browser‑derived acceptance is reproducible today (deterministic enough) without relaxing gates.
3. Visual baseline remains within the specified threshold without auto‑updating snapshots.
4. Core guarantees from Workflow‑03 still hold: SSR guards, mesh range, deterministic mapping, lens attribute‑only, edges OFF by default, performance ≤ 2000ms first frame, vendor isolation.
5. If any gate fails, apply the smallest possible corrective change, re‑verify only the affected sessions, and record the delta.

---

## Section B — Preconditions & Environment

- Node ≥20, pnpm ≥9; devcontainer shell at `/workspace`.
- Set environment for Playwright cache:
  - `PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright-browsers`
  - Symlink once: `/home/node/.cache/ms-playwright -> /workspace/.playwright-browsers`
  - `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1`
- Define the audited run ID for all sessions:
  - `BASE_RUN_ID=20250822152645-cryptiq-mindmap-mvp-ALL`
  - `BASE_RUN_DIR=.clmem/runs/${BASE_RUN_ID}`
- Ports: do not change the audited run’s port; start a fresh dev server only when a gate requires live browser interaction. Always stop old servers first.
- Visual baseline (guidance only, not pixel authority): `docs/initiatives/cryptiq-mindmap-mvp/misc/reference-image.jpeg`.

---

## Section C — Mechanics & Scaffolding (Claude Code)

- Sub‑agents: `plan-agent` (sessions+DAG), `validate-agent` (lint→test→build→smoke), `meta-agent` (Trust Index recompute), `coverage-audit-agent` (optional), `audit-agent` (this workflow driver).
- Hooks:
  - Pre‑execution Playwright preflight (reuse from W03).
  - Post‑session artifact collector → under `${BASE_RUN_DIR}/audit/`.
  - Never pass `--update-snapshots` during audit; fail loudly on diffs.
- Recommended scripts (reuse from W03 when available):
  - `scripts/ensure-playwright.sh`
  - `scripts/server.sh` (start|stop|status; writes `state.json`)
  - `scripts/smoke.sh` (reads `BASE_URL`, runs Playwright smoke)
  - `scripts/stamp-artifact.sh`
  - `scripts/obj-vertex-count.mjs`, `scripts/w03-summarize.mjs`
- Artifact normalization (audit): `${BASE_RUN_DIR}/audit/` must contain inventory, recomputed metrics, diff results, and final `audit-results.json`.

---

## Section D — Sessions (Detailed, gated, reproducible)

Each session includes: Goal • Edits/Targets (only if needed) • Commands • Gates • Artifacts • Commit. All commands run at repo root unless noted. Do not update baselines unless a corrective session explicitly calls for it.

### Session 0 — Audit Bootstrap & Context Lock (5–10m)

- Goal: lock context to the target run; prepare audit directory; capture summary.
- Commands:
  ```
  export BASE_RUN_ID=20250822152645-cryptiq-mindmap-mvp-ALL
  export BASE_RUN_DIR=.clmem/runs/${BASE_RUN_ID}
  test -d "$BASE_RUN_DIR" && mkdir -p "$BASE_RUN_DIR/audit"
  jq -n --arg id "$BASE_RUN_ID" '{ auditedRunId: $id, startedAtUtc: (now|todate) }' > "$BASE_RUN_DIR/audit/audit-bootstrap.json"
  ```
- Gates: `${BASE_RUN_DIR}` exists; `acceptance.md` and `results.json` present; `artifacts/` exists.
- Artifacts: `audit-bootstrap.json`
- Commit: `workflow-04(session-0): audit bootstrap & context lock [ok]`

### Session 1 — Artifact Inventory & Integrity (10–15m)

- Goal: enumerate files, sizes, and checksums; compare with W03 claims (26 artifacts; baseline 69KB).
- Commands:
  ```
  node -e "const fs=require('fs'),cp=require('child_process');const d=process.env.BASE_RUN_DIR+'/artifacts';
  const walk=p=>fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(p+'/'+e.name):[p+'/'+e.name]);
  const files=walk(d); const meta=files.map(f=>({path:f,size:fs.statSync(f).size,sha256:cp.execSync('sha256sum '+f).toString().split(' ')[0]}));
  fs.writeFileSync(process.env.BASE_RUN_DIR+'/audit/artifact-inventory.json',JSON.stringify({count:files.length,files:meta},null,2));"
  ```
- Gates: inventory `count` ≥ 26; file `smoke` image ≈ 69KB (±10%).
- Artifacts: `artifact-inventory.json`
- Commit: `workflow-04(session-1): artifact inventory & integrity [ok]`

### Session 2 — Trust Index Recompute Cross‑Check (5–10m)

- Goal: recompute Trust Index from acceptance + server log and compare to `results.json`.
- Commands:
  ```
  node scripts/w03-summarize.mjs > "$BASE_RUN_DIR/audit/recomputed-results.json"
  jq -n \
    --slurpfile a "$BASE_RUN_DIR/results.json" \
    --slurpfile b "$BASE_RUN_DIR/audit/recomputed-results.json" \
    '{original: $a[0].trustIndex, recomputed: $b[0].trustIndex, delta: ($b[0].trustIndex - $a[0].trustIndex)}' \
    > "$BASE_RUN_DIR/audit/trustindex-diff.json"
  ```
- Gates: `delta == 0` and `trustIndex ≥ 80`.
- Artifacts: `recomputed-results.json`, `trustindex-diff.json`
- Commit: `workflow-04(session-2): trust index recompute cross-check [ok]`

### Session 3 — Acceptance JSON Audit (5–10m)

- Goal: verify browser‑derived fields meet W03 thresholds.
- Commands:
  ```
  ACCEPT_JSON=$(ls "$BASE_RUN_DIR"/artifacts/w03/acceptance/brain-acceptance.json 2>/dev/null || true)
  test -n "$ACCEPT_JSON" && jq '{
    meshLoaded, vertexCount, firstFrameMs, particles, interactionsBound
  }' "$ACCEPT_JSON" | tee "$BASE_RUN_DIR/audit/acceptance-audit.json"
  ```
- Gates: `meshLoaded==true`; `35000 ≤ vertexCount ≤ 50000`; `firstFrameMs ≤ 2000`; `200 ≤ particles ≤ 500`; `interactionsBound==true`.
- Artifacts: `acceptance-audit.json`
- Commit: `workflow-04(session-3): acceptance json audit [ok]`

### Session 4 — Server Log Sanity (5–10m)

- Goal: ensure clean logs post‑navigation (no errors).
- Commands:
  ```
  LOG="$BASE_RUN_DIR/artifacts/w03/server.log"; \
  (grep -iE "error|fatal|uncaught" "$LOG" || true) | tee "$BASE_RUN_DIR/audit/server-errors.txt"
  ```
- Gates: `server-errors.txt` empty (allow known benign warnings if documented).
- Artifacts: `server-errors.txt`
- Commit: `workflow-04(session-4): server log audit [ok]`

### Session 5 — Mesh Asset Cross‑Verification (5–10m)

- Goal: confirm OBJ vertex count matches recorded value.
- Commands:
  ```
  REC=$(awk '{print $1}' "$BASE_RUN_DIR/artifacts/w03/vertex-count.txt" 2>/dev/null || echo 0)
  ACT=$(node scripts/obj-vertex-count.mjs apps/cryptiq-mindmap-demo/public/models/brain.obj)
  jq -n --arg rec "$REC" --arg act "$ACT" '{ recorded: ($rec|tonumber), actual: ($act|tonumber), delta: ((($act|tonumber)-($rec|tonumber))) }' \
    > "$BASE_RUN_DIR/audit/vertexcount-diff.json"
  ```
- Gates: `abs(delta) ≤ 200` (tolerance for tool differences) and actual in `[35000, 50000]`.
- Artifacts: `vertexcount-diff.json`
- Commit: `workflow-04(session-5): mesh asset cross-check [ok]`

### Session 6 — Deterministic Mapping Re‑Run (10–15m)

- Goal: reproduce distribution stats; collision rate < 5% at 500 concepts.
- Edits/Targets: none (reuse mapping utilities).
- Commands:
  ```
  pnpm -r build | tee "$BASE_RUN_DIR/audit/rebuild.log"
  node -e "const fs=require('fs');const dist=JSON.parse(fs.readFileSync('.clmem/artifacts/w03/distribution-stats.json','utf8'));
  fs.writeFileSync(process.env.BASE_RUN_DIR+'/audit/distribution-stats.reuse.json',JSON.stringify(dist,null,2));
  const rate=dist.collisionRate||dist.collision_rate||0; console.log('collisionRate',rate);" | tee "$BASE_RUN_DIR/audit/collision-rate.txt"
  ```
- Gates: `collisionRate < 0.05`.
- Artifacts: `rebuild.log`, `distribution-stats.reuse.json`, `collision-rate.txt`
- Commit: `workflow-04(session-6): deterministic mapping check [ok]`

### Session 7 — Lens Contract (Attribute‑Only) (10–20m)

- Goal: ensure lens toggles (Affinity, Temporal) do not change geometry/positions.
- Edits/Targets: if needed, run smoke with `AUDIT_LENS=1` flag that triggers lens toggles inside the existing smoke spec (no baseline updates).
- Commands:
  ```
  AUDIT_LENS=1 pnpm smoke:brain
  ```
- Gates: smoke remains green; no position changes observed by test assertions; only color/brightness uniforms change.
- Artifacts: Playwright artifacts under `${BASE_RUN_DIR}/artifacts/playwright/` (trace on fail), `smoke.json` sidecar if present.
- Commit: `workflow-04(session-7): lens attribute-only audit [ok]`

### Session 8 — Visual Baseline Verification (10–20m)

- Goal: screenshot parity vs baseline with no snapshot updates.
- Commands:
  ```
  # Ensure no auto-update of baseline
  CI=1 pnpm exec playwright test tests/brain.smoke.spec.ts --reporter=line --project=chromium
  ```
- Gates: `toHaveScreenshot` diff ≤ 10%; no baseline files changed.
- Artifacts: Playwright diff images (on fail) under audit, or empty diffs on pass.
- Commit: `workflow-04(session-8): visual baseline verification [ok]`

### Session 9 — Performance Recheck (5–10m)

- Goal: first frame ≤ 2000ms; within ±15% of prior 1456ms is acceptable.
- Commands:
  ```
  jq '{ firstFrameMs }' "$BASE_RUN_DIR/artifacts/w03/acceptance/brain-acceptance.json" | tee "$BASE_RUN_DIR/audit/firstframe.json"
  ```
- Gates: `firstFrameMs ≤ 2000`.
- Artifacts: `firstframe.json`
- Commit: `workflow-04(session-9): performance audit [ok]`

### Session 10 — Vendor Isolation (5–10m)

- Goal: confirm no imports from `vendor/3dbrain`.
- Commands:
  ```
  rg -n "from 'vendor/3dbrain'|from \"vendor/3dbrain\"" apps packages | tee "$BASE_RUN_DIR/audit/vendor-scan.txt" || true
  ```
- Gates: `vendor-scan.txt` empty.
- Artifacts: `vendor-scan.txt`
- Commit: `workflow-04(session-10): vendor isolation audit [ok]`

### Session 11 — SSR Guard & Build Sanity (10–15m)

- Goal: rebuild succeeds; no client‑only imports on server.
- Commands:
  ```
  pnpm -r build | tee "$BASE_RUN_DIR/audit/build.log"
  rg -n "\bwindow\b|document" apps/cryptiq-mindmap-demo/app --glob '!**/client/**' | tee "$BASE_RUN_DIR/audit/ssr-scan.txt" || true
  ```
- Gates: build exit code 0; `ssr-scan.txt` empty or only in client modules.
- Artifacts: `build.log`, `ssr-scan.txt`
- Commit: `workflow-04(session-11): ssr & build sanity [ok]`

### Session 12 — Reproducibility: Two‑Run Screenshot Match (15–20m)

- Goal: two consecutive headless screenshots are identical (or within negligible diff), confirming determinism.
- Commands:
  ```
  export BASE_URL=${BASE_URL:-http://localhost:3000}
  pnpm smoke:brain
  pnpm smoke:brain
  # On pass, Playwright should not rewrite snapshots; on fail, capture diffs under audit.
  ```
- Gates: no baseline rewrite; if diffs are generated, pixel ratio ≤ 0.01.
- Artifacts: Playwright diffs under `${BASE_RUN_DIR}/audit/` (if any).
- Commit: `workflow-04(session-12): reproducibility (two-run) [ok]`

### Session 13 — Acceptance Reporter Endpoint Health (5–10m)

- Goal: server route for acceptance still reachable; writes file on browser POST.
- Commands:
  ```
  rg -n "acceptance" apps/cryptiq-mindmap-demo | tee "$BASE_RUN_DIR/audit/acceptance-route.txt" || true
  # Optional: exercise route via playwright during Session 7/8; ensure new file timestamp changes.
  ```
- Gates: route exists; acceptance file writable; Playwright logs receipt.
- Artifacts: `acceptance-route.txt`
- Commit: `workflow-04(session-13): acceptance reporter audit [ok]`

### Session 14 — Corrective Actions (only on failed gates) (variable)

- Goal: apply smallest possible fix, scoped to the failing session, then re‑run only impacted checks.
- Edits/Targets (examples):
  - Disable baseline auto‑update in Playwright config for CI/audit contexts.
  - Tighten `OrbitControls` bounds or lock screenshot pose in `BrainIntegrationTest` under `SCREENSHOT_MODE`.
  - Repair acceptance reporter path or field names.
  - Restore deterministic mapping seed usage or thresholds.
- Commands: run the specific session(s) again after the fix (Sessions 7–12 as applicable).
- Gates: previously failing gate now passes without regressing others.
- Artifacts: `corrections.md` summarizing changes; updated audit sidecars.
- Commit: `workflow-04(session-14): corrective fix (<area>) [ok]`

### Session 15 — Packaging & Final Audit Report (10–15m)

- Goal: aggregate audit artifacts; compute final result; stamp PASS/FAIL.
- Commands:
  ```
  node -e "const fs=require('fs');const p=process.env.BASE_RUN_DIR+'/audit';
  const files=fs.existsSync(p)?fs.readdirSync(p):[];const ok=files.length>0;const res={ auditedRunId: process.env.BASE_RUN_ID, ok, files };
  fs.writeFileSync(p+'/audit-results.json',JSON.stringify(res,null,2)); console.log('W04 audit complete:',ok);"
  ```
- Gates: `audit-results.json` present; `ok==true`.
- Artifacts: `audit-results.json`
- Commit: `workflow-04(session-15): audit packaging & results [ok]`

### Session 16 — Documentation & Next‑Step Gates (5–10m)

- Goal: update this file’s Status; list any required follow‑ups for W05.
- Gates: docs updated and committed.
- Artifacts: updated `workflow-04.md` under VCS.
- Commit: `workflow-04(session-16): docs & follow-ups [ok]`

---

## Section E — Orchestrator Runbook (Commands Only)

Safe defaults:

- Run from repo root (`/workspace`); export Playwright envs as in W03.
- Never use `--update-snapshots` for audit. Fail on visual diffs; do not auto‑accept.
- Write all audit outputs under `${BASE_RUN_DIR}/audit/`.

1. Preflight

```
pnpm install --frozen-lockfile
PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright-browsers pnpm exec playwright install chromium
mkdir -p /home/node/.cache && rm -rf /home/node/.cache/ms-playwright && ln -s /workspace/.playwright-browsers /home/node/.cache/ms-playwright || true
```

2. Context

```
export BASE_RUN_ID=20250822152645-cryptiq-mindmap-mvp-ALL
export BASE_RUN_DIR=.clmem/runs/${BASE_RUN_ID}
test -d "$BASE_RUN_DIR" && mkdir -p "$BASE_RUN_DIR/audit"
```

3. Smoke (no snapshot updates)

```
BASE_URL=http://localhost:3000 pnpm smoke:brain
pnpm exec playwright test tests/brain.smoke.spec.ts --reporter=line
```

4. Results

```
node scripts/w03-summarize.mjs > "$BASE_RUN_DIR/audit/recomputed-results.json"
```

---

## Section F — Success Criteria (hard + browser‑derived)

- Artifact inventory matches claimed counts; no missing critical files.
- Trust Index recompute equals original (`delta == 0`) and ≥ 80.
- Acceptance JSON passes all thresholds (meshLoaded, vertexCount, particles 200–500, firstFrameMs ≤ 2000, interactions bound).
- Server logs free of errors post‑navigation.
- Visual baseline check passes without updating snapshots (≤ 10% diff threshold).
- Determinism acceptable: back‑to‑back screenshots match or ≤ 1% diff; mapping collision rate < 5%.
- Vendor isolation holds; SSR/build remain green.

---

## Status (to be filled during run)

- Audited Run: 2025-08-22T15:26:45Z (ID: 20250822152645-cryptiq-mindmap-mvp-ALL)
- Result: PENDING — awaiting sessions 0–15
- Notes: Audit emphasizes verification without altering baselines; corrections only upon failed gates.

### Session Completion Summary

- Completed Sessions: (tbd)
- Corrections Applied: (tbd)
- All Gates: (tbd)
- Artifacts: (tbd)

### Deviations from Plan

- (tbd)

---

### TODOs for Future Polish

- Harden CI Playwright config to never update baselines in audit contexts.
- Add explicit camera pose export in acceptance for post‑hoc diffs.
- Consolidate audit reports into a single HTML summary.

### Next Gates/Steps

1. If all audit gates pass: proceed to Workflow‑05 (visual parity improvements).
2. If any gate fails: execute Session 14 corrections, re‑verify, then proceed.

---

## Appendix — Script Sketches (optional)

`scripts/stamp-artifact.sh` (sketch)

```
#!/usr/bin/env bash
set -euo pipefail
f="$1"; run="${BASE_RUN_ID:-unknown}"; ts=$(date -u +%Y-%m-%dT%H:%M:%SZ)
sha=$(sha256sum "$f" | awk '{print $1}')
echo "{\"file\":\"$f\",\"runId\":\"$run\",\"sha256\":\"$sha\",\"createdUtc\":\"$ts\"}" > "$f.sidecar.json"
```

Note: Use sketches only if you need to fill small gaps; prefer existing W03 scripts.
