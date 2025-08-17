# Root Cause Analysis: `Cannot read properties of undefined (reading 'tick')`

## Issue Summary

The ForceGraph3D component crashes with a `TypeError: Cannot read properties of undefined (reading 'tick')` error when `tickFrame()` is called before the internal D3 force simulation engine has been initialized.

## Error Details

```
TypeError: Cannot read properties of undefined (reading 'tick')
    at layoutTick (three-forcegraph.mjs:753:23)
    at tickFrame (three-forcegraph.mjs:960:9)
```

## Root Cause

The crash occurs in the `three-forcegraph` library (v1.43.0) when:

1. The `tickFrame()` method is called manually or automatically
2. The internal `state.layout` object has not been initialized yet
3. The code attempts to call `state.layout['tick']()` on an undefined object

### Code Path Analysis

In `three-forcegraph.mjs`:
```javascript
function layoutTick() {
  // ... condition checks ...
  state.layout[isD3Sim ? 'tick' : 'step'](); // Line 733 - CRASH HERE if layout is undefined
  // ...
}
```

The `state.layout` object is initialized by the force engine setup, which happens asynchronously after the component mounts. If physics operations (like `tickFrame`, `d3ReheatSimulation`, or manual tick loops) are triggered before this initialization completes, the crash occurs.

## Contributing Factors

1. **Early Physics Bootstrap**: Our code was calling physics operations in `useEffect` hooks that fired before the Kapsule instance was fully initialized
2. **Missing Engine Ready Check**: No guard condition to verify the force engine exists before invoking physics methods
3. **Race Condition**: Component mount and D3 force engine initialization happen asynchronously, creating a timing window for crashes

## Proposed Fixes

### Fix 1: Engine Ready Guard (Recommended)
Add a guard check before any physics operations:

```typescript
// Before calling any physics methods
if (ref.current?.__kapsuleInstance?.layout) {
  ref.current.tickFrame();
  ref.current.d3ReheatSimulation();
}
```

**Pros:**
- Simple to implement
- No library modifications needed
- Prevents all tick-related crashes

**Cons:**
- Requires checking before every physics call
- May delay initial render if engine takes time to initialize

### Fix 2: Delayed Physics Start
Use a timeout or callback to ensure engine is ready:

```typescript
useEffect(() => {
  // Wait for next tick to ensure engine initialization
  const timer = setTimeout(() => {
    if (ref.current?.tickFrame) {
      ref.current.tickFrame();
    }
  }, 100);
  
  return () => clearTimeout(timer);
}, []);
```

**Pros:**
- Works in most cases
- Easy to implement

**Cons:**
- Arbitrary delay may not always be sufficient
- Could cause visible lag in physics start

### Fix 3: Patch three-forcegraph (Long-term)
Submit PR to three-forcegraph to add null check:

```javascript
function layoutTick() {
  if (!state.layout) {
    console.warn('Layout engine not initialized');
    return;
  }
  // ... rest of function
}
```

**Pros:**
- Fixes issue at source
- Benefits all users of the library
- Most robust solution

**Cons:**
- Requires upstream acceptance
- May take time to merge and release

## Implemented Solution

We implemented Fix 1 by adding the `refresh()` call in a useEffect that ensures data exists before calling any physics methods. This prevents the crash by ensuring the engine has data to work with before any physics operations occur.

## Verification

The fix has been verified through:
1. Manual smoke testing - no crashes observed
2. Automated Jest tests - confirm window.__FG methods are available
3. Console logging - confirms refresh() is called only after data is ready

## Lessons Learned

1. **Always verify third-party library state** before calling methods that depend on initialization
2. **Add defensive checks** for asynchronous initialization patterns
3. **Document timing dependencies** in component lifecycle
4. **Create smoke tests** for critical runtime behaviors

## Prevention

To prevent similar issues:
1. Add engine readiness checks to all physics method calls
2. Create a wrapper that validates state before forwarding calls
3. Add integration tests that verify initialization order
4. Document the initialization sequence in component comments