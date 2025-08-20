# Brain Extraction Workflow - Session Plan

## Objective
Start the existing vendor demo at `vendor/3dbrain` in isolation and verify it serves the page (no adaptation/porting; no changes outside `vendor/3dbrain/`).

## Scope
- **In**: install in vendor only, minimal runtime compatibility shim if required, start dev server, basic health check (HTTP 200).
- **Out**: any edits to `apps/cryptiq-mindmap-demo`, workspace-wide installs/builds, or visual extraction/porting.

## Preconditions
- The repository has already been cloned at `vendor/3dbrain`.
- Port 8080 is available (or change PORT below).

## Steps
1. Guard isolation and record provenance
   - Do NOT add `vendor/3dbrain` to `pnpm-workspace.yaml`
   - Create vendor-local npm config to avoid workspace coupling
   - Record git commit hash

2. Install legacy dependencies (isolated)
   - Run pnpm install with isolation flags

3. Compatibility shim (only if particles crash occurs)
   - Handle known three.js compatibility issue if needed
   - Inject runtime shim before app code executes

4. Run dev server (default port 8080)
   - Start the development server

5. Health check (basic success criteria)
   - Verify HTTP 200 response

## Acceptance Criteria (v0)
- Install step completes without workspace-wide scope
- Dev server reports "Compiled successfully" and responds 200 at `http://localhost:8080/`
- No edits occurred outside `vendor/3dbrain/`