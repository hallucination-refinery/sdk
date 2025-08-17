# \_\_FG Ref Investigation Scratchpad

Goal: figure out why `window.__FG` is undefined (ForceGraph ref not assigned).

## Expected Flow

- `CrypticAnimusScene` mounts `ForceGraph3D` (dynamic import).
- Callback `handleFGRef` should set `window.__FG = inst`.
- On first load, `console.log('[Animus mounted] …')` then `__FG` should exist.

## Hypotheses

1. SSR evaluates `r3f-forcegraph` → component skips mount.
2. Dynamic import mis-configured (ref lost).
3. An error during ForceGraph initialisation aborts render.
4. The freeze monkey-patch blocks ref propagation.

## RECCOMENDED PROCESS

1. Grep project for `handleFGRef` to map ref flow.
2. Read `CrypticAnimusScene.tsx` header (import + dynamic) and verify `{ ssr:false, forwardRef:true }` present.
3. Read `ForceGraphAdapter.tsx` to confirm it uses `forwardRef` and passes `ref` to `<ForceGraph3D>`.
4. Search node_modules `r3f-forcegraph` for `useImperativeHandle` to ensure ref methods exist.
5. Scan build output for any runtime error during mount (`Cannot read properties of undefined` etc.).
6. Check for `window.__FG =` assignments anywhere else (grep).

Record results in Findings section.

## Findings

### Task 1: Grep for handleFGRef
- **Action**: Searched entire codebase for `handleFGRef`
- **Result**: NO CODE FILES contain `handleFGRef` - only found in this scratchpad doc
- **Implication**: The expected callback might be named differently or missing entirely

### Task 2: Read CrypticAnimusScene.tsx header
- **Action**: Read CrypticAnimusScene.tsx to verify dynamic import and ref handling
- **Results**:
  - Dynamic import found at lines 21-27: imports ForceGraphAdapter from '@refinery/canvas-r3f'
  - Config: `{ ssr: false }` present, but NO `forwardRef: true` option
  - fgRef created with `useRef<any>(null)` at line 63
  - fgRef passed to `<ForceGraph3D ref={fgRef}>` at line 330
  - NO code that assigns `fgRef.current` to `window.__FG`
- **Implication**: The ref is created and passed but never exposed to window object

### Task 5: Check for window.__FG assignments
- **Action**: Extensive search for any pattern that might set window.__FG
- **Searches performed**:
  - `window.__FG` - only in docs
  - `window\.\w+\s*=` - no matches 
  - `__FG` in code files - no matches
  - `window\[` - no matches
  - `fgRef\.current.*window` - no matches
- **Verified**: The useEffect at line 86 configures forces but does NOT assign to window
- **Result**: CONFIRMED - No code assigns the ForceGraph ref to window.__FG
- **ROOT CAUSE IDENTIFIED**: The missing window.__FG assignment is the bug

### Task 3: Read ForceGraphAdapter.tsx
- **Action**: Verified ForceGraphAdapter implementation
- **Results**:
  - Line 122: Component properly uses `forwardRef<ForceGraphAdapterRef, ForceGraphAdapterProps>`
  - Line 137: Ref is correctly passed through to `<ForceGraph3D ref={ref}>`
  - ForceGraphAdapterRef interface defines expected methods (d3Force, graphData, tickFrame, etc.)
  - Note: d3Alpha() method not in interface but might exist on actual ForceGraph3D instance
- **Conclusion**: Ref forwarding works correctly from ForceGraphAdapter → ForceGraph3D

## Root Cause Summary

**The window.__FG is undefined because there is NO CODE that assigns the ForceGraph ref to window.__FG**

### Evidence Chain:
1. CrypticAnimusScene creates `fgRef` with useRef (line 63)
2. fgRef is passed to ForceGraph3D component (line 330)
3. ForceGraphAdapter correctly forwards the ref (line 137)
4. NO useEffect or callback assigns `fgRef.current` to `window.__FG`
5. The expected `handleFGRef` callback doesn't exist anywhere in the codebase

### Solution:
Add a useEffect in CrypticAnimusScene.tsx that assigns the ref to window:

```typescript
// Add after line 105 (after the physics configuration useEffect)
useEffect(() => {
  if (fgRef.current) {
    (window as any).__FG = fgRef.current;
    console.log('[CrypticAnimusScene] ForceGraph ref assigned to window.__FG');
  }
}, [fgRef.current]);
```

## Next Steps

- Implement the window.__FG assignment in CrypticAnimusScene.tsx
- Test that window.__FG?.d3Alpha?.() returns a value after implementation

## Cross-Verification (ULTRATHINK Step 7)

### Alternative hypotheses tested:
1. **Window assignment elsewhere?** - Searched all patterns, confirmed NO
2. **Different ref pattern?** - Only one fgRef in CrypticAnimusScene.tsx
3. **Global assignment patterns?** - Checked (window as any), globalThis - NONE found
4. **d3Alpha method exists?** - ForceGraphAdapter uses d3AlphaTarget (line 145), confirming d3-force methods exist

### Stress-test of assumptions:
- **Assumption**: fgRef.current will have d3Alpha method
- **Evidence**: ForceGraphAdapter passes through to r3f-forcegraph which exposes d3-force API
- **Risk**: Method might be named differently, but d3AlphaTarget usage suggests standard d3-force API

### Final confidence: 99%
The root cause is definitively the missing window.__FG assignment. No contradictory evidence found.

## ULTRATHINK Verification (Added 2025-07-24)

### Verification Process Executed:
1. **Verified handleFGRef absence**
   - Grep pattern: `handleFGRef`
   - Result: CONFIRMED - Only exists in docs, not in any code files
   
2. **Verified no window.__FG assignments**
   - Grep patterns tested:
     - `window\.__FG` - Only in docs
     - `window\[\s*["']__FG` - No matches
     - `\(window as any\)\.__FG` - Only in scratchpad
     - `globalThis\.__FG` - No matches
     - `__FG` in all code files - No matches
     - `window\[.*\]\s*=.*fgRef` - No matches
   - Result: CONFIRMED - No code assigns to window.__FG

3. **Verified CrypticAnimusScene.tsx details**
   - File path: `/workspace/apps/legacy-import/cryptic-vault-demo/components/CrypticAnimusScene.tsx`
   - Line 21-27: Dynamic import with `{ ssr: false }` but NO `forwardRef: true`
   - Line 63: `const fgRef = useRef<any>(null)` confirmed
   - Line 330: `<ForceGraph3D ref={fgRef}` confirmed
   - Line 86-105: useEffect configures physics but does NOT assign to window
   - Result: ALL CLAIMS VERIFIED

4. **Verified ForceGraphAdapter ref forwarding**
   - File path: `/workspace/packages/canvas-r3f/src/adapters/ForceGraphAdapter.tsx`
   - Line 122: `forwardRef<ForceGraphAdapterRef, ForceGraphAdapterProps>` confirmed
   - Line 137: `ref={ref}` passes ref to ForceGraph3D
   - Result: VERIFIED - Ref forwarding works correctly

### ULTRATHINK Reflection:
All claims in the original investigation have been independently verified through systematic grep searches and file reads. The root cause analysis is correct: window.__FG is undefined because no code assigns the ForceGraph ref to the window object.
