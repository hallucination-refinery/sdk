# Cursor Chat LLM Agent – OODA Execution Prompt (Ink Prototype)

You are the Cursor Chat LLM Agent. Autonomously run rigorous, iterative OODA loops to debug, unblock, and conclusively finish the “Ink Prototype” on the current branch.

## Objectives
- Achieve functional fluid interaction on `/quiz/archetype-v1?pc=scene-03` meeting all acceptance gates.
- Make only minimal, targeted changes (≤150 LOC) in allowed files. No new deps. Preserve camera/route behavior.
- Produce repeatable evidence (logs + screenshots) and append decisions/rationale per loop.

## Acceptance Gates
- Logs: `[PC] fluid uniforms prime …`, `[PC] fluid init …`, `[PC] fluid splat …`.
- Motion: First tap shows under‑finger motion within ≤2 frames; drag produces localized continuous plume.
- WebGL: No `VALIDATE_STATUS false`, `program not valid`, or repeated `WebGL: INVALID_OPERATION useProgram/draw*` after reveal; no “Feedback loop formed”.

## Allowed Files (strict)
- `apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts`
- `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx`
- `apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx`
- `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts`
- `apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/shaders/*` (no wholesale rewrites)

## Run Environment
- Stay on the current branch. Node 20 is the required target; Node 22 is optional for compatibility checks.
- From repo root unless noted. App root is `apps/cryptiq-mindmap-demo`.

## Baseline Pipeline
- Install: `pnpm install --frozen-lockfile`
- Typecheck: `pnpm --filter @refinery/schema exec tsc -p tsconfig.json --noEmit || pnpm --filter cryptiq-mindmap-demo exec tsc -p apps/cryptiq-mindmap-demo/tsconfig.typecheck.json --noEmit`
- Lint (warn OK): `pnpm --filter cryptiq-mindmap-demo run lint || true`
- Build: `pnpm --filter cryptiq-mindmap-demo run build`
- Smoke: `pnpm run smoke`

## Dev/Smoke Ritual (Automate)
1) Kill any proc on 3000; clear app `.next`.
2) Start dev with Node 20; open `/quiz/archetype-v1?pc=scene-03`.
3) Capture console logs and pre screenshot. Tap center (ensure pointerdown first‑splat); capture mid screenshot. Perform short diagonal stroke; capture post screenshot.
4) Filter console for required `[PC]` logs and absence of WebGL errors. Save artifacts under `assets/YYYY-MM-DD-*.png` and append `runs/YYYY-MM-DD-ooda-<n>.md`.

## OODA Loop – Operate Until Done
- Observe
  - Reproduce the issue; collect logs + screens + simple frame timings.
  - Probe page when useful (renderer caps, material flags/uniforms) via safe `evaluate`.
- Orient
  - Compare against gates; form a single, testable hypothesis (examples: GLSL3 flag for shaders; render‑target restoration; pre‑render scheduling; first‑splat radius/strength; visibility boosts).
- Decide
  - Choose a single minimal change that directly tests/fixes the hypothesis. Keep changes ≤150 LOC and within Allowed Files.
- Act
  - Apply the change; rebuild; re‑run dev ritual and then `pnpm --filter cryptiq-mindmap-demo run build`.
  - Run the smoke script; re‑capture artifacts; update the current `runs/` entry with outcome + next step.

## Log Parsing Gates (Regex Hints)
- Required: `/\[PC\] fluid uniforms prime/`, `/\[PC\] fluid init/`, `/\[PC\] fluid splat/`.
- Disallowed: `/VALIDATE_STATUS false/i`, `/program not valid/i`, `/Feedback loop formed/i`, `/WebGL: INVALID_OPERATION (useProgram|draw)/i` (after reveal).

## Evidence & Traceability
- Use this folder for all artifacts:
  - Screenshots: `assets/YYYY-MM-DD-(pre|mid|post)-(tap|stroke).png`
  - Run logs: `runs/YYYY-MM-DD-ooda-<n>.md`
- Each run log must include: Node version, commit hash, exact commands, outcome vs gates, diffs summary, and the rationale for the next loop or “done”.

## Decision & Recovery Rules
- Prefer reversibility: maintain a quick toggle/rollback for visibility boosts or debug flags.
- If a change increases error volume or breaks a gate, revert it and try the next smallest hypothesis.
- Avoid touching unrelated modules or app routes; do not change the camera.

## Completion Criteria
- All gates pass in dev and smoke; screenshots show clear under‑finger motion and coherent plume.
- No recurring WebGL validation errors.
- Final run log includes evidence snippets and a one‑line “DONE” decision.

---

Begin with OODA Loop Pass 1 (Observe) using Node 20. Append your first run log under `runs/` and proceed autonomously.

