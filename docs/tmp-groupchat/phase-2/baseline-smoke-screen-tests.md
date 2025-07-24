# Baseline Smoke Screen Tests

Last Updated: 4:53 PM EST, 24/07/2025

## Context

- Branch: `replace-interaction-with-store`
- Commit: 692b3c7f
- Browser: Chrome Incognito Version 138.0.7204.169 (Official Build) (arm64)
- Key Change & Expectation: Implement `useEffect(() => { if (fgRef.current) (window as any).__FG = fgRef.current })` in `CrypticAnimusScene.tsx`. Ref now exported—reload the demo, then run window.\_\_FG?.d3Alpha?.(); it should return a number.

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
Navigated to http://localhost:3000/
main-app.js?v=1753390404314:2314 Download the React DevTools for a better development experience: https://react.dev/link/react-devtools
CrypticAnimusScene.tsx:86 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:86 [Animus] render ForceGraph3D
events-f681e724.esm.js:2271 [Violation] 'requestAnimationFrame' handler took 50ms
debounce.js:104 [Violation] 'setTimeout' handler took 62ms
events-f681e724.esm.js:2271 [Violation] 'requestAnimationFrame' handler took 95ms
```

### d3Alpha Value

```
window.__FG?.d3Alpha?.()
undefined
```
