# Baseline Smoke Screen Tests

Last Updated: 3:50 PM EST, 25/07/2025

## Context

- Branch: `replace-interaction-with-store`
- Commit: c4a43682
- Browser: Chrome Incognito 138.0.7204.169 (arm64)
- Key Change: Commit Message - "feat: add Phase 0 FREEZE-TEST instrumentation to diagnose node movement"

## Clarification on Intended Behavior (User Experience Perspective)

I have decided to clearly and concisely describe the intended behavior **from a user experience perspective.** Please carefully update your mental model before you continue to Test 1 and Test 2:

1. On initial load: The HUD UI appears and all nodes start ​co-located at the scene origin, then “burst” outward as the physics engine warms up. They drift until the layout stabilises; after this first settle the graph should not spontaneously explode again unless the user performs an action that explicitly re-heats the simulation (see #6).
2. On Hover: As the cursor passes over a node its visual state changes (e.g. glow, opacity, tooltip) to indicate focus; neighbouring links may be subtly emphasised. No new physics burst is triggered. Positions remain stable; only visual styles update. When the cursor leaves, styles revert.
3. Node Click / Selection: Clicking a node toggles it into a “selected” state:
   3.1 The node and all directly-connected edges highlight.
   3.2 A two-hop outline or context halo may appear to show related nodes.
   3.3 Clicking a different node transfers the highlight; clicking empty space clears it.
   3.4 Physics stays calm—the graph should not re-explode or significantly re-shuffle as a result of selection.
4. Timeline Scrubbing: Moving the time-slider hides or reveals nodes/links according to their timestamp.
   4.1 Visible items fade in/out smoothly; existing node positions are preserved where possible.
   4.2 No central burst or full simulation restart occurs during normal scrubbing.
5. Category / Filter Toggles: Toggling category check-boxes (or tag filters) shows/hides subsets of nodes.
   5.1 The remaining nodes maintain their current positions; hidden nodes are simply removed from rendering.
   5.2 Again, no physics reset or burst from centre is expected.
6. Lens Change (Causal ▸ Affinity ▸ Temporal): Switching the active “lens” swaps in an entirely different edge set and possibly node subset.
   6.1 A fresh physics run is intentional here: nodes collapse to the centre and burst outward to re-settle under the new force configuration.
   6.2 After this single, deliberate re-explosion the graph behaves as in cases #2-#5 until the user switches lenses again.

## Test 1 - Do Nothing

### Process

1. CD @ workplace root ➜ `rm -rf node_modules/.cache .turbo .next`
2. `pnpm dev --filter cryptic-vault-demo` ➜ wait for “Ready in 4.4 s”.
3. Incognito tab ➜ load `http://localhost:3000`.
4. Keep cursor out of viewport and do **nothing** for 5 s.
5. Copying the whole console log at that time
6. Clearly document observations

### Observation (Chronological)

1. On initial load: the HUD is visible and the screen shows evenly spaced, colored nodes connected by faint gray links—**no dense central clump.**
2. The force-graph physics **does seem to kick in**. While the nodes appear in their evenly spaced out position, they do seem to be moving.
3. Frame rate is **extremely low** (~1-2 FPS) which makes it hard to gauge. This low framerate is presumably, at least in part, due to the docker container we are using.
4. The console log seems to be firing regularly from the initial load and never stops.
5. The nodes also **do not seem to settle**, although it is unclear if this is a function of the low framerate

### Console Log

```
Navigated to http://localhost:3000/
main-app.js?v=1753472763671:2314 Download the React DevTools for a better development experience: https://react.dev/link/react-devtools
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 213/213 nodes in sphere pattern (radius: 299)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 213/213 nodes in sphere pattern (radius: 299)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T19:46:05.882Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:931 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T19:46:05.897Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:931 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: null}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: null}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:139 [FGAdapter] ref after mount: {current: {…}}
ForceGraphAdapter.tsx:141 [FGAdapter] ref.current: {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
ForceGraphAdapter.tsx:142 [FGAdapter] ref.current keys: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
ForceGraphAdapter.tsx:139 [FGAdapter] ref after mount: {current: {…}}
ForceGraphAdapter.tsx:141 [FGAdapter] ref.current: {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
ForceGraphAdapter.tsx:142 [FGAdapter] ref.current keys: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:156 [CrypticAnimusScene] Configuring physics forces!
events-f681e724.esm.js:2271 [Violation] 'requestAnimationFrame' handler took 125ms
CrypticAnimusScene.tsx:188 FG ref {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
CrypticAnimusScene.tsx:190 [Window FG] window.__FG assigned successfully
CrypticAnimusScene.tsx:207 [REHEAT] Initial d3ReheatSimulation called
CrypticAnimusScene.tsx:214 [TICKS] Starting forced tick execution...
CrypticAnimusScene.tsx:221 [TICKS] Executed 300 ticks successfully (target: 300)
CrypticAnimusScene.tsx:237 [SIMULATION] Testing if forces are applied...
CrypticAnimusScene.tsx:241 [FORCES] link: true charge: true center: true
CrypticAnimusScene.tsx:244 [Debug] window.__FG type: object
CrypticAnimusScene.tsx:245 [Debug] window.__FG has graphData method: false
CrypticAnimusScene.tsx:180 [Violation] 'setTimeout' handler took 3549ms
ForceGraphAdapter.tsx:146 [FGAdapter] ref.current after 1s: {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
ForceGraphAdapter.tsx:148 [FGAdapter] Has __kapsuleInstance? false
ForceGraphAdapter.tsx:149 [FGAdapter] Constructor: Object
ForceGraphAdapter.tsx:150 [FGAdapter] All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
ForceGraphAdapter.tsx:146 [FGAdapter] ref.current after 1s: {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
ForceGraphAdapter.tsx:148 [FGAdapter] Has __kapsuleInstance? false
ForceGraphAdapter.tsx:149 [FGAdapter] Constructor: Object
ForceGraphAdapter.tsx:150 [FGAdapter] All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:345 === PHASE 2: Ref Evolution at 100ms ===
CrypticAnimusScene.tsx:346 Direct keys count: 7
CrypticAnimusScene.tsx:347 Proto keys count: 0
CrypticAnimusScene.tsx:351 All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:356 d3Force("link") returns: ƒ force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
        link = links[i], source = link…
CrypticAnimusScene.tsx:357 Has .alpha() method? false
CrypticAnimusScene.tsx:345 === PHASE 2: Ref Evolution at 500ms ===
CrypticAnimusScene.tsx:346 Direct keys count: 7
CrypticAnimusScene.tsx:347 Proto keys count: 0
CrypticAnimusScene.tsx:351 All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:356 d3Force("link") returns: ƒ force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
        link = links[i], source = link…
CrypticAnimusScene.tsx:357 Has .alpha() method? false
```
