---
title: Latest Smoke Evidence – Prod URL (scene-03 forceVisible bypass)
date: 2025-10-21T21:45:42Z
tags: [evidence, smoke, prod, forceVisible, diagnostic, CRASH, portal-fix-failed]
commit: 7667d2bc
branch: docs/ink-falloff-flag-latch-2025-10-12
url: http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&forceVisible=1
---

Summary: MCP (`20251021-214542`) and Playwright smoke runs on commit `7667d2bc` (Portal fix attempt) **CRASHED** — the application failed with React error #130 and WebGL Context Lost. **FAIL (crash — Portal fix broke app)** — Build succeeded with warning: "'Portal' is not exported from '@react-three/fiber'". The Portal component does NOT exist in this version of R3F, causing runtime crash. Page shows "Something went wrong" error boundary. Playwright test FAILED (timeout 60s) waiting for logs that never came due to crash.

Build warning:
```
./app/components/PointCloudStage.tsx
Attempted import error: 'Portal' is not exported from '@react-three/fiber' (imported as 'Portal').
```

Key console lines (MCP — before crash):
- `[PC] forceVisible uniforms {uReveal: 1, uAlphaFloor: 1, uPointBaseSize: 8, uMinSize: 4, uMaxSize: 14}`
- `[PC] forceVisible applied {depthTest: TBD, depthWrite: TBD, blending: TBD, applied: false}`
- `[PC] prebaked positions {bytes: 2175600, count: 181300, sample: Array(6)}`
- `[PC] instances: 90650`
- `[vertex] stage data snapshot {simActive: false, stageUvDepthCount: 90650, stageUvCount: 181300}`
- **[ERROR] Error: Minified React error #130** ← **CRASH: Portal import failed**
- `[PC] render-list {pointsPresent: false, opaqueCount: 0, transparentCount: 0}` ← **Lists empty before crash**
- `[PC] renderer-render-pass {renderIndex: 0, sceneUuid: 59b68624..., sceneChildCount: 0, matchesRenderScene: null, cameraType: PerspectiveCamera}` ← **Only 1 render pass before crash, scene has 0 children**
- **[LOG] THREE.WebGLRenderer: Context Lost.** ← **WebGL crashed**

Playwright result:
- `BASE_URL=http://127.0.0.1:3000`
- `SMOKE_ROUTE=/quiz/archetype-v1?pc=scene-03&forceVisible=1`
- `tests/ink.smoke.spec.ts` → **FAILED (timeout 60000ms)** — Test timed out waiting for logs; page crashed before logs could emit

Screenshots (MCP):
- `cursor-ooda-ink-prototype/assets/7667d2bc/docs/ink-falloff-flag-latch-2025-10-12/20251021-214542/2025-10-21-forceVisible-mcp-CRASH.png` (shows "Something went wrong" error boundary)

Console logs:
- MCP: `cursor-ooda-ink-prototype/console/7667d2bc/docs/ink-falloff-flag-latch-2025-10-12/20251021-214542/console-mcp.json` (partial, crash occurred)
- Playwright: NO ARTIFACTS (test failed, timeout)

Decision: **FAIL (crash — Portal fix broke app)** — Root cause analysis:
1. ❌ **Portal does NOT exist in @react-three/fiber** (this R3F version doesn't export it)
2. ❌ **React error #130** triggered when Portal import resolved to undefined
3. ❌ **WebGL Context Lost** as side-effect of crash
4. ❌ **Page crashed** showing error boundary
5. ❌ **Playwright test FAILED** with 60s timeout

**Critical insight**: The Portal approach was fundamentally flawed because Portal is not available in this R3F version (or requires different import path). The import warning during build confirmed this, and runtime crash proved it.

**Next action (Milestone 8 — REVISED)**: 
Revert Portal fix and use IMPERATIVE approach instead:
1. Get the actual render scene from R3F internals (not `useThree().scene`)
2. Use `useEffect` or `useLayoutEffect` to imperatively add Points mesh to render scene via `scene.add(stagePointsRef.current)`
3. Alternative: Use `useFrame` to access `state.scene` directly and add Points there
4. Final option: Investigate drei helpers or R3F patterns for scene attachment without Portal
