## W05 Visual Parity: Delta Analysis, Implementation Sequence, and Convergence Proof

Artifacts used

- Latest smoke test: `.clmem/runs/_W05/iteration-1.png` (coverage 10.63, distinctColors 6)
- Pre‑iteration: `.clmem/runs/20250822-194853_W05/iteration-1.png` (coverage 36.2, distinctColors 59)
- Aesthetic reference: `docs/initiatives/cryptiq-mindmap-mvp/misc/reference-image.jpeg`
- Vendor brain: `docs/initiatives/cryptiq-mindmap-mvp/misc/brain-repo-screenshot.png`

Context snapshot (why coverage is low)

- With 500 orbs at 15 px diameter: per‑orb area ≈ π·(7.5 px)^2 ≈ 176.7 px ⇒ total ≈ 88,350 px over 1280×800 (1,024,000 px) ⇒ ≈ 8.6% frame coverage, close to analyzer 10.63%. The scene is under‑framed; orbs are bright but small relative to canvas; mesh contributes little to coverage (near‑black shading).

---

### 1) Delta Analysis — Latest vs Aesthetic Goals with parameter mapping

| Aspect                      | Aesthetic Goals                           | Latest Smoke Test                   | Gap                                         | Three.js/Code Mapping                                                                                       |
| --------------------------- | ----------------------------------------- | ----------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| View & Framing (occupancy)  | ~60% H, ~50% W; centered                  | ~50% H, ~33% W; centered            | +10% H, +17% W needed                       | `camera.position.z` via `CameraFitter` in `BrainIntegrationTest.tsx`; optionally `camera.fov`               |
| Hemisphere & Pose           | Lateral, dorsolateral slight pitch        | Lateral, slight downward pitch      | Acceptable; minor tilt adjust               | `camera.position`/`lookAt`, `OrbitControls` target                                                          |
| Background                  | Near‑black / deep navy                    | Pure black                          | Use deep navy to lift silhouette            | Renderer clear color or full‑screen CSS bg (`#0a0f1a`)                                                      |
| Mesh look (screenshot mode) | Semi‑translucent, muted sulci             | Matte dark/near‑black               | Increase transmission/opacity, lighten base | `BrainMesh` → `MeshBasicMaterial` (`color≈#222633`, `opacity≈0.35`, `transparent=true`, `depthWrite=false`) |
| Concept nodes (presence)    | Luminous orbs with crisp core + soft halo | Small additive spheres, halo subtle | Boost emissive intensity & rim              | `ConceptParticles` glow shader uniforms (core gain, rim power), additive blending                           |
| Orb size (apparent)         | ~12–18 px stable                          | ~15 px target                       | Keep, bias to 18 px for readability         | `targetPixelSize` in `ConceptParticles.useFrame`                                                            |
| Distribution                | Outer‑surface shell; quasi‑uniform        | Surface shell; acceptable           | Confirm region quotas + δ offset            | `VertexMapper` quotas (30/25/25/20), `surfaceOffset≈2.0`                                                    |
| Color palette               | Cyan/teal/blue/magenta/green/yellow/amber | ~6 distinct colors                  | Ensure ≥7 bins in lens palette              | Lens mapping in `ConceptParticles` color logic                                                              |
| Exposure & lighting         | Normal exposure; subtle rim               | Underexposed mesh; orbs okay        | Lighten mesh, optional soft rim             | Ambient (0.8), weak dir light; orbs stay emissive                                                           |
| Overlay                     | None                                      | None                                | Meets                                       | `showOverlay=false` in screenshot mode                                                                      |
| Silhouette clarity          | Smooth, continuous                        | Clear but dim                       | Increase base mesh value                    | `BrainMesh` material + background navy                                                                      |

Notes on metric robustness

- Current analyzer counts non‑black pixels; a very dark mesh won’t register. For deterministic framing, use a mid‑gray mesh in screenshot mode (or a dedicated mask pass) while keeping orbs additive on top.

---

### 2) Implementation Sequence — ordered, file‑anchored edits with validation metrics

1. Deterministic framing to ~75% coverage (screenshot mode)
   - File/function: `packages/canvas-r3f/src/BrainIntegrationTest.tsx` → `CameraFitter`
   - Change: compute bounding sphere radius from `state.brainVertices`; set `camera.position.z = R / (0.75 * tan(fov/2))`
   - Current → Target: z (auto) → z that yields 75% height occupancy (units: world units)
   - Validation: analyzer `coverage` rises from ~10.6% → 60–70% (first pass), aiming 70–80%

2. Screenshot‑mode mesh for silhouette (mask‑friendly)
   - File/function: `packages/canvas-r3f/src/BrainIntegrationTest.tsx` → `<BrainMesh ...>` props in render
   - Change: in screenshot mode, set `wireframe=false`, `depthWrite=false`, `opacity≈0.35`, `wireframeColor≈#222633` and use `MeshBasicMaterial`
   - Current → Target: depthWrite: true → false; color: `#444444` → `#222633`; opacity: 1.0 → 0.35
   - Validation: analyzer `coverage` increases (mesh contributes mid‑gray), `hasOverlay=false` remains

3. Glow orbs readability (emissive, halo)
   - File/function: `packages/canvas-r3f/src/ConceptParticles.tsx` → `glowMaterial` (shader uniforms)
   - Change: bump core gain and rim power; ensure `depthTest=false`, `depthWrite=false`, `blending=AdditiveBlending`, `renderOrder=1` (already set), increase target pixel size
   - Current → Target: `targetPixelSize`: 15 px → 18 px; `rim` exponent: 2.0 → 2.5; core gain: 0.6 → 1.0
   - Validation: analyzer `distinctColors ≥ 7`, `avgBrightness` (new) ≥ 80; bright‑pixel count increases significantly

4. Surface offset and quotas confirmation
   - File/function: `packages/canvas-r3f/src/BrainIntegrationTest.tsx` → `<ConceptParticles ...>` props
   - Change: `surfaceOffset`: 1.8 → 2.0; verify region quotas (30/25/25/20) in mapping
   - Validation: visual evenness improves; optional spacing metric (5th percentile distance) meets threshold

5. Analyzer metric fidelity (optional, enables proof)
   - File: `scripts/analyze-visual-parity.mjs`
   - Change: add `avgBrightness` over non‑black pixels; raise non‑black threshold from 10 → 30; optionally `--mask-mode` to treat mid‑gray as brain coverage
   - Current → Target: absent → `avgBrightness` reported; threshold 10 → 30
   - Validation: stable `coverage` under mesh mid‑gray, meaningful `avgBrightness` trendline

6. Capture path (params only, no code edits to visuals)
   - File: `scripts/capture-brain.mjs`
   - Change: ensure URL `?screenshot=1&targetCoverage=0.75` (already present)
   - Validation: `hasOverlay=false`, deterministic framing across runs

Commit checkpoints (each step)

- Run: `node scripts/capture-brain.mjs <out>` then `node scripts/analyze-visual-parity.mjs <out> <ref>`; record metrics
- Accept when: coverage 70–80, distinctColors ≥ 7, avgBrightness ≥ 80, overlay false

---

### 3) Convergence Proof — target metrics by stage

Stage A: Framing + silhouette (after steps 1–2)

- Expected: `coverage 60–70%` initial, `hasOverlay=false`, `distinctColors ≥ 5`, `avgBrightness 50–70`
- Acceptance to move on: second pass after fine‑tune Z/FOV ⇒ `coverage 70–80%`

Stage B: Glow readability (after step 3)

- Expected: `coverage` steady in 70–80%; `avgBrightness ≥ 80`; `distinctColors ≥ 7`
- Visual check: crisp cores with soft halo; orbs remain legible against mid‑gray silhouette

Stage C: Distribution polish (after step 4)

- Expected: coverage steady; `distinctColors` unchanged; qualitative even spread around cortex; optional spacing metric passes

Stage D: Metric fidelity (after step 5, if used)

- Expected: `avgBrightness` tracks exposure changes; `coverage` stable across small pose/lighting changes; `overlay=false`

Done criteria

- Analyzer: coverage in 70–80%, `distinctColors ≥ 7`, `avgBrightness ≥ 80`, `hasOverlay=false`
- Eyeball: lateral, centered, semi‑translucent silhouette; luminous multi‑hue orbs with soft halos; clean background

---

Appendix — Parameter quick map

- Framing: `camera.position.z`, `camera.fov`, `CameraFitter(targetCoverage)`
- Mesh silhouette: `MeshBasicMaterial(color, opacity, transparent)`, `depthWrite=false`
- Glow orbs: additive blending, `depthTest=false`, `renderOrder=1`, shader core/rim gains, `targetPixelSize≈18 px`
- Distribution: region quotas, `surfaceOffset≈2.0`
- Metrics: analyzer `coverage`, `distinctColors`, `avgBrightness`, `hasOverlay`
