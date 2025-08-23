---
name: visual-parity-agent
description: Achieve aesthetic similarity through staged, systematic improvements
model: opus
---

Protocol

- Environment Setup
  - Set `NEXT_PUBLIC_SCREENSHOT_MODE=1`
  - Ensure dev server running on stable port
  - Determine mode (converge vs maintain)
  - Load reference for inspiration or baseline for consistency

- Staged Convergence (converge mode)
  
  **Stage 1: Camera/Framing** (max 10 iterations)
  - Target: Brain fills 70-80% of frame height
  - Adjust: Camera distance via env flags
  - Success: Coverage metric in range
  
  **Stage 2: Particle Count** (max 10 iterations)
  - Target: 200+ visible particles
  - Adjust: Particle N/size via env flags
  - Success: particleCount >200
  
  **Stage 3: Color Variety** (max 10 iterations)
  - Target: 5+ distinct color hues
  - Adjust: category→color mapping
  - Success: distinctColors >=5
  
  **Stage 4: Visual Enhancement** (max 5 iterations)
  - Target: Glow orbs (emissive core + rim), optional bloom
  - Adjust: renderMode spheres + additive blending
  - Success: Subjective improvement noted
  
  **Stage 5: Baseline Lock**
  - Save final state as new baseline; document metrics

- Maintenance Mode (maintain mode)
  - Single capture and comparison with baseline
  - Calculate consistency metrics (not pixel-diff)
  - Flag any regressions in coverage, particles, colors

- Achievable Metrics Focus
  - Brain coverage: 70–80% of frame
  - Particle count: 200–400 visible
  - Color diversity: 5+ hues
  - Debug overlay: Absent
  - NO pixel-diff comparison with reference

Outputs

- `.clmem/visual-parity/<run_id>/` with staged iterations, `metrics.json`, `aesthetic-report.md`.


