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

## Experiment 02 — Vertex Telemetry Capture
- **Goal:** Use the new `vertexLog=1` flag to sample `revealPos` and `gl_Position` pairs so we can confirm whether geometry collapses before the fragment stage.
- **Probe run:** 22:47 ET capture on `codex/instrument-vertex-positions-for-debugging` with all probes enabled and forceAlpha retained for parity with prior smokes.【2025-09-28-vertex-log-raw.md:1-36】
- **Observed outcome:** The collector returned an empty array—no `[vertex] samples` were emitted—and the lag prevented the tap/stroke from firing, so `[PC] ink debug` / `[dreamdust] ink-latency` are also missing; `[PC]` and `[sim]` telemetry still match the collapse signature.【2025-09-28-vertex-log-raw.md:37-144】
- **Perf trace:** Settled trace `perf-traces/2025-09-26-2330-vertex-log-baseline.json` reports median frame spacing ≈ 51 ms (max ≈ 134 ms) with 431 long `RunTask`/`FireAnimationFrame` slices (~132 ms), aligning with the rAF violation spam and indicating CPU-side stalls before telemetry capture.【2025-09-28-vertex-log-raw.md:148-162】
- **Interpretation:** The shader define or material hook still fails to surface telemetry during the main pass; geometry data loads, but without slot captures we cannot isolate whether reveal or alpha stages are discarding points.
- **Next actions:**
  - Audit `PointCloudStage` and `DreamdustMaterial` to confirm DEBUG_VERTEX_LOG survives recompiles (suspect R3F reuse or missing `vertexTelemetry.capture` invocation during the fallback path).
  - Re-run once the console prints non-empty sample sets; capture at least two bursts (~750 ms cadence) and archive them in the raw log for synthesis.
  - If telemetry continues to stay silent, consider a minimal reproduction with a static `Points` geometry to verify the collector independently of Dreamdust wiring.
