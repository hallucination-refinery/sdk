# Dreamdust Ink — Diagnostic Guards & Probes (2025-09-20)

## Purpose
- Capture the runtime diagnostics that must be verified (or stay silent) before tuning Dreamdust ink behavior, keeping bring-up noise low while protecting shader health.
- Document the file surfaces for each probe so follow-up PRs can add guards without wandering outside the Dreamdust stage and ink subsystems.
- Tie every probe to a concrete Acceptance Key so regression evidence can be collected with the existing console log audit pipeline.

## Probe matrix

| Probe | Runtime validation | Implementation surface(s) | Acceptance Keys |
| --- | --- | --- | --- |
| Ink binding probe | Confirm `updateInkTexture(tex)` binds a texture with dimensions and `needsUpdate=true` the first time Dreamdust consumes ink. | `app/components/PointCloudStage.tsx` (`InkSurface.onTexture` path) and `app/components/dreamdust/useDreamdustUniforms.ts` (`updateInkTexture`). | **AK-DD-07 — Ink Texture Bind** (new): `[Dreamdust] ink-tex bind { width: <w>, height: <h>, needsUpdate: true }` (one-shot). |
| UV normalization probe | Detect any pointer UV outside `[0,1]` or mirror state mismatch before ink writes to the DataTexture. | `app/components/dreamdust/InkSurface.tsx` (raw client→UV mapping) plus `app/components/PointCloudStage.tsx` (mirror toggles). | **AK-DD-08 — Ink UV Guard** (new): either `[PC] ink-uv guard ok { mirrored: ... }` once per session or `[PC] ink-uv guard violation { ... }` on breach. |
| Caps source-of-truth | Ensure the `[dreamdust] caps` payload remains the single frozen source read by the provider, HUD, and material consumers. | `app/components/PointCloudStage.tsx` (caps acquisition), `app/components/dreamdust/context.tsx` (provider state), `app/components/dreamdust/InkFieldHost.tsx` (HUD sync), and `app/components/dreamdust/metrics.ts` (log registry). | **AK-DD-09 — Caps Fan-Out** (new): `[dreamdust] caps-fanout { stage: true, provider: true, hud: true, metrics: true }` emitted once after caps hydrate. |
| Watchdog behavior | Verify the shader compile watchdog fires a single timeout log (after ~3 s) before falling back, and stays silent otherwise. | `app/components/PointCloudStage.tsx` (compile watchdog effect). | **AK-DD-06 — Fallback Guard** (existing): absence of `[Dreamdust] compile timeout — falling back to PointsMaterial`; single appearance only when fallback is engaged. |

## Probe details

### Ink binding probe
**Diagnostic objective.** The first ink stroke should prove the stage is consuming the canvas-backed DataTexture, so capture the actual texture dimensions and the `needsUpdate` flag right after `updateInkTexture(tex)` is invoked inside `PointCloudStage`'s `onTexture` handler. Pair that with a guard in `useDreamdustUniforms.updateInkTexture` to detect null/undefined textures that would leave `uInkTex.value` stale.

**Acceptance Keys.**
- **AK-DD-07 — Ink Texture Bind**: emit `[Dreamdust] ink-tex bind { width: <number>, height: <number>, needsUpdate: true }` exactly once per session when the first non-null texture is pushed through. Treat any `needsUpdate=false` or missing `image` payload as a regression.

**File targets.**
- `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx` — wrap the existing `updateInkTexture(tex)` call within `InkSurface`'s `onTexture` callback (the block currently logging `"[PC] ink tex updated"`).
- `apps/cryptiq-mindmap-demo/app/components/dreamdust/useDreamdustUniforms.ts` — extend `updateInkTexture` so it verifies `uniforms.uInkTex.value` identity and exposes the `needsUpdate` status used in the log.

**Design notes → tiny PR tasks.**
- Touch `PointCloudStage.tsx`: replace the ad-hoc `"[PC] ink tex updated"` log with a one-shot helper that inspects `tex.image` and `tex.needsUpdate`, then prints the `AK-DD-07` payload after delegating to `updateInkTexture(tex)`.
- Touch `useDreamdustUniforms.ts`: guard against `null` textures by resetting the uniform to `null`, and expose a lightweight helper (or inline check) that reports the bound `uniforms.uInkTex.value?.image` to the stage logger.
- **Rollback note:** revert the new helper/log call and restore the previous console log to undo the probe without affecting ink binding behavior.

### UV normalization probe
**Diagnostic objective.** Pointer-to-UV normalization happens in `InkSurface.drawAtClient`, but clamps may hide UVs leaking outside `[0,1]` or mismatched mirror toggles from the stage (`ui.mirrorLR`/`ui.mirrorUD`). Instrument this path to log the raw (pre-clamp) UV values, raise a violation when they overshoot by more than ~0.5%, and confirm the mirror settings match the stage orientation at least once.

**Acceptance Keys.**
- **AK-DD-08 — Ink UV Guard**: emit `[PC] ink-uv guard ok { raw: [u,v], clamped: [u,v], mirror: { lr: <bool>, ud: <bool> } }` once when the first stroke completes with normalized UVs; switch to `[PC] ink-uv guard violation { … }` if a breach is detected (should remain absent during healthy runs).

**File targets.**
- `apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx` — capture the raw UV before `clamp01` and compare against the clamped values.
- `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx` — surface the current `ui.mirrorLR` / `ui.mirrorUD` state so the guard can include the mirror orientation in the payload (e.g., via context or a shared ref).

**Design notes → tiny PR tasks.**
- Touch `InkSurface.tsx`: introduce a module-level `logUvGuardOnce` that records the first normalized stroke, logging the raw vs clamped UV tuple and flagging any out-of-range input.
- Touch `PointCloudStage.tsx`: pass the mirror flags into `InkSurface` (or expose them via context) so the guard can validate orientation consistency in the same payload.
- **Rollback note:** remove the guard helper and mirror prop/context plumbing to return to the prior clamp-only behavior.

### Caps source-of-truth probe
**Diagnostic objective.** The `[dreamdust] caps` one-shot originates in `PointCloudStage.onCreated`, yet multiple consumers (provider, HUD, metrics) rely on that state. Add an identity check that freezes the caps snapshot and verifies every consumer is reading the same object reference (or serialized payload) before continuing.

**Acceptance Keys.**
- **AK-DD-09 — Caps Fan-Out**: emit `[dreamdust] caps-fanout { stage: true, provider: true, hud: true, metrics: true }` once, immediately after the existing `[dreamdust] caps { … }` log, confirming each consumer saw the same frozen payload.

**File targets.**
- `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx` — freeze the caps snapshot and stash it in context/state for downstream checks.
- `apps/cryptiq-mindmap-demo/app/components/dreamdust/context.tsx` — ensure `DreamdustProvider` stores the shared caps reference without cloning.
- `apps/cryptiq-mindmap-demo/app/components/dreamdust/InkFieldHost.tsx` — report when the HUD reads the caps-driven `vertexInkOk` so the probe can confirm parity.
- `apps/cryptiq-mindmap-demo/app/components/dreamdust/metrics.ts` — expose a read-only getter so the metrics module can affirm it is consuming the same payload.

**Design notes → tiny PR tasks.**
- Touch `PointCloudStage.tsx`: freeze the caps object (`Object.freeze`) before logging, store it in a ref, and emit the `AK-DD-09` payload once all consumers acknowledge receipt.
- Touch `context.tsx` & `InkFieldHost.tsx`: add lightweight callbacks/refs that notify the stage when their `vertexInkOk` view changes, feeding into the fan-out confirmation.
- Touch `metrics.ts`: add a getter or subscription that reports consumption of the frozen caps payload back to the stage logger.
- **Rollback note:** remove the freeze/ack plumbing and delete the fan-out log to restore the original single `[dreamdust] caps` emission.

### Watchdog behavior probe
**Diagnostic objective.** The existing watchdog in `PointCloudStage` waits 180 frames (~3 s at 60 FPS) before logging `[Dreamdust] compile timeout — falling back to PointsMaterial`. Strengthen it by preventing repeat scheduling after fallback and by wrapping the log in a one-shot guard that plays nicely with the Acceptance Key contract.

**Acceptance Keys.**
- **AK-DD-06 — Fallback Guard** (existing): continue to treat the absence of the timeout log as the healthy case; ensure a triggered fallback logs exactly once before swapping materials.

**File targets.**
- `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx` — the compile watchdog effect (`MAX_FRAMES = 180`) controlling fallback activation and logging.

**Design notes → tiny PR tasks.**
- Touch `PointCloudStage.tsx`: gate the watchdog log with `logOnce('compile-timeout', …)` (or an equivalent ref) so multiple renders cannot spam the console, and cancel the RAF loop immediately after timeout or success.
- Add a unit/smoke test hook (optional) to assert the watchdog sets `useFallback` when the program remains invalid for ~3 s without re-arming itself.
- **Rollback note:** remove the one-shot guard and reinstate the prior plain `console.log` if the watchdog probe needs to be disabled.

## Acceptance Key registration checklist
- Append **AK-DD-07**, **AK-DD-08**, and **AK-DD-09** to `2025-09-20-acceptance-keys.md`, noting the expected payload shape and one-shot policy alongside the existing Dreamdust keys.
- Update the deterministic test protocol to mention the new guard logs (where applicable) once implementation lands, ensuring evidence capture covers each Acceptance Key.
