# Baseline Smoke Screen Tests

Last Updated: 2:00 AM EST, 25/07/2025

## Context

- Branch: `replace-interaction-with-store`
- Commit: 63c2454e
- Browser: Chrome Incognito 138.0.7204.169 (arm64)
- Key Change: Commit Message - "docs: update scratchpad with resolution implementation details"

## Test 1 - Do Nothing

### Process

1. CD @ workplace root ➜ `rm -rf node_modules/.cache .turbo .next`
2. `pnpm dev --filter cryptic-vault-demo` ➜ wait for “Ready in 5 s”.
3. Incognito tab ➜ load `http://localhost:3000`.
4. Keep cursor out of viewport and do **nothing** for 5 s.
5. Copy Console Log below.
6. Write down observations.

### Observation (Chronological)

1. On initial load: the viewport contains the HUD UI and the background of the graph/scene
2. The console log seems to be firing regularly until the browser debugger triggers, **pausing on line 214 of CrypticAnimusScene.tsx**
3. The nodes are not visible, they do not appear prior to the pause

### Console Log Snippet

```
Navigated to http://localhost:3000/
main-app.js?v=1753423160327:2314 Download the React DevTools for a better development experience: https://react.dev/link/react-devtools
scheduler.development.js:14 [Violation] 'message' handler took 251ms
[Violation] Forced reflow while executing JavaScript took 52ms
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 213/213 nodes in sphere pattern (radius: 299)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 213/213 nodes in sphere pattern (radius: 299)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T05:59:30.946Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T05:59:30.947Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:144 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:176 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:144 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:176 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:144 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:176 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:144 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:176 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:144 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:176 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:144 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:176 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:144 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:176 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:144 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:176 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:144 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:176 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [CrypticAnimusScene] Configuring physics forces!
CrypticAnimusScene.tsx:182 FG ref {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
CrypticAnimusScene.tsx:184 [Window FG] window.__FG assigned successfully
CrypticAnimusScene.tsx:189 [REHEAT] Initial d3ReheatSimulation called
CrypticAnimusScene.tsx:196 [TICKS] Starting forced tick execution...
CrypticAnimusScene.tsx:203 [TICKS] Executed 300 ticks successfully (target: 300)
CrypticAnimusScene.tsx:206 [SIMULATION] Testing if forces are applied...
CrypticAnimusScene.tsx:210 [FORCES] link: true charge: true center: true
CrypticAnimusScene.tsx:213 [Debug] graphData type: undefined
```
