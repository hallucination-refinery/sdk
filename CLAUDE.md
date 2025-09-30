# Dreamdust Ink Debugging Guide

## Repository Orientation
- **Monorepo:** managed with `pnpm`; prod app lives in `apps/cryptiq-mindmap-demo` (Next.js 15).
- **Key entrypoints:**
  - Telemetry harness: `scripts/smoke-test.js` (Puppeteer-based).
  - Vertex instrumentation: `apps/.../dreamdust/telemetry/vertexTelemetry.ts`.
  - Documentation home: `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/`.
- **Common commands:**
  - Install deps: `pnpm install --frozen-lockfile`.
  - Prod build: `pnpm --filter cryptiq-mindmap-demo run build`.
  - Dev server: `pnpm --filter cryptiq-mindmap-demo dev`.
  - Storybook/smoke jobs (if needed): see package scripts; default tests rely on Next.js tooling.

## Environment & Config
- Node 22.x with `pnpm` 9.x (corepack-managed).
- Required browser: Google Chrome (export path via `PUPPETEER_EXECUTABLE_PATH` when running telemetry).
- Important env defaults for the Dreamdust app: `NEXT_PUBLIC_GRAPH_SPAWN=sphere`, `NEXT_PUBLIC_DEBUG_GRAPH=false`, `NEXT_PUBLIC_PIXELATE=0`, `NEXT_PUBLIC_ENABLE_CONTROLS=0` (already baked into app).
- Ports: prod server for harness should bind to **127.0.0.1:3000** to avoid macOS `localhost` socket reuse issues.

## Dreamdust Telemetry Workflow
This is the standard loop Claude must follow whenever collecting evidence or validating fixes.

### Route & Parameters
- **Base URL:** `http://127.0.0.1:3000`
- **Path:** `/quiz/archetype-v1`
- **Query string:** `pc=scene-02&debug=1&engine=sim&inkProbe=1&simProbe=1&simStats=1&inkStats=1&forceAlpha=1&vertexLog=1`
- Settling time: 30s (override with `wait_ms` arg if needed).

### Required Artifacts
Every run must produce the dated trio inside `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/`:
1. `assets/YYYY-MM-DD-telemetry-capture.png`
2. `assets/YYYY-MM-DD-telemetry-console.jsonl`
3. `YYYY-MM-DD-vertex.log`
Additionally, `/tmp/dd-telemetry.json` (stdout from the harness) should be quoted in the summary for gate status.

### Documentation Touchpoints
After the harness completes, append/update:
- `2025-09-24-dreamdust-ink-mask-brief.md`: add a **“YYYY-MM-DD Telemetry”** section summarising visuals, gate booleans (`promotionObserved`, `aSimUv89441`, `buffersNonZero`, `samplesNonZero`), whether `vertexTelemetry.capture` succeeded, and links to artifacts.
- `2025-09-24-test-protocol.md`: record any deviations (different params, settle time) and automation notes so manual auditors can retrace the run.

### Audit Rules
- Never delete or rewrite older dated sections—append chronologically.
- Summaries must reference exact file paths and include gate outcomes plus next-step recommendations.
- If the harness reports `status:
