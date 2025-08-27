# Workflow 06: Pixelation Post‑Processing Pass (EffectComposer + PixelShader)

Created: 2025‑08‑27
Scope: Add a feature‑flagged pixelation pass to the R3F scene using EffectComposer + RenderPass + ShaderPass + PixelShader, with resize/DPR handling, reduced‑motion gating, and a QA toggle.
Reference: three.js Pixelation postprocessing example — [PixelShader example](https://threejs.org/examples/?q=pixel#webgl_postprocessing_pixel)
Constraints: Desktop MVP; keep pass lightweight (<1ms/frame typical); no regressions to glow/particles.

---

## Section A — Target End‑State

1. With pixelation ON (flag), the full scene (shell + orbs) renders through EffectComposer with a final PixelShader screen pass.
2. Pixel size is configurable (e.g., 4/6/8/12) and stable under resize/DPR changes.
3. Pixelation toggle: query `?pixelate` and/or `NEXT_PUBLIC_PIXELATE=1`; defaults OFF for `prefers-reduced-motion` unless `pixelate=force`.
4. No double render or ordering conflicts; PixelShader runs last.

---

## Section B — Preconditions & Environment

- Branch: `feat/pixelation-pass` (from current working branch)
- Tooling: Node ≥20, pnpm ≥9; dev shell at `/workspace`
- Libraries: `three`, `@react-three/fiber`, `@react-three/drei` already present
- Postprocessing imports will come from `three/examples/jsm` (modules)

---

## Section C — Sessions (Detailed, gated, reproducible)

Each session lists Goal • Edits/Targets • Commands • Gates • Artifacts • Commit. Run all commands at repo root unless noted.

### Session 0 — Imports & Types Preflight (10–15m)

- Goal: Confirm postprocessing modules can be imported.
- Edits/Targets:
  - Plan imports inside `apps/cryptiq-mindmap-demo/app/components/BackgroundBrain.tsx`:
    - `EffectComposer` — `three/examples/jsm/postprocessing/EffectComposer.js`
    - `RenderPass` — `three/examples/jsm/postprocessing/RenderPass.js`
    - `ShaderPass` — `three/examples/jsm/postprocessing/ShaderPass.js`
    - `PixelShader` — `three/examples/jsm/shaders/PixelShader.js`
- Commands: `pnpm -r build`
- Gates: Build green after wiring in Session 2; no unresolved module paths.
- Artifacts: `.clmem/artifacts/w06/session0/build.log` (optional)
- Commit: `workflow(w06/s0): preflight for postprocessing imports`

### Session 1 — Flag & Toggle Plumbing (10–15m)

- Goal: Add feature flag and QA toggle.
- Edits/Targets (`BackgroundBrain.tsx`):
  - Compute `pixelateEnabled` from query/env: `?pixelate` or `NEXT_PUBLIC_PIXELATE=1`.
  - Respect reduced‑motion: default OFF if `prefers-reduced-motion`, unless `pixelate=force` in query.
  - (Dev only) When `?debug` present, show a tiny HUD to toggle pixelation and select pixel size.
- Commands: none (save/build)
- Gates: Toggle reflects query/env; reduced‑motion path OFF by default.
- Commit: `workflow(w06/s1): pixelation flag & toggle plumbing`

### Session 2 — Composer Wiring (25–30m)

- Goal: Render through EffectComposer with PixelShader as the final pass when enabled.
- Edits/Targets (`BackgroundBrain.tsx`):
  - Create refs for `composer` and `pixelPass`.
  - In a mount `useEffect`, initialize:
    - `composer = new EffectComposer(gl)`
    - `composer.addPass(new RenderPass(scene, camera))`
    - `pixelPass = new ShaderPass(PixelShader)`
      - `pixelPass.uniforms.resolution.value = new THREE.Vector2(size.width, size.height)`
      - `pixelPass.uniforms.pixelSize.value = 6` (initial)
    - `composer.addPass(pixelPass)`
  - In `useFrame`, when `pixelateEnabled` is true, call `composer.render()` and skip the default `gl.render(scene, camera)`; otherwise fall back to default R3F render.
- Commands: `pnpm --filter cryptiq-mindmap-demo dev`
- Gates: With `?pixelate`, frame is visibly pixelated; without flag, visuals unchanged.
- Artifacts: `.clmem/artifacts/w06/session2/notes.md`
- Commit: `workflow(w06/s2): wire EffectComposer + RenderPass + PixelShader`

### Session 3 — Resize & DPR Handling (10–15m)

- Goal: Keep pixelation consistent across window resizes and different DPR.
- Edits/Targets (`BackgroundBrain.tsx`):
  - On `size.width/height` change:
    - `composer.setSize(size.width, size.height)`
    - `pixelPass.uniforms.resolution.value.set(size.width, size.height)`
  - Optional: `composer.setPixelRatio(1)` and scale `pixelSize = Math.max(1, basePx * gl.getPixelRatio())` (evaluate visually).
- Commands: dev server; manually resize window.
- Gates: Pixel density stable on resize; no blur or aliasing regressions.
- Commit: `workflow(w06/s3): resize + DPR handling for composer`

### Session 4 — Ordering & Compatibility (10–15m)

- Goal: Ensure pixelation runs last and does not conflict with glow/particles.
- Edits/Targets:
  - Pass order: `RenderPass → (...other passes if any) → PixelShader` (last).
  - Guard against double render in `useFrame` (composer OR default, not both).
- Gates: Glow and particles remain; pixelation affects entire frame; no flicker.
- Commit: `workflow(w06/s4): pass ordering & render path guard`

### Session 5 — Reduced‑Motion & Screenshot Mode (10–15m)

- Goal: Respect user settings and screenshot mode.
- Edits/Targets:
  - Reduced‑motion ON → default pixelation OFF unless `?pixelate=force`.
  - Screenshot mode (`NEXT_PUBLIC_SCREENSHOT_MODE=1`) → default OFF unless explicitly forced; document behavior.
- Gates: Toggles behave consistently across modes.
- Commit: `workflow(w06/s5): reduced‑motion & screenshot mode guards`

### Session 6 — Dev HUD Toggle (10–15m)

- Goal: Add a small QA control (dev only).
- Edits/Targets:
  - When `?debug` present, show a bottom‑right control with `Pixelate: On/Off` and `Pixel Size: [4,6,8,12]`.
  - Persist choice in `localStorage` (`cryptiq:pixelate`).
- Gates: QA can flip pixelation and change size at runtime.
- Commit: `workflow(w06/s6): dev HUD toggle for pixelation`

### Session 7 — Acceptance & Perf Gate (10–15m)

- Goal: Prove no perf regressions; ensure effect toggles.
- Commands:
  - `pnpm --filter cryptiq-mindmap-demo dev`
  - Manual QA: `http://localhost:3000/?pixelate`, `?pixelate&debug`, resize window.
- Gates:
  - Subjective FPS ≥50 in dev on reference laptop.
  - Pixelation toggles; reduced‑motion honored.
  - No console errors; server logs clean after first navigation.
- Artifacts: `.clmem/artifacts/w06/pixelation-notes.md`
- Commit: `workflow(w06/s7): acceptance notes & perf smoke`

---

## Section D — Risks & Mitigations

- Composer conflicts with default R3F render → Only call `composer.render()` when enabled; else let R3F render.
- Blurry look on high‑DPR → Set composer pixel ratio and/or scale `pixelSize` by DPR; provide QA control to tune.
- Reduced‑motion users → Default OFF unless explicitly forced.

---

## Section E — Success Criteria

- With `?pixelate`, scene renders through the pixelation pass and is visibly pixelated; without flag, visuals unchanged.
- Resize and DPR changes keep pixel density consistent; no artifacts or double renders.
- No measurable perf regression in dev; no console errors; toggles behave as designed.

---

## References

- three.js example — Pixelation postprocessing: [PixelShader example](https://threejs.org/examples/?q=pixel#webgl_postprocessing_pixel)
