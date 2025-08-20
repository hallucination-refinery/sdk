## 3dbrain Reference — Orchestrator Runbook (Isolated Dev Run Only)

Objective

- Start the existing vendor demo at `vendor/3dbrain` in isolation and verify it serves the page (no adaptation/porting; no changes outside `vendor/3dbrain/`).

Scope (explicit)

- In: install in vendor only, minimal runtime compatibility shim if required, start dev server, basic health check (HTTP 200).
- Out: any edits to `apps/cryptiq-mindmap-demo`, workspace-wide installs/builds, or visual extraction/porting.

Preconditions

- The repository has already been cloned at `vendor/3dbrain`.
- Port 8080 is available (or change PORT below).

Steps (non-interactive; safe to re-run)

1. Guard isolation and record provenance

- Do NOT add `vendor/3dbrain` to `pnpm-workspace.yaml`.
- Create vendor-local npm config to avoid workspace coupling:

```bash
printf "ignore-workspace=true\nlink-workspace-packages=false\nshared-workspace-lockfile=false\n" > vendor/3dbrain/.npmrc
git -C vendor/3dbrain rev-parse HEAD > vendor/3dbrain/COMMIT.txt
```

2. Install legacy dependencies (isolated)

```bash
pnpm --dir vendor/3dbrain install --ignore-workspace
```

3. Compatibility shim (only if particles crash occurs)

- Known error: `bas.module.js:1621 TypeError: this.setAttribute is not a function` (three r91 vs three-bas).
- Inject a small shim at runtime before app code executes:

```bash
cat > vendor/3dbrain/src/__shim__.js <<'EOF'
if (typeof window !== 'undefined' && window.THREE && window.THREE.BufferGeometry) {
  var BG = window.THREE.BufferGeometry.prototype;
  if (!BG.setAttribute && BG.addAttribute) {
    BG.setAttribute = BG.addAttribute;
  }
}
EOF

# Ensure the shim is imported first in the entry file (idempotent)
grep -q "__shim__" vendor/3dbrain/src/app.js || sed -i '1s;^;import "./__shim__";\n;' vendor/3dbrain/src/app.js
```

4. Run dev server (default port 8080)

```bash
pnpm --dir vendor/3dbrain dev
```

5. Health check (basic success criteria)

```bash
# wait for dev server to boot, then assert HTTP 200
curl -sSf http://localhost:8080/ > /dev/null
```

Acceptance (v0)

- Install step completes without workspace-wide scope.
- Dev server reports "Compiled successfully" and responds 200 at `http://localhost:8080/`.
- No edits occurred outside `vendor/3dbrain/`.

Notes

- This runbook exists solely to stand up the vendor demo for visual/code reference. Create a separate workflow for any extraction or porting after the reference is viewable.

---

### Notes

- Proven capability: The previous orchestrated run implemented all sessions with only last‑mile wiring and a relaxed vertex threshold. Primary bottlenecks are infra/scaffolding—not Claude’s implementation breadth.
- This workflow is deliberately small and measurable: no speculative edits, every step yields a concrete artifact or gate.
