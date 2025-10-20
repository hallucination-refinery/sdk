title: Working Plan — Ink Prototype (Current Iteration)
date: 2025-10-18T14:05:00Z
commit: c1ea70ff
branch: docs/ink-falloff-flag-latch-2025-10-12
---

**A) Where we are**
- MCP (`20251017-185946`) and Playwright (`20251017-190424`) smokes on commit `c2f62ddf` both return blank frames despite the `forceVisible` override; all `[PC]` readiness logs still fire (uniforms, fluid init, instances, preset drift). docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/10-latest-smoke-evidence.md
- `PointCloudStage.tsx` now mounts `<RenderInfoLogger>` inside the Canvas, so the `[PC] render-info …` line should emit once forceVisible engages. apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
- No shader errors or WebGL validation warnings recorded; Playwright spec continues to pass (1.8 s) with deterministic viewport/DPR. cursor-ooda-ink-prototype/console/c2f62ddf/docs/ink-falloff-flag-latch-2025-10-12/20251017-190424/console-chromium-20251017-190424.json
- Acceptance gate status: FAIL (visibility). Under-finger motion cannot be evaluated while points remain invisible.

**B) Reflection**
- Render logging now lives inside the R3F context (`useFrame` + `useThree`), eliminating the “hooks outside Canvas” runtime error and ensuring we only log once the renderer and stage points exist.

**B) Hypotheses & unknowns**
- P≈0.55 — Points draw call never executes (stage points not attached / material swap); absence of `render-info` corroborates this.
- P≈0.30 — Draw happens but stage material resolves to zero alpha/tint (colour attribute or fragment output still black).
- P≈0.10 — Instrumentation bug (if the new logger still fails to fire, investigate stage ref binding/logging).
- P≈0.05 — Depth/alpha gates still culling output even under `forceVisible`.

**C) Golden Path**
- Milestone 1 (P≈0.6): Capture render stats via the new logger during the next smoke run (`calls/points/triangles`). PASS = draw path proven; FAIL (calls = 0 or missing log) ⇒ investigate stage binding.
- Milestone 2 (P≈0.45): If draws == 0, trace stage binding (ensure `stagePointsRef` points to Dreamdust material, inspect `PointsMesh` vs prebaked path).
- Milestone 3 (P≈0.35): If draws > 0 but frames blank, instrument shader output (e.g., hard-coded colour / gl_PointSize probe) before revisiting physics tuning.

**D) Single change to run next**
- Run diagnostic smoke (MCP + Playwright) with `forceVisible=1`, archive the new `[PC] render-info …` line, and record the reported draw counts. PASS if `calls > 0`; FAIL otherwise, then debug binding.

**E) Run plan**
- Build & serve (Node 20): `pnpm --filter cryptiq-mindmap-demo run build`, `pnpm --filter cryptiq-mindmap-demo run start`.
- MCP smoke: hit `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&forceVisible=1`, capture console JSON + `[PC] render-info …` line + screenshot.
- Playwright smoke: same URL, expect `[PC]` logs plus render-info entry; archive artifacts to `cursor-ooda-ink-prototype/{assets,console}/<commit>/<branch>/<ts>/`.
- Update `10-latest-smoke-evidence.md` with render-info stats, then evaluate shader strategy based on PASS/FAIL.
