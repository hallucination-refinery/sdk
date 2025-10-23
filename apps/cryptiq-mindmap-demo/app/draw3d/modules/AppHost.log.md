# AppHost telemetry events

Documented Draw3D AppHost console logs.

## Event sequence

- `[strokeEnd]` — pointer lifted; may trigger timer setup.
- `[timerScheduled] <ms>ms` — idle timer scheduled for auto commit (e.g., `1500ms`).
- `[timerFired]` — idle timer completed; classification begins if ink meets thresholds.
- `[commitFired]` — classification started.
- `pre <ms>ms load <ms>ms infer <ms>ms` — preprocessing, model load, and inference timings emitted after commit.
- `[gateRejected]` `{ area, length, w, h, MIN_AREA, MIN_LENGTH }` — stroke rejected for insufficient ink.

## Sample

```text
[strokeEnd]
[timerScheduled] 1500ms
[timerFired]
[commitFired]
pre 3.2ms load 120.5ms infer 40.1ms
```

When ink fails minimum requirements:

```text
[gateRejected] { area: 20, length: 60, w: 10, h: 10, MIN_AREA: 1024, MIN_LENGTH: 80 }
```
