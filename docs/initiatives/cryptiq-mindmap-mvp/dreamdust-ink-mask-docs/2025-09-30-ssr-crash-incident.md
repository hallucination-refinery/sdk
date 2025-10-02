# SSR Crash Incident — 2025-09-30

## Summary

Server-side rendering (SSR) crash introduced in commit `2f71dac2` caused Next.js dev server to fail with "Empty reply from server" on all routes. Issue caused by moving telemetry collector initialization from `useEffect` (client-only lifecycle) to `useMemo` (render-phase hook that executes during SSR).

## Timeline

- **Before `d2ecb4f9`**: Working. Telemetry collector created inside `useEffect`.
- **Commit `2f71dac2`**: Broke. Moved collector creation to `useMemo` with `typeof window` guard.
- **Commit `25e4e795`**: Attempted fix with SSR guard — did not resolve issue.
- **Current state**: Server still crashes. `typeof window` check insufficient.

## Root Cause Analysis

### What Broke

**Before (working code in `d2ecb4f9`):**
```typescript
React.useEffect(() => {
  const points = stagePointsRef.current
  if (!points || !(points.material instanceof THREE.ShaderMaterial)) {
    return
  }
  if (!debugFlags.vertexLog) {
    return
  }
  const collector = createVertexTelemetryCollector()  // ✅ useEffect = client-only
  // ... setup onAfterRender hook ...
}, [debugFlags.vertexLog, ...])
```

**After (broken code in `2f71dac2`):**
```typescript
const telemetryCollector = React.useMemo(() => {
  if (debugVertexLog && typeof window !== 'undefined') {
    return createVertexTelemetryCollector()  // ❌ useMemo = runs during render (SSR)
  }
  return null
}, [debugVertexLog])
```

### Why It Crashes

1. **React Lifecycle Difference**:
   - `useEffect`: Runs **after mount** (client-side only, never on server)
   - `useMemo`: Runs **during render** (executes on server during SSR)

2. **The `typeof window` Guard Doesn't Help**:
   - React still **calls** the `useMemo` function on the server to compute initial value
   - The function body executes, evaluates the condition
   - Even though the condition returns `null`, React has already entered the function scope
   - If THREE.js has any module-level side effects, they trigger during SSR

3. **THREE.js Server Incompatibility**:
   - `vertexTelemetry.ts` imports `import * as THREE from 'three'`
   - THREE.js expects WebGL, canvas, and browser APIs
   - These don't exist on Node.js server
   - Server crashes when THREE.js code tries to access browser APIs

### Why Import Already Existed

The import statement `import { createVertexTelemetryCollector } from './dreamdust/telemetry'` was already present before changes. The previous code worked because:
- Import happens at module load (both client and server see it)
- But the **function call** only happened inside `useEffect`
- `useEffect` never runs on the server
- THREE.js initialization code never executed server-side

## What Changed

**Intent**: Make `window.vertexTelemetry` available immediately for harness checks without waiting for first render.

**Implementation**: Moved collector creation from `useEffect` to `useMemo` to compute value during render phase.

**Mistake**: `useMemo` runs during render, which happens on server. Moving from client-only lifecycle to render-phase lifecycle exposed server to THREE.js code.

## Resolution Required

Must move telemetry collector creation back to client-only lifecycle:

**Option 1**: Revert to `useEffect` pattern (original working code)
**Option 2**: Use `useState` + `useEffect` to set state after mount
**Option 3**: Dynamic import with `React.lazy()` or `next/dynamic` to prevent server-side module loading

The `typeof window` guard protects the **function call**, but not the **render-phase execution context** that React creates on the server.

## Files Affected

- `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx` (lines 1070-1077, 2248-2252)
- Impact: All Next.js routes return "Empty reply from server"
- Dev server crashes on startup when parsing component tree

## Evidence

```bash
# Working commit before changes
$ git show d2ecb4f9:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx | grep -A 10 "createVertexTelemetryCollector()"
# Shows: collector created inside useEffect

# Broken commit after changes
$ git diff d2ecb4f9..HEAD apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
# Shows: collector moved to useMemo
```

## Lesson

`'use client'` directive and `typeof window` checks do NOT prevent React hooks from executing during SSR. Only client-only lifecycles (`useEffect`, `useLayoutEffect`) guarantee client-side-only execution.
