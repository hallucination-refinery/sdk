title: Working Plan — Ink Prototype (Current Iteration)
date: 2025-10-17T19:10:00Z
commit: c2f62ddf
branch: docs/ink-falloff-flag-latch-2025-10-12
---

**A) Where we are**
- MCP (`20251017-185946`) and Playwright (`20251017-190424`) smokes on commit `c2f62ddf` both return blank frames despite the `forceVisible` override; all `[PC]` readiness logs still fire (uniforms, fluid init, instances, preset drift). docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/10-latest-smoke-evidence.md
- New render-stat instrumentation failed to persist a `[PC] render-info …` line in either console capture (cursor-ooda-ink-prototype/console/c2f62ddf/docs/ink-falloff-flag-latch-2025-10-12/20251017-185946/console-mcp.json); the draw path therefore remains unproven.
- No shader errors or WebGL validation warnings recorded; Playwright spec continues to pass (1.8 s) with deterministic viewport/DPR. cursor-ooda-ink-prototype/console/c2f62ddf/docs/ink-falloff-flag-latch-2025-10-12/20251017-190424/console-chromium-20251017-190424.json
- Acceptance gate status: FAIL (visibility). Under-finger motion cannot be evaluated while points remain invisible.

**B) Reflection**
- The instrumentation hook ran too early: the log never emitted, so we still lack evidence that the Dreamdust material reaches the renderer. Either the hook executes before `stagePointsRef` binds or the renderer stats reset before logging. We need a guaranteed post-render sample rather than another bypass tweak.

**B) Hypotheses & unknowns**
- P≈0.55 — Points draw call never executes (stage points not attached / material swap); absence of `render-info` corroborates this.
- P≈0.30 — Draw happens but stage material resolves to zero alpha/tint (colour attribute or fragment output still black).
- P≈0.10 — Instrumentation bug (log scheduled too early, Stage ref null); once corrected, we may learn draw counts without touching shader code.
- P≈0.05 — Depth/alpha gates still culling output even under `forceVisible`.

**C) Golden Path**
- Milestone 1 (P≈0.6): Fix render-stat logging so a single diagnostic run proves whether draws occur (assumption: stage points + renderer refs available after first frame).
- Milestone 2 (P≈0.45): If draws == 0, trace stage binding (ensure `stagePointsRef` points to Dreamdust material, inspect `PointsMesh` vs prebaked path).
- Milestone 3 (P≈0.35): If draws > 0 but frames blank, instrument shader output (e.g., hard-coded colour / gl_PointSize probe) before revisiting physics tuning.

**D) Single change to run next**
- Update `PointCloudStage.tsx` instrumentation so it waits for `stagePointsRef.current` and logs `renderer.info.render` from a one-shot `useFrame` callback after forceVisible toggles; include material UUID & key uniforms. PASS (diagnostic) if log appears with `calls > 0`; FAIL if log missing or `calls == 0`, which directs us to stage binding.

**E) Run plan**
- No smoke this iteration. Implement code change, run `pnpm --filter cryptiq-mindmap-demo run lint` (Node 20), `pnpm --filter cryptiq-mindmap-demo run build` for sanity, commit, push.
- Next operator: re-run MCP + Playwright with `forceVisible=1`, capture console/screenshot under `cursor-ooda-ink-prototype/{console,assets}/c2f62ddf/docs/ink-falloff-flag-latch-2025-10-12/<ts>/`, verify `[PC] render-info …` exists, then update `10-latest-smoke-evidence.md`.
