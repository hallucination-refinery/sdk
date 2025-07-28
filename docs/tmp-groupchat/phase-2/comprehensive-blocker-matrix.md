# Comprehensive Blocker Matrix - replace-interaction-with-store → cryptic-vault-baseline Merge

Last Updated: 2025-07-28

## Executive Summary

The branch `replace-interaction-with-store` cannot be merged into `cryptic-vault-baseline` due to a cascade of bugs and regressions. While the @refinery/interaction → @refinery/store migration is functionally complete (has been for ~2 weeks), the branch has surfaced multiple critical issues preventing merge.

## Blocker Matrix

| Issue/Regression | Severity | Evidence (Specific Line References) | v6 Status | User Impact |
|-----------------|----------|-------------------------------------|-----------|-------------|
| **ForceGraph3D Component Remounts on Every Interaction** | CRITICAL | • baseline-smoke-screen-tests.md lines 452-457: `[FGAdapter] mounted` on hover<br>• lines 476-481: `[FGAdapter] mounted` on click<br>• lines 500-577: 38 remounts during timeline scrub<br>• Total: 98 `[FGAdapter] mounted` events in Test 2 | WORSENED | • Physics simulation resets on every interaction<br>• Node positions jolt/jump unpredictably<br>• Makes graph unusable for exploration |
| **No Visual Feedback on Hover** | CRITICAL | • align-graph-behavior-scratchpad.md line 51: "Hover logic not wired to material updates"<br>• line 93: "events not dispatched or material not reactive"<br>• baseline-smoke-screen-tests.md: No console logs for hover events<br>• groupchat-debate.md line 169: "broken interactions (no hover/click feedback)" | UNCHANGED | • Users cannot identify nodes under cursor<br>• No tooltip/glow/highlight on hover<br>• Core interaction paradigm broken |
| **No Visual Feedback on Click** | CRITICAL | • align-graph-behavior-scratchpad.md line 65: "Click toggles selection state" ❌<br>• baseline-smoke-screen-tests.md: Click causes remount but no selection<br>• groupchat-debate.md: "broken interactions" confirmed | UNCHANGED | • Cannot select nodes<br>• No highlight of connected edges<br>• Two-hop context halo non-functional |
| **Debugger Breakpoint in Production** | CRITICAL | • baseline-smoke-screen-tests.md lines 48-52: "Paused in debugger" at line 295<br>• line 56: `ReferenceError: simData is not defined`<br>• Blocks initial render until user manually continues | REDUCED | • Application freezes on load<br>• Requires manual intervention to proceed<br>• Completely breaks production deployment |
| **simData is not defined Error** | HIGH | • baseline-smoke-screen-tests.md lines 56-63: ReferenceError in setupWindowFG<br>• lines 140-143: Error persists after retry<br>• lines 233-235: Stack trace shows webpack error | UNCHANGED | • Console errors visible to users<br>• Next.js error overlay in development<br>• Potential functionality loss |
| **Extremely Poor Docker Performance** | HIGH | • align-graph-behavior-scratchpad.md line 73: "1-2 FPS"<br>• line 92: "Docker FPS ≈ 1‑2; host OK"<br>• groupchat-debate.md line 169: "unusable Docker performance (1-2 FPS)" | UNCHANGED | • Application unusable in containers<br>• CI/CD deployment impossible<br>• Development environment inconsistent |
| **Console Spam from Retry Mechanisms** | HIGH | • baseline-smoke-screen-tests.md lines 95-96: Retry spam starts immediately<br>• align-graph-behavior-scratchpad.md: "Retry‑spam in console"<br>• Multiple retry mechanisms without proper limits | REDUCED | • Performance degradation<br>• Log noise obscures real issues<br>• Memory leak potential |
| **Nodes Never Settle/Stabilize** | MEDIUM | • align-graph-behavior-scratchpad.md line 74: "Nodes never settle/stabilize"<br>• line 75: "Cannot inspect simulation state"<br>• Energy never reaches cooling threshold | UNCHANGED | • Constant motion distracts users<br>• Cannot establish stable layout<br>• Physics simulation runs indefinitely |
| **Sphere Spawn Instead of Origin Burst** | MEDIUM | • align-graph-behavior-scratchpad.md line 48: "Spawn still uses sphere workaround"<br>• line 77: "No burst animation (pre-positioned in sphere)"<br>• baseline-smoke-screen-tests.md line 73: Confirms origin spawn in v6 | RESOLVED | • Violates UX specification<br>• No dramatic burst effect<br>• Masks clumping issues |
| **Cannot Access Simulation State** | MEDIUM | • align-graph-behavior-scratchpad.md line 75: "Cannot inspect simulation state"<br>• line 94: "r3f wrapper hard‑caps to 7 public methods"<br>• No access to alpha() or graphData() | UNCHANGED | • Cannot debug physics issues<br>• Cannot implement energy-based features<br>• Limited extensibility |
| **Webpack Alias Still Present** | LOW | • align-graph-behavior-scratchpad.md line 78: "Webpack alias still present"<br>• Phase 2 requirement unfulfilled | UNCHANGED | • Technical debt<br>• Complicates build process<br>• Migration incomplete |
| **Performance Monitoring Violations** | LOW | • baseline-smoke-screen-tests.md lines 130-134: `'requestAnimationFrame' handler took <N>ms`<br>• Performance warnings throughout | UNCHANGED | • Frame drops during interactions<br>• Janky user experience<br>• Browser performance warnings |

## v6 Implementation Analysis

### What v6 Attempted to Fix:
1. **hasSpawnedRef** - Prevent re-initialization (line 81)
2. **Callback memoizations** - Stabilize function references
3. **Debug wrapping** - Hide console spam in production
4. **Retry limits** - Prevent infinite retry loops
5. **GraphVersion tracking** - Track structural changes only

### Why v6 Made Things WORSE:
1. **Fundamentally Wrong Approach**: v6 focused on prop stability/memoization when the actual issue is component lifecycle (unmounting/remounting)
2. **Introduced New Bugs**: 
   - hasSpawnedRef prevents new nodes from getting positions after initial spawn
   - Memoization with only `[graphVersion]` dependency can miss legitimate data updates
   - Debug flag doesn't remove the broken code, just hides it
3. **Didn't Address Root Causes**: Parent component instability, dynamic keys, conditional rendering remain unexamined

## Critical Path Analysis

Based on the evidence, the blocking issues in priority order:

1. **ForceGraph3D Remounts** (CRITICAL) - Makes all other fixes meaningless as state is lost on every interaction
2. **Interaction Feedback** (CRITICAL) - Core UX completely broken, users cannot interact with graph
3. **Debugger Breakpoint** (CRITICAL) - Prevents production deployment
4. **Docker Performance** (HIGH) - Blocks containerized deployment and CI/CD

## Recommended Next Steps

1. **REJECT v6 Implementation**: The approach is fundamentally flawed and makes the situation worse
2. **Root Cause Analysis**: Use React DevTools Profiler to identify why ForceGraph3D unmounts
3. **Fix Debugger Issue**: Remove the debug breakpoint code immediately (line 295)
4. **Implement Interactions**: Wire up hover/click handlers to material updates
5. **Profile Docker Performance**: Identify containerization-specific bottlenecks

## Conclusion

The branch cannot merge in its current state. The v6 "fix" has made the primary blocker (remounts) worse while failing to address any of the critical user-facing issues. A fundamentally different approach is required, starting with proper root cause analysis of the component lifecycle issues.

**Merge Readiness: 0/10** - Multiple CRITICAL blockers prevent any possibility of merge.