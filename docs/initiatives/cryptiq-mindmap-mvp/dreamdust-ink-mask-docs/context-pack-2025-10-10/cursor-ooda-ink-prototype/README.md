# Cursor OODA – Ink Prototype Closure

Goal
- Conclusively finish the “Ink Prototype” by iterating a minimal‑change OODA loop (Observe → Orient → Decide → Act) until all acceptance gates pass in dev and smoke.

Operating Process (OODA)
- Observe: Reproduce on Node 20, collect console logs, WebGL validation, and pre/mid/post screenshots for tap and stroke on `/quiz/archetype-v1?pc=scene-03`.
- Orient: Diff observations vs acceptance gates; form a single, testable hypothesis (e.g., shader version flag, render‑target hygiene, frame scheduling, first‑splat path).
- Decide: Choose one smallest code change that most directly tests/fixes the hypothesis.
- Act: Apply the change (≤150 LOC; allowed files only), rebuild, re‑run dev + smoke, and append evidence.

Acceptance Gates
- Logs present: `[PC] fluid uniforms prime …`, `[PC] fluid init …`, `[PC] fluid splat …`.
- Visible motion: First tap produces under‑finger motion within ≤2 frames; drag shows a continuous, localized plume without popping.
- No WebGL validation spam: Disallow `VALIDATE_STATUS false`, `program not valid`, `Feedback loop formed`, and repeated `WebGL: INVALID_OPERATION useProgram/draw*` after reveal.

Scope & Constraints
- Current branch only; do not create/switch branches.
- Allowed code files: 
  - `apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts`
  - `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx`
  - `apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx`
  - `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts`
  - `apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/shaders/*` (no wholesale rewrites)
- No new dependencies; ≤150 LOC per iteration; preserve camera/route behavior.

Baseline Pipeline (from repo root)
- Install: `pnpm install --frozen-lockfile`
- Typecheck (thin slice): `pnpm --filter @refinery/schema exec tsc -p tsconfig.json --noEmit || pnpm --filter cryptiq-mindmap-demo exec tsc -p apps/cryptiq-mindmap-demo/tsconfig.typecheck.json --noEmit`
- Lint (warn‑only OK): `pnpm --filter cryptiq-mindmap-demo run lint || true`
- Build: `pnpm --filter cryptiq-mindmap-demo run build`
- Smoke: `pnpm run smoke`

Dev & Smoke Ritual
- Dev server: Node 20, clear `.next`, then `pnpm --filter cryptiq-mindmap-demo run dev`.
- Page: `/quiz/archetype-v1?pc=scene-03`.
- Actions: automatic tap (center) then stroke (short diagonal). Capture pre/mid/post screenshots and full console logs.
- Evidence: save under this folder using `assets/YYYY-MM-DD-*.png` and append logs to the current run file.

Evidence & Decisions
- For each loop, append to `runs/YYYY-MM-DD-ooda-<n>.md`:
  - Inputs: Node version, commit, URLs, toggles, commands.
  - Observations: critical console excerpts and screenshot paths.
  - Hypothesis and minimal change.
  - Outcome: pass/fail vs gates, perf notes, and next step.

Commit Policy
- Commit messages: scope + purpose (e.g., `fix(fluid): force GLSL3 for FluidSim shaders`).
- Keep diffs surgical; no incidental formatting or unrelated edits.

