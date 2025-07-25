# Baseline Smoke Screen Tests

Last Updated: 12:30 AM EST, 25/07/2025

## Context

- Branch: `replace-interaction-with-store`
- Commit: 01bd1244
- Browser: Chrome Incognito 138.0.7204.169 (arm64)
- Key Change: Commit Message - "docs: complete investigation with root cause and fix"

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
2. Then the familar dense cluster of large, differently-coloured circles appears filling the entire viewport, touching and heavily overlapping but **not** sharing a single exact centre point.
3. Bold node labels stack over one another in various positions within the cluster, creating an unreadable mosaic of black text.
4. A mesh of grey link lines criss-crosses the overlapped discs, leaving no clear gaps between individual nodes.
5. The console log seems to be firing regularly until the browser debugger triggers, **pausing on line 167 of CrypticAnimusScene.tsx**

### Console Log Snippet

```
Navigated to http://localhost:3000/
main-app.js?v=1753417397706:2314 Download the React DevTools for a better development experience: https://react.dev/link/react-devtools
CrypticAnimusScene.tsx:98 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:101 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T04:23:19.172Z
CrypticAnimusScene.tsx:104 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:105 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:98 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:101 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T04:23:19.175Z
CrypticAnimusScene.tsx:104 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:105 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:111 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:143 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:111 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:143 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:111 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:143 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:117 [CrypticAnimusScene] Configuring physics forces!
CrypticAnimusScene.tsx:149 FG ref {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
CrypticAnimusScene.tsx:151 [Window FG] window.__FG assigned successfully
events-f681e724.esm.js:2271 [Violation] 'requestAnimationFrame' handler took 80ms
```
