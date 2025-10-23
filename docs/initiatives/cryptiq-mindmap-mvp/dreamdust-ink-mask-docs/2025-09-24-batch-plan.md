# 2025-09-24 Dreamdust Batch Plan — Pre-Smoke Execution

**Purpose & Goal:** Document the Codex-ready PR sequence required to land all shader/timeline/stage changes before the next manual smoke test on `debug/batch0-baseline`. Each batch is strict one-PR-per-task, scoped to `apps/cryptiq-mindmap-demo/**`, and relies solely on AK-DD logs for validation.

```
# Dreamdust Ink Refresh - Batch PR Execution Plan

## Dependency Structure
- **Batch 1** (single): Core shader retune (DreamdustMaterial.ts) to unlock mist → silhouette aesthetic.
- **Batch 2** (after Batch 1, single): Uniform timelines (useDreamdustUniforms.ts) enabling reveal/cascade state machine.
- **Batch 3** (after Batch 2, single): Stage perf/bloom guard (PointCloudStage.tsx) before next smoke test.

**Note:** File-collision guard — within any batch, only one PR may modify `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts` or `apps/cryptiq-mindmap-demo/app/components/dreamdust/glsl/chunks.ts`; no lockfile changes; scope limited to `apps/cryptiq-mindmap-demo/**`.

---

## Batch 1 (single)

### PR-1 — Shader Condensation & Reveal Band
Branch: feat/dd-shader-condense  Target: debug/batch0-baseline
Scope:
- apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts
- Implementation details:
  - Update DEFAULT_UNIFORM_VALUES differentiating mist behaviour (threshold 0.92, breath 0.05, drift/curl 0.55, drift speed 0.28, evolution 0.85, alpha floor 0.06, gamma 1.15, rim gamma 2.4).
  - Switch reveal coord to screen-space, reduce breath gain, rewrite settle block exactly as plan: remove +0.35 floor, add settle smoothstep, fade curl, keep mist breath.
  - Narrow fragment reveal band (threshold ±0.08) while keeping PMA and depth fading.
- Exports/types/functions: none (uniforms remain same keys).
- Specific requirements: preserve acceptance-key logging, no changes to chunks.ts, no new files.
- Additional files: none.
- Scope constraints: only `apps/cryptiq-mindmap-demo/**`; no cross-package edits; no lockfile churn.
- Parallelizability & file-collision guard: touches only DreamdustMaterial.ts; no other PR in batch.
- Acceptance criteria (non-visual/log-based): AK-DD-01..09 emitted once; `[PC] instances` unchanged (baseline 89,441); `[Dreamdust] reveal start/end` still around 0.9 s; `[dreamdust] frame-percentiles` order same (no regression expected); `Maximum update depth exceeded` absent; fallback watchdog absent.
- Baseline checks (commands + expected outputs): paste outputs of  
  corepack enable  
  pnpm install --frozen-lockfile  
  pnpm --filter @refinery/schema exec tsc -p tsconfig.json --noEmit || pnpm --filter cryptiq-mindmap-demo exec tsc -p apps/cryptiq-mindmap-demo/tsconfig.typecheck.json --noEmit  
  pnpm --filter cryptiq-mindmap-demo run lint || true  
  CI=1 pnpm --filter cryptiq-mindmap-demo run build  
  pnpm run smoke  
  (All commands run; outputs pasted in PR body; smoke command should show same AK logs, verifying shader compile.)
- Rollback/Stop conditions: any AK key missing/duplicated, shader compile errors, perf percentiles regress >10% vs baseline.
- Inputs (docs): 2025-09-24 baseline brief/test protocol, Fojcik frame README.
- Outputs (files): DreamdustMaterial.ts only.
- Diff budget: ≤200 changed lines; no new deps.
- Codex Prompt (self-contained):  
  ```
  Update apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts as follows:
  1. In DEFAULT_UNIFORM_VALUES (top of file lines ~27-73), set:
     uNoiseThreshold=0.92, uBreathAmp=0.05, uDriftAmp=0.55, uCurlAmp=0.55, uDriftSpeed=0.28, uEvolution=0.85, uAlphaFloor=0.06, uGamma=1.15, uRimGamma=2.4.
  2. In vertex shader section (around vRevealCoord assignment), compute screen-space:
     `vec2 ss = ndc * 0.5 + 0.5;`
     `vRevealCoord = ss * (2.6 + uNoiseScale * 0.8) + jitterSeed.xy * 0.07;`
  3. Replace `float breathScale = 1.0 + breathPhase * 0.12;` with `float breathScale = 1.0 + breathPhase * 0.06;`
  4. Replace the mist/curl block (see plan) with the settle version:
     - compute `float settle = smoothstep(0.55, 1.0, revealProgress);`
     - set `mistAmount = (1.0 - revealProgress) * 1.8;`
     - add mist breath `mistPos += mistDir * (breathPhase * max(uBreathAmp, 0.0) * (1.0 - 0.7 * settle));`
     - mix `revealPos = mix(mistPos, basePos, settle);`
     - fade curl with `(1.0 - 0.7 * settle)` before cascade boosts.
  5. In fragment shader, change reveal band to:
     ```
     float threshold = clamp(uNoiseThreshold, 0.0, 1.0);
     float revealNoise = dd_noise2(vRevealCoord);
     float revealStrength = clamp(vRevealMix, 0.0, 1.0);
     float w = 0.08;
     float baseReveal = smoothstep(threshold - w, threshold + w, revealNoise);
     float revealAlpha = max(baseReveal, revealStrength * 0.40);
     float alpha = spriteMix * revealAlpha * revealStrength;
     ```
  Ensure surrounding code compiles; do not alter rim/gamma/ink blocks.
  ```
Checks: build + lint + smoke outputs as above.  Commit: `feat(dreamdust): reauthor condensation shader`  Open PR: base=debug/batch0-baseline

---

## Batch 2 (single)

### PR-2 — Reveal & Cascade State Machine
Branch: feat/dd-uniform-timelines  Target: debug/batch0-baseline
Scope:
- apps/cryptiq-mindmap-demo/app/components/dreamdust/useDreamdustUniforms.ts
- Implementation details:
  - Align defaults to shader values (threshold 0.92, breath 0.05, drift/curl 0.55, evolution 0.85, gamma 1.15, rim 2.4).
  - Set `DEFAULT_REVEAL_MS = 900`.
  - Add cascade constants (`CASCADE_RAMP_S`, `CASCADE_HOLD_S`, `CASCADE_DECAY_S`, `CASCADE_SIZE_PEAK`, `CASCADE_VAPOR_PEAK`).
  - Modify cascade tick to follow the 3-phase state machine using `easeCubicInOut`, writing `uCascade`, `uVaporGain`, `uCascadeSizeBoost`.
- Scope constraints / Parallelizability guard: touches useDreamdustUniforms.ts only; sequential after Batch 1 because defaults share values.
- Acceptance criteria: AK logging unchanged; `startCascade` still emits existing logs; state machine doesn’t duplicate `[Dreamdust] cascade start/end`; smoke command (run once later) should show reveal start {900}, cascade logs once.
- Baseline checks: same command list with pasted outputs; smoke run deferred until post-Batch 3 but commands still executed for CI.
- Rollback/Stop: revert if cascade logs spam or `uCascade` never returns to 0 after stroke.
- Inputs: Baseline docs, plan, cascade constants.
- Outputs: useDreamdustUniforms.ts.
- Diff budget: ≤180 lines.
- Codex Prompt:
  ```
  Edit apps/cryptiq-mindmap-demo/app/components/dreamdust/useDreamdustUniforms.ts:
  1. In DEFAULT_UNIFORM_VALUES, set uNoiseThreshold=0.92, uBreathAmp=0.05, uDriftAmp=0.55, uCurlAmp=0.55, uEvolution=0.85, uGamma=1.15, uRimGamma=2.4.
  2. Change DEFAULT_REVEAL_MS from 2000 to 900.
  3. Near existing CASCADE_* consts, add:
     ```
     const CASCADE_RAMP_S = 0.7;
     const CASCADE_HOLD_S = 0.2;
     const CASCADE_DECAY_S = 0.8;
     const CASCADE_SIZE_PEAK = 0.25;
     const CASCADE_VAPOR_PEAK = 0.9;
     ```
  4. Inside cascade tick (where cascade.elapsed updated), replace the section that sets mix with:
     ```
     if (!cascade.active) return;
     cascade.elapsed = Math.min(cascade.elapsed + safeDelta, CASCADE_RAMP_S + CASCADE_HOLD_S + CASCADE_DECAY_S);
     const t = cascade.elapsed;
     let mix = 0.0;
     if (t < CASCADE_RAMP_S) {
       const s = t / CASCADE_RAMP_S;
       mix = easeInOutCubic(s);
     } else if (t < CASCADE_RAMP_S + CASCADE_HOLD_S) {
       mix = 1.0;
     } else if (t < CASCADE_RAMP_S + CASCADE_HOLD_S + CASCADE_DECAY_S) {
       const s = (t - CASCADE_RAMP_S - CASCADE_HOLD_S) / CASCADE_DECAY_S;
       mix = 1.0 - easeInOutCubic(s);
     } else {
       cascade.active = false;
       cascade.elapsed = 0;
       mix = 0.0;
     }
     uniforms.uCascade.value = mix;
     uniforms.uVaporGain.value = CASCADE_VAPOR_PEAK * mix;
     uniforms.uCascadeSizeBoost.value = CASCADE_SIZE_PEAK * mix;
     ```
     (If easeInOutCubic not present, reuse cubicEaseInOut helper.)
  Make sure stopCascade still resets values as before.
  ```
Checks: same baseline command outputs.  Commit: `feat(dreamdust): add cascade ramp-hold-decay timeline`  Open PR: base=debug/batch0-baseline

---

## Batch 3 (single)

### PR-3 — Stage Budget & Bloom Guard
Branch: feat/dd-stage-perf-guard  Target: debug/batch0-baseline
Scope:
- apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
- Implementation details:
  - Adjust `pointCap` usage to `mobile: 75_000, desktop: 95_000`.
  - Default `bloom: true` in UI state.
  - Introduce bloom guard logic: disable on mobile, when instance count < 60k, or devicePixelRatio > 2.0; downscale composer size by 0.75 when DPR > 1.6.
- Scope constraints: only this file; sequential after Batch 2 (depends on new defaults for reveal/cascade to test).
- Acceptance criteria: AK-DD logs unaffected; `[dreamdust] bloom {}` log reflects new default; `[PC] instances` remains under cap;
 (more lines truncated as necessary)
