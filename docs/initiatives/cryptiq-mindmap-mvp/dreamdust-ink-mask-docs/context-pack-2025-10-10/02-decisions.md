# Decisions — Verified Truths & Direction

Verified Truths
- Pointer → UV mapping is correct for scene‑03; vertical flip only when `mirrorUD` is true.
- Ink texture is populated and bound; uploads are observed on every gesture.
- Vertex‑texture capability exists, but sampling space must match the painter; screen‑space sampling is currently forced for scene‑03.

Root Cause of “Nothing Happens”
- The prior pipeline emphasized tint/alpha modulation without particle motion. Even with perfect mapping and strong ink data, the effect can be imperceptible without visible displacement/advection.

Directional Decision
- Pivot to particle dynamics: implement a minimal force‑field response first (tap ripple + drag advection), then add palette‑mapped cascade; keep camera/framing intact; remove overlays.

