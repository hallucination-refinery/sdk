# Baseline Smoke Screen Tests

Last Updated: 4:53 PM EST, 24/07/2025

## Context

- Branch: `replace-interaction-with-store`
- Commit: f56470f4
- Browser: Chrome Incognito 138.0.7204.169 (arm64)
- Key Change: Link-force is back on, but the node-freeze bug should stay gone—the global Object.freeze patch and cooldownTime={Infinity} safeguards are untouched.

## Test 1 - Do Nothing

### Process

1. CD @ workplace root ➜ `rm -rf node_modules/.cache .turbo .next`
2. `pnpm dev --filter cryptic-vault-demo` ➜ wait for “Ready in 2.6s”.
3. Incognito tab ➜ load `http://localhost:3000`.
4. Keep cursor out of viewport and do **nothing** for 5 s.
5. Copy Console Log below.
6. Run `window.__FG?.d3Alpha?.()` ➜ note value below.
7. Write down observations.

### Observation (Chronological)

1. On initial load: A dense cluster of large, differently-coloured circles fills the entire viewport, touching and heavily overlapping but **not** sharing a single exact centre point.
2. Bold node labels stack over one another in various positions within the cluster, creating an unreadable mosaic of black text.
3. A mesh of grey link lines criss-crosses the overlapped discs, leaving no clear gaps between individual nodes.

### Console Log

```text
main-app.js?v=1753390822081:2314 Download the React DevTools for a better development experience: https://react.dev/link/react-devtools
CrypticAnimusScene.tsx:98 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:98 [Animus] render ForceGraph3D
events-f681e724.esm.js:2271 [Violation] 'requestAnimationFrame' handler took 102ms
```

### d3Alpha Value

```
window.__FG?.d3Alpha?.()
undefined
```

## Test 2 - Hover & Zoom Out

### Process

1. CD @ workplace root ➜ `rm -rf node_modules/.cache .turbo .next`
2. `pnpm dev --filter cryptic-vault-demo` ➜ wait for “Ready in 2.6s”.
3. Incognito tab ➜ load `http://localhost:3000`.
4. Keep cursor out of viewport and do **nothing** for 5 s.
5. Move cursor into viewport and scroll to zoom out
6. Run `window.__FG?.d3Alpha?.()` ➜ note value below.
7. Write down observations.

### Observation (Chronological)

1. On initial load: A dense cluster of large, differently-coloured circles fills the entire viewport, touching and heavily overlapping but **not** sharing a single exact centre point.
2. Bold node labels stack over one another in various positions within the cluster, creating an unreadable mosaic of black text.
3. A mesh of grey link lines criss-crosses the overlapped discs, leaving no clear gaps between individual nodes.
4. Moving the cursor into the viewport inadvertently involved hovering over nodes, this seemed to trigger the following console logs:

```
[Animus] render ForceGraph3D
CrypticAnimusScene.tsx:98 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:104 [CrypticAnimusScene] Configuring physics forces!
CrypticAnimusScene.tsx:125 FG ref {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}d3Force: ƒ ()d3ReheatSimulation: ƒ ()emitParticle: ƒ ()getGraphBbox: ƒ ()refresh: ƒ ()resetCountdown: ƒ ()tickFrame: ƒ ()[[Prototype]]: Object
```

5. The nodes look exactly the same and have not moved at all.

### Console Log

```text
Navigated to http://localhost:3000/
main-app.js?v=1753391087740:2314 Download the React DevTools for a better development experience: https://react.dev/link/react-devtools
CrypticAnimusScene.tsx:98 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:98 [Animus] render ForceGraph3D
debounce.js:104 [Violation] 'setTimeout' handler took 73ms
events-f681e724.esm.js:2271 [Violation] 'requestAnimationFrame' handler took 151ms
CrypticAnimusScene.tsx:98 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:98 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:104 [CrypticAnimusScene] Configuring physics forces!
CrypticAnimusScene.tsx:125 FG ref {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}d3Force: ƒ ()d3ReheatSimulation: ƒ ()emitParticle: ƒ ()getGraphBbox: ƒ ()refresh: ƒ ()resetCountdown: ƒ ()tickFrame: ƒ ()[[Prototype]]: Object
```

### d3Alpha Value

```
window.__FG?.d3Alpha?.()
undefined
```
