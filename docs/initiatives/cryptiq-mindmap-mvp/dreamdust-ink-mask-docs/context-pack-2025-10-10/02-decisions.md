# Decisions — Verified Truths & Direction

Verified Truths
- Pointer → UV mapping is correct for scene‑03; vertical flip only when `mirrorUD` is true.
- Ink texture is populated and bound; uploads are observed on every gesture.
- Vertex‑texture capability exists, but sampling space must match the painter; screen‑space sampling is currently forced for scene‑03.

Root Cause of “Nothing Happens”
- The prior pipeline emphasized tint/alpha modulation without particle motion. Even with perfect mapping and strong ink data, the effect can be imperceptible without visible displacement/advection.
- Latest finding (2025‑10‑12): With Scene‑03 prebaked path, the falloff flag (`uTempFalloffOn`) is set too early (pre‑material), so the uniform write is a no‑op. Strokes raise `uTempIntensity`, but the localized branch never engages → global jitter.
- New finding (same session, 2025‑10‑12): Forcing falloff ON (`uTempFalloffOn: 1`) removes the jitter but yields zero motion. Reading the shader shows the influence uses `vInkUv` before `vInkUv` is computed (screen‑space UV is assigned later). Influence ≈ 0 → `tempForce` ≈ 0.

Directional Decision
- Pivot to particle dynamics: implement a minimal force‑field response first (tap ripple + drag advection) using lightweight scaffolding we can rip out; once the feel is proven, solidify the plumbing and add palette‑mapped cascade; keep camera/framing intact; remove overlays.
- Latch after readiness: apply falloff/radius/center only after material uniforms exist (post‑attach/program ready) and re‑check once after reveal end to avoid missed latches in prebaked mode.
- Order-of-ops fix: compute screen‑space UV for influence (temporary local `ssUv` from `clipPos`) before multiplying by falloff; do not rely on `vInkUv` before it’s assigned.
