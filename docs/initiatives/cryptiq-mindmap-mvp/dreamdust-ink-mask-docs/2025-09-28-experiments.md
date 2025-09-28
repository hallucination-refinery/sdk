# 2025-09-28 Dreamdust Experiments

## Experiment 01 — Alpha vs Vertex Choke
- **Goal:** Determine whether alpha blending values or vertex position updates are the main bottleneck causing the Dreamdust render to stall during ink-mask playback.
- **Proposed tweak:** Hardcode the Dreamdust particle alpha to `1.0` for a single render pass while bypassing the particle simulation step that warps vertex positions, so the stage renders with static geometry but full opacity.
- **Success evidence:**
  - Render loop holds stable frame pacing (no AK watchdog warnings) while alpha is fixed and simulation bypassed.
  - GPU frame timings drop measurably in AK-DD logs compared to the baseline stall captures, with no spike when particle counts peak.
  - Visual output shows static particle positions but remains fully visible (no unexpected transparency artifacts).
- **Failure evidence:**
  - Frame pacing still degrades or watchdog trips even with alpha forced and simulation skipped, indicating another choke point.
  - GPU timings or AK-DD logs continue to show the same latency spikes seen in baseline runs.
  - Visuals exhibit clipping or blank frames despite alpha hardcoding, implying the tweak is ineffective or introduces new regressions.
- **Next actions:**
  - **If successful:** Proceed to isolate alpha-handling paths (e.g., PMA blend config, framebuffer clears) in subsequent experiments, then gradually reintroduce simulation to pinpoint the minimum change that preserves stability.
  - **If failure:** Pivot to inspecting downstream consumers (post-processing passes, framebuffer swaps) and design Experiment 02 around instrumenting those stages, restoring original alpha/sim settings before testing.
