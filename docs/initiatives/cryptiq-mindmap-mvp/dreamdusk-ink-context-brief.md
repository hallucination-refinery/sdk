## Context Brief — “Dreamdust Ink” (Reactive Point‑Cloud + Draw Interaction)

### 1) Current status (what’s running now)

- Point‑cloud underlay is live on the quiz page via a prebaked scene.
  - Route: `/quiz/archetype-v1?pc=scene-02&debug=1`
  - Prebaked assets: `apps/cryptiq-mindmap-demo/public/assets/pointclouds/scene-02/{positions.f32,colors.u8}`
- Debug controls are available (`?debug=1`) to tune FOV, thickness, density, etc.; settings persist to `localStorage: pcDebug`.
- Drawing overlay and pointer‑driven filters are disabled to allow clean point‑cloud iteration (draw-to-3D is intact but commented out on this page).
- Right‑click pan is enabled; orbit/zoom/pan work as expected.

Relevant code citations

```153:161:apps/cryptiq-mindmap-demo/app/quiz/[slug]/page.tsx
<div
  style={{
    position: 'absolute',
    inset: 0,
    // All pointer-driven visual filters disabled to allow clean interaction
    filter: 'none',
  }}
>
```

````180:184:apps/cryptiq-mindmap-demo/app/quiz/[slug]/page.tsx
{/* Draw-to-3D overlay (disabled for point-cloud prototyping)
<div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
  <AppHost onResult={handleResult} />
</div>
*/}

## Addendum — “Dreamdust Ink” planner aids

### A) Parameter defaults (starting points; tune via debug UI)
- Camera/FOV: fov=20–35 (persist), distance ≈ k · radius with k≈1.8–2.2; “Fit” action recomputes.
- Point density: desktop ≤150k, mobile ≤60k; stride auto from cap; keepRatio clamps by cap.
- Base size: pointSize=2.0–2.4; depth attenuation focal≈1600, min/max size≈[0.75, 10].
- Drift/jitter: driftAmp≈0.5–1.5 world units; noiseScale≈0.6–1.2; noiseSpeed≈0.2–0.5.
- Reveal: noiseThreshold 0.0→1.0 over 0.6–1.2s; gamma shaping 0.8–1.0.
- Ink field: size=128 px, brush radius≈8–14 px (screen‑space), decay per frame≈0.94–0.98, upload ≤60 Hz.
- Ink influence: sizeGain≈0.25–0.45, offsetGain≈0.5–1.2 px at 1080p (scale with DPR), tintGain≈0.05–0.1.

### B) Minimal API/concepts (what to implement or stub)
- useDreamdustUniforms
  - Returns animated uniforms: { uTime, uViewport, uInkTex?, uInkIntensity, uNoiseScale, uNoiseSpeed, uNoiseThreshold, uDriftAmp, uDepthBias }.
- InkField
  - createInkField(size=128), drawStroke(points, pressure), decay(), toCanvasTexture(throttled).
- DreamdustMaterial (TSL or GLSL wrapper)
  - attach uniforms; vertex: drift + ink offset + size modulation; fragment: noise mask + depth alpha + optional ink tint.
- CameraFit
  - fitPerspective(fovDeg, radius, margin) -> distance; apply and persist.

### C) Deliverables & checkpoints
- Checkpoint 1: Base drift + reveal
  - Uniforms live; points breathe; slider animates reveal cleanly; 60 FPS desktop.
- Checkpoint 2: Ink field integration
  - Draw -> immediate local size/offset/tint reaction; decay works; no CPU rebuilds; ≤60 Hz texture updates.
- Checkpoint 3: Depth shaping
  - Size/alpha bias by depth proxy; scene reads volumetric; no z‑fighting.
- Checkpoint 4: Camera fit & persistence
  - “Fit” fills viewport; FOV saved/restored; controls (rotate/zoom/pan) feel natural.
- Checkpoint 5: Mobile sanity
  - Caps kick in; DPR clamp; ≥30 FPS mid‑range phone; reaction still visible.

### D) Risks & mitigations
- Vertex texture fetch issues on some GPUs → fallback to fragment‑only tint/alpha bias for ink.
- Excessive CPU work from ink uploads → throttle, reuse texture, update only when brush applied/decay tick.
- Over‑dense scenes → auto cap by bytes/points; surface count in debug; stride up.
- Color mismatch when `colors.u8` absent → robust recolor from source image with PCA‑aligned UV projection.

### E) Quick test script (manual)
- Load `/quiz/archetype-v1?pc=scene-02&debug=1`; set fov≈25; Fit.
- Toggle reveal 0→1 over 1s: scene smoothly resolves; drift visible.
- Enable ink overlay; scribble fast curves: particles swell/swirl locally within 1 frame; decay clears in ≤2s.
- Zoom/rotate/pan: no hitching; FPS stable; no WebGL context loss on route change.

### F) Outcome criteria (done when)
- Ambient: continuous drift and clean dissolve/reveal; image colors read; depth feel present.
- Interaction: strokes visibly and pleasantly agitate the field in real time; no CPU stalls.
- Performance: desktop ≥60 FPS (≤150k pts), mobile ≥30 FPS (≤60k pts); uploads throttled; DPR clamp honored.
- Stability: no hydration or context‑loss errors; debug controls usable without overlay conflicts.

---

## Context audit alignment (verified vs planned)

### Verified current status (running now)

- Point‑cloud underlay via prebaked scene
  - Route supports `?pc=scene-02`: quiz page reads the param and renders `PointCloudStage`.
  - Prebaked assets exist and are fetched: `public/assets/pointclouds/scene-02/{positions.f32,colors.u8}`.
- Debug controls and persistence
  - Debug UI toggled by `?debug=1`, persisted to `localStorage: pcDebug` (thickness, pointSizeScale, keepRatio, bloom, fovDeg, mirror/flip).
- Drawing overlay disabled; pointer‑driven filters off
  - Draw overlay commented out; underlay container uses `filter: 'none'` for clean interaction.
- Camera controls
  - Orbit/zoom/pan enabled; right‑click pans; controls feel responsive.
- FOV and camera distance
  - FOV is user‑tunable, persisted, and applied; camera distance derives from model radius (~2× radius).
- Density, stride, and size attenuation
  - Desktop cap enforced at 150k points (keepRatio/step decimation). Vertex depth attenuation uses focal/min/max size; gamma shaping present.
- Color fallback
  - If `colors.u8` missing/mismatched, colors are synthesized from source image via PCA‑aligned UV mapping.

Helpful code citations
```494:507:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
<OrbitControls
  ref={controlsRef}
  makeDefault
  enableRotate
  enableZoom
  enablePan={true}
  enableDamping
  dampingFactor={0.1}
  minDistance={Math.max(0.1, radius ? radius * 0.02 : 100)}
  maxDistance={radius ? Math.max(500, radius * 10) : 5000}
  target={[0, 0, 0]}
  rotateSpeed={0.8}
  zoomSpeed={0.6}
/>
````

```1189:1197:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
fov: {Math.round(ui.fovDeg)}°
<input
  type="range"
  min={10}
  max={100}
  step={1}
  value={ui.fovDeg}
  onChange={(e) => setUi((s) => ({ ...s, fovDeg: Number(e.target.value) }))}
```

```153:161:apps/cryptiq-mindmap-demo/app/quiz/[slug]/page.tsx
<div
  style={{
    position: 'absolute',
    inset: 0,
    // All pointer-driven visual filters disabled to allow clean interaction
    filter: 'none',
  }}
>
```

### Planned (not yet implemented) per brief

- APIs/concepts to add
  - `useDreamdustUniforms`, `InkField`, `DreamdustMaterial`, `CameraFit` (do not exist yet).
- Drift/jitter and reveal
  - No noise/drift uniforms or thresholded reveal in the shader yet.
- Ink field integration
  - No `uInkTex`, brush/decay, or vertex texture sampling wired; draw overlay is disabled on this page.
- Perspective "Fit" action
  - No explicit fit button; orthographic helper exists but is commented out; only FOV persistence is present.
- Mobile caps & DPR clamp
  - Global 150k cap exists; a mobile‑specific ≤60k cap and DPR clamping are not implemented.
- Depth shaping in fragment
  - Fragment currently outputs opaque color; depth‑alpha shaping is future work.

### Manual test script — current vs planned

- Works now
  - Open `/quiz/archetype-v1?pc=scene-02&debug=1`; adjust FOV; orbit/zoom/pan (including right‑click pan); density/point size controls respond; prebaked scene loads.
- Planned
  - "Fit" button; reveal slider/animation; ink strokes affecting size/offset/tint with decay; mobile cap/DPR clamp; fragment depth alpha shaping.

### Key file references

- `apps/cryptiq-mindmap-demo/app/quiz/[slug]/page.tsx` — route, `?pc`, overlay disabled, underlay styling.
- `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx` — asset loading, debug UI & persistence, orbit controls, FOV application, density cap/decimation, recolor fallback, baseline shader.
- `apps/cryptiq-mindmap-demo/public/assets/pointclouds/scene-02/` — `positions.f32`, `colors.u8`.

### Bottom line

- The “Current status” portions of this brief are accurate.
- The Dreamdust features to build next are: GPU drift + reveal, ink field reactivity, camera fit, mobile caps/DPR clamp, and fragment depth shaping. Color fallback and density control already work.
