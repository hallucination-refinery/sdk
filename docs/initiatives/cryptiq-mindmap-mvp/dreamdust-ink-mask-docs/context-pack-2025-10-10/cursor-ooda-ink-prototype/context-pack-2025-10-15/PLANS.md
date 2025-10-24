# Dreamdust Ink — Pre-Smoke BULLETPROOF Plan (Context Pack 2025-10-15)

<!-- DD-PLAN:BEGIN:PURPOSE -->
## 1) Purpose & Desired End State
Deliver the Dreamdust ink interaction defined in `01-vision-and-acceptance.md`: particles must be plainly visible, respond to touch within at most two frames, stay locally constrained, and leave camera and shader diagnostics clean so production teams can sign off with confidence.
<!-- DD-PLAN:END:PURPOSE -->

<!-- DD-PLAN:BEGIN:CURRENT_EVIDENCE -->
## 2) Current Evidence (latest & verifiable)
- `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/console/37fab223/docs/ink-falloff-flag-latch-2025-10-12/20251024-200740/console-mcp.json:74,214` (commit `cb90ae8f`, 2025-10-24T20:07Z) — `[PC] material-defines {"vertexInkOk":false,"useVertexInk":false,"useVelocityDisp":false,...}` at line `74`; `[PC] render-timeout {framesWaited: 60,...}` and `[PC] render-info {calls: 0, points: 0,...}` at lines `209-214`; **no** `[PC] render-list snapshot|render-list empty`, `points-before/after-render`, or `render-pass begin/end`.
- `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/assets/37fab223/docs/ink-falloff-flag-latch-2025-10-12/20251024-200740/2025-10-24-forceVisible-mcp-debug.png` — MCP screenshot for the same run shows UI but no Dreamdust particles, matching zero-draw metrics.
- `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/assets/37fab223/docs/ink-falloff-flag-latch-2025-10-12/20251024-201106/ink-playwright-failed-{1,2}.png` — Playwright smoke timed out (60 s) without diagnostics; no Playwright console JSON was captured for run `20251024-201106`.
- `console/manual-dev-20251024/console-manual-dev.txt:19-58` (commit `34645725`, 2025-10-24T05:10Z) reiterates `[PC] material-defines … useVelocityDisp:false`, `[PC] render-timeout`, and `[PC] render-info {calls: 0}` under manual dev server; the diagnostic set mirrors the MCP capture.
- `console/manual-prod-20251024/console-manual-prod.txt:1-3` logs the Node 20 production build segfault with `NEXT_DISABLE_LIGHTNINGCSS=1`; no production console artifacts exist yet.
<!-- DD-PLAN:END:CURRENT_EVIDENCE -->

<!-- DD-PLAN:BEGIN:PRECONDITIONS -->
## 3) Preconditions for Next Smoke (hard gates)
- **Environment** — Use Node ≥18.18 (target 20.x LTS), `nvm use 20`, and `pnpm install --frozen-lockfile`; start from a clean `.next` cache.
- **Debug gate** — Dreamdust debug behaviour must enable when either `NEXT_PUBLIC_DREAMDUST_DEBUG=1` (build-time) **or** `?ddDebug=1` (runtime) is present; plan logs must confirm both signals.
- **Instrumentation** — When debug is active, capture `[PC] ddDebug`, `[PC] render-info`, `[PC] render-timeout`, `[PC] render-list guard-state`, `[PC] render-list snapshot|render-list empty`, `[PC] points-before-render`, `[PC] points-after-render`, `[PC] render-pass begin`, `[PC] render-pass end`, `[PC] renderer-render-pass`, and `[PC] sentinel-points` (if sentinel enabled).
- **Evidence directories** — Pre-create `docs/.../console/${COMMIT}/${BRANCH}/${RUN_ID}/` and `docs/.../assets/${COMMIT}/${BRANCH}/${RUN_ID}/`; use `RUN_ID=$(date -u +%Y%m%d-%H%M%S)` and include build/runtime command log in the eventual commit message body.
<!-- DD-PLAN:END:PRECONDITIONS -->

<!-- DD-PLAN:BEGIN:HYPOTHESES -->
## 4) Root-Cause Hypotheses & Falsifiers
- **H1 – Debug flag never reaches browser** → falsify by logging `[PC] ddDebug { env, query, effective }` once on mount and observing it in the next console capture.
- **H2 – Velocity override overwritten after define sync** → falsify by confirming `[PC] points-before-render` reports `useVelocityDisp: true`; if false, defines are being cleared post-sync.
- **H3 – Render list getter never invoked** → falsify through a `[PC] render-list snapshot` within the first two frames; absence means `renderLists.get` patch still not executed.
- **H4 – Shader program never recompiles with forced define** → falsify by inspecting `[PC] points-program-state { compiled: true, materialVersion: > previous }` after override lands.
- **H5 – Capability mismatch blocks override** → falsify by comparing `renderer-capabilities.maxVertexTextures` (16 vs 32); if override succeeds only with ≥32, hardware gating is the blocker.
<!-- DD-PLAN:END:HYPOTHESES -->

<!-- DD-PLAN:BEGIN:PROPOSED_PATCHES -->
## 5) Proposed Patches (do **not** apply now)
Implement each patch with debug guards, then run lint/build/smoke **after** landing them. Every snippet is paired with rollback guidance and risk notes.

### 5.1 Debug Flag Proof (`PointCloudStage.tsx`)
```diff
@@
-  const dreamdustDebugRef = React.useRef(DREAMDUST_DEBUG_ENV)
+  const dreamdustDebugRef = React.useRef(DREAMDUST_DEBUG_ENV)
+  const dreamdustDebugLogRef = React.useRef(false)
@@
-    if (debugParam === '1') {
-      setDreamdustDebug(true)
-    } else if (debugParam === '0') {
-      setDreamdustDebug(false)
-    }
+    const queryEnabled = debugParam === '1'
+    const effectiveDebug = DREAMDUST_DEBUG_ENV || queryEnabled
+    if (effectiveDebug !== dreamdustDebugRef.current) {
+      setDreamdustDebug(effectiveDebug)
+      dreamdustDebugRef.current = effectiveDebug
+    }
+    if (!dreamdustDebugLogRef.current) {
+      try {
+        console.info('[PC] ddDebug', {
+          env: DREAMDUST_DEBUG_ENV,
+          query: queryEnabled,
+          effective: effectiveDebug,
+          resolvedVertexInkOk: null, // runtimeCaps not available on first mount
+        })
+      } catch {
+        /* noop */
+      }
+      dreamdustDebugLogRef.current = true
+    }
  }, [])
```
Decisive observation: the draw-time probe (`[PC] points-before-render`) already logs the resolved material defines so future runs can confirm when `vertexInkOk` transitions.
### 5.2 Velocity Override — Last Write Wins (`DreamdustMaterial.ts`)
```diff
@@
-  syncLegacyVertexInkDefine(defines)
-  if (!resolved.vertexInkOk && DREAMDUST_DEBUG_FORCE_VELOCITY) {
-    defines.USE_VELOCITY_DISP = 1
-    defines.VERTEX_INK_OK = 0
-  }
+  syncLegacyVertexInkDefine(defines)
+  if (!resolved.vertexInkOk && DREAMDUST_DEBUG_FORCE_VELOCITY) {
+    defines.USE_VELOCITY_DISP = 1
+    defines.VERTEX_INK_OK = 0
+    material.needsUpdate = true
+    material.version = (material.version ?? 0) + 1
+  }
@@
-  syncLegacyVertexInkDefine((material as any).defines)
-  if (!resolved.vertexInkOk && DREAMDUST_DEBUG_FORCE_VELOCITY) {
-    (material as any).defines.USE_VELOCITY_DISP = 1
-    (material as any).defines.VERTEX_INK_OK = 0
-    material.needsUpdate = true
-    material.version = (material.version ?? 0) + 1
-  }
+  syncLegacyVertexInkDefine((material as any).defines)
+  if (!resolved.vertexInkOk && DREAMDUST_DEBUG_FORCE_VELOCITY) {
+    (material as any).defines.USE_VELOCITY_DISP = 1
+    (material as any).defines.VERTEX_INK_OK = 0
+    material.needsUpdate = true
+    material.version = (material.version ?? 0) + 1
+  }
```
### 5.3 Draw-Time Truth (`PointCloudStage.tsx`)
```diff
diff --git a/apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx b/apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
@@ -3669,9 +3669,24 @@ const beforeProbe = function pointsBeforeRenderProbe(
       if (!pointsBeforeRenderLoggedRef.current) {
         const layersMask = (this as any)?.layers?.mask ?? null
         try {
           console.info('[PC] points-visibility-state', {
             timestamp: Date.now(),
             renderOrder: this.renderOrder ?? null,
             visible: this.visible,
             frustumCulled: this.frustumCulled,
             layersMask,
           })
         } catch {
           /* noop */
         }
         try {
           console.info('[PC] points-before-render', {
             timestamp: Date.now(),
+            useVelocityDisp: !!((material as any)?.defines?.USE_VELOCITY_DISP),
+            vertexInkOkDefine: !!((material as any)?.defines?.VERTEX_INK_OK),
+            programCompiled: rendererArg?.properties?.get?.(material)?.program != null,
             renderOrder: this.renderOrder ?? null,
           })
         } catch {
           /* noop */
         }
@@ -3724,6 +3739,11 @@ const afterProbe = function pointsAfterRenderProbe(
             material: resolvedMaterial
               ? {
                   uuid: (resolvedMaterial as any).uuid ?? null,
                   blending: (resolvedMaterial as any).blending ?? null,
                   depthTest: (resolvedMaterial as any).depthTest ?? null,
                   depthWrite: (resolvedMaterial as any).depthWrite ?? null,
+                  useVelocityDisp:
+                    !!((resolvedMaterial as any)?.defines?.USE_VELOCITY_DISP ?? false),
                 }
               : null,
             attrCounts,
           })
```
Rollback:
```bash
git restore apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
```
Risk: Additional logs appear only once per run; negligible performance impact.

### 5.4 Render-List & Pass Instrumentation Hardening (`PointCloudStage.tsx`)
```diff
diff --git a/apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx b/apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
@@ -4084,7 +4084,9 @@ const logRenderListDetails = (
             if (!(renderLists as any).__originalGet) {
               const originalGet = renderLists.get.bind(renderLists)
               ;(renderLists as any).__originalGet = originalGet
               renderLists.get = function patchedRenderListsGet(scene: THREE.Scene, camera: THREE.Camera) {
                 const shouldLogFirst = !firstRenderListLogRef.current
-                const shouldLogFrame = !renderListLoggedRef.current && forceVisibleRef.current
+                const shouldLogFrame =
+                  !renderListLoggedRef.current &&
+                  (forceVisibleRef.current || dreamdustDebugRef.current)
                 if (dreamdustDebugRef.current && !renderListGuardLoggedRef.current) {
                   try {
                     console.info('[PC] render-list guard-state', {
                       forceVisible: forceVisibleRef.current,
                       shouldLogFirst,
@@ -4230,7 +4232,11 @@ gl.render = function patchedRender(scene: THREE.Scene, camera: THREE.Camera) {
               }
               const renderPassIndex = renderPassLogRef.current
-              const shouldLogRenderPass = renderPassIndex < RENDER_CALL_LOG_LIMIT
+              const shouldLogRenderPass =
+                renderPassIndex < RENDER_CALL_LOG_LIMIT ||
+                (dreamdustDebugRef.current && renderPassIndex < 2)
               if (shouldLogRenderPass) {
                 try {
                   console.info('[PC] render-pass begin', {
                     timestamp: Date.now(),
                     renderIndex: renderPassIndex,
```
Rollback:
```bash
git restore apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
```
Risk: Debug mode may produce up to two extra render-pass logs; production unaffected.

### 5.5 Minimal Non-Visual Sentinel (`PointCloudStage.tsx`)
```diff
diff --git a/apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx b/apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
@@ -1594,6 +1594,14 @@ export function PointCloudStage(props: PointCloudStageProps) {
   const [prebakedTransform, setPrebakedTransform] = React.useState<{
     center: [number, number, number]
     scale: number
     radius: number
     rotationQuat?: THREE.Quaternion
   } | null>(null)
+  const sentinelPoints = React.useMemo(() => {
+    const geometry = new THREE.BufferGeometry()
+    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3))
+    const material = new THREE.PointsMaterial({ size: 0.05, color: 0xffffff })
+    const points = new THREE.Points(geometry, material)
+    return points
+  }, [])
+  const sentinelLoggedRef = React.useRef(false)
@@ -1654,6 +1662,14 @@ export function PointCloudStage(props: PointCloudStageProps) {
   React.useEffect(() => {
     dreamdustDebugRef.current = dreamdustDebug
   }, [dreamdustDebug])
+  React.useEffect(() => {
+    if (!dreamdustDebugRef.current || sentinelLoggedRef.current) {
+      return
+    }
+    try {
+      console.info('[PC] sentinel-points', { uuid: sentinelPoints.uuid })
+    } catch { /* noop */ }
+    sentinelLoggedRef.current = true
+  }, [dreamdustDebug, sentinelPoints])
@@ -4442,6 +4458,9 @@ return (
         {(sceneId === 'scene-03' || !controlsOverride) && (
           <InkSurface
             mirrorLR={!!ui.mirrorLR}
             mirrorUD={!!ui.mirrorUD}
             onForceSample={applyTempForce}
             onForceSplat={(uv, radius, strength) => {
               console.log('[PC] fluid splat', { uv, radius, strength })
@@ -4562,6 +4581,9 @@ return (
         )}
+        {dreamdustDebugRef.current && <primitive object={sentinelPoints} />}
```
Rollback:
```bash
git restore apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
```
Risk: Adds a single-vertex debug-only points mesh; must be removed once real particles render.
<!-- DD-PLAN:END:PROPOSED_PATCHES -->

<!-- DD-PLAN:BEGIN:EVIDENCE_CONVENTIONS -->
## 6) Evidence & Artifact Conventions
- Use UTC run IDs: `RUN_ID=$(date -u +%Y%m%d-%H%M%S)`.
- Store console streams as `docs/.../console/${COMMIT}/${BRANCH}/${RUN_ID}/console-{mcp|manual|pw}.json` and screenshots in `docs/.../assets/${COMMIT}/${BRANCH}/${RUN_ID}/YYYY-MM-DD-${label}.png`.
- Capture build notes and environment in `docs/.../console/.../notes.md` when manual intervention (e.g., rebuild swc) occurs.
- Quick checks: `rg -n "\\[PC\\] render-info" console-mcp.json` for draw stats; `jq 'map(select(.text|test("\\\\[PC\\\\] ddDebug")))' console-mcp.json` to validate debug gating.
- On failure, archive the last 200 lines as `console/.../${RUN_ID}/console-tail.txt` plus any crash stack traces.
<!-- DD-PLAN:END:EVIDENCE_CONVENTIONS -->

<!-- DD-PLAN:BEGIN:RUNBOOK -->
## 7) Next Smoke Run — Operator/Agent Runbook
1. **Prep environment**  
   ```bash
   nvm use 20
   pnpm install --frozen-lockfile
   rm -rf apps/cryptiq-mindmap-demo/.next
   ```
2. **Build** — `NEXT_DISABLE_LIGHTNINGCSS=1 pnpm --filter cryptiq-mindmap-demo run build`; stop if crash persists and record `/tmp/build.log`.
3. **Launch dev server** — `NEXT_PUBLIC_DREAMDUST_DEBUG=1 pnpm --filter cryptiq-mindmap-demo run dev`.
4. **Visit route** — Browser to `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&forceVisible=1&ddDebug=1`.
5. **Verify console** — Within ≤2 frames expect `[PC] ddDebug`, `[PC] render-pass begin`, `[PC] render-list snapshot|render-list empty`, `[PC] points-before-render`, `[PC] points-after-render`, `[PC] renderer-render-pass`, and `[PC] render-info` with `calls >= 1`.
6. **Archive artifacts** — Capture full console stream (MCP helper or manual `tee`), plus screenshots before/after tap; save to `${RUN_ID}` directories.
7. **Automation (optional post-visual)** — `BASE_URL=http://127.0.0.1:3000 SMOKE_ROUTE="/quiz/archetype-v1?pc=scene-03&forceVisible=1&ddDebug=1" RUN_ID=${RUN_ID} ... pnpm exec playwright test tests/ink.smoke.spec.ts --reporter=line`.
8. **Failure stop** — If `render-info.calls` stays `0` after 60 frames or `[PC] ddDebug.effective` is `false`, halt, capture logs, and do not proceed to Playwright.
9. **Commit evidence** — `git add docs/.../console docs/.../assets` then `git commit -m "docs(ink): smoke ${RUN_ID} debug override probe"` including the executed commands and key log excerpts in the body.
<!-- DD-PLAN:END:RUNBOOK -->

<!-- DD-PLAN:BEGIN:ACCEPTANCE -->
## 8) Acceptance Criteria & Exit
- **Instrumentation ready** once a debug run records `[PC] ddDebug`, `[PC] render-list snapshot|render-list empty`, `[PC] points-before-render`, `[PC] points-after-render`, `[PC] render-pass begin/end`, and `[PC] render-info` with `calls >= 1`.
- **Smoke pass** when Playwright or MCP capture shows `render-info.calls >= 1`, `render-info.points > 0`, and the screenshot displays Dreamdust particles; cite console + screenshot paths and commit SHA here.
- **Smoke fail** if any required tag is missing or draw stats remain zero beyond the 60-frame timeout; document failure evidence (console + image paths) before further code changes.
<!-- DD-PLAN:END:ACCEPTANCE -->

<!-- DD-PLAN:BEGIN:RISKS -->
## 9) Risks/Unknowns & Mitigations
| Risk | Mitigation | Escalate When |
| --- | --- | --- |
| Node 20 build continues to segfault | Rebuild native deps (`pnpm rebuild @next/swc-cli lightningcss`) or temporarily pin Node 18.18 for smoke | Build fails twice after cache purge |
| Debug flag still false in browser | Inspect `process.env.NEXT_PUBLIC_DREAMDUST_DEBUG` in bundle, fall back to query param, and log both (include `resolvedVertexInkOk` in the `[PC] ddDebug` payload) | `[PC] ddDebug.effective` remains `false` after restart |
| Render list logs remain absent | Force `logRenderListDetails` via new `shouldLogFrame` check; if still missing, capture stack or instrument `renderLists.get` entrypoint | No `[PC] render-list ...` after two frames |
| Sentinel leaks into prod | Keep sentinel behind debug flag and remove before release PR; add TODO comment if merged | QA reports stray white pixel in prod build |
| Playwright still times out | Reduce log noise (`RENDER_CALL_LOG_LIMIT`), capture only targeted tags, rerun manually first | Timeout repeats after instrumentation fix |
| Velocity override increments ambiguous | After applying patches, verify `material.version` increments only when `!resolved.vertexInkOk`; document findings in console log | Version increments without corresponding override or fails to increment when override applied |
<!-- DD-PLAN:END:RISKS -->

<!-- DD-PLAN:BEGIN:CHECKLIST -->
## 10) Progress Checklist & Change Log
- [ ] Node runtime >=18.18 (target 20.x) verified before smoke (`node -v`)
- [ ] `NEXT_PUBLIC_DREAMDUST_DEBUG=1` env or `?ddDebug=1` query activates debug in browser
- [ ] `[PC] ddDebug` logs `{env, query, effective, resolvedVertexInkOk}` on first mount
- [ ] Velocity override sets `USE_VELOCITY_DISP=1` after every `syncLegacyVertexInkDefine` call
- [ ] `material.needsUpdate = true` and `material.version++` applied whenever override fires
- [ ] `[PC] points-before-render` captures final `useVelocityDisp` / program state
- [ ] `[PC] render-list snapshot|render-list empty` emitted within first two frames
- [ ] `[PC] render-info` reports `calls >= 1` and `points > 0` (pass gate)
- [ ] Console + assets archived to `docs/.../console|assets/${COMMIT}/${BRANCH}/${RUN_ID}/`
- [ ] Failures archive last 200 log lines and shader errors before rerun

### Change Log
- 2025-10-24 — Locked pre-smoke BULLETPROOF plan (commit pending on branch `docs/ink-falloff-flag-latch-2025-10-12`).
- (Slot) — Next evidence capture →
- (Slot) — Instrumentation removal / cleanup →
<!-- DD-PLAN:END:CHECKLIST -->
