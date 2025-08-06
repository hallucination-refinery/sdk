# Baseline Smoke Screen Tests

Last Updated: 10:06 AM EST, 06/08/2025

## Context

- Branch: `repro-fg-remount`
- Commit: 24eb5624
- Browser: Chrome Incognito 138.0.7204.169 (arm64)
- Message: "fix: defer ui-slice state updates to prevent React render errors"
- Files changed: 2 (ui-slice.ts, ui-slice-refactor-scratchpad.md)

## General Observations

_Not_ part of any smoke-screen test and unverifiable against console logs, these are the key observations:

1. All nodes and links _are visible_ if you zoom out and/or panning.
2. Timeline scrubber and category filters toggle visibility correctly, using them triggers a console error at @packages/store/src/slices/ui-slice.ts line 72:

```
   Cannot update a component (`SceneContent`) while rendering a different component (`ForwardRef`). To locate the bad setState() call inside `ForwardRef`, follow the stack trace as described in https://react.dev/link/setstate-in-render
```

3. Switching lenses _does nothing_—graph stays static; physics never re-runs.
4. Hovering or clicking a node produces _no visual change_.

## Test 1 - Do Nothing

### Test 1: Process

1. CD @ workplace root ➜ `rm -rf .next node_modules/.cache`
2. `NEXT_PUBLIC_DEBUG_GRAPH=false pnpm dev --filter cryptic-vault-demo` ➜ wait for “Ready in 1910ms”.
3. Incognito tab ➜ load `http://localhost:3000`.
4. Keep cursor out of viewport and do **nothing** for 5 s.
5. Copying the whole console log at that time
6. Clearly document a chronological account

### Test 1: Chronological Account

1. On initial load: the HUD is visible, then, maybe 0.05 secs later (it's hard to say precisely), I see a yellow and green node, labeled "conflict" and "reassurance" respectively, drift into frame and settle down.
2. The scene is running at **~73 FPS** counter top-left, and the HUD.

### Test 1: Full Console Log

```
Navigated to http://localhost:3000/
CrypticVaultScene.tsx:168 [SceneContent] Transforming full graph - NO filtering. Nodes: 213
CrypticVaultScene.tsx:168 [SceneContent] Transforming full graph - NO filtering. Nodes: 213
CrypticAnimusScene.tsx:114 [CrypticAnimusScene] Memoizing graph data
CrypticAnimusScene.tsx:159 [INIT POSITIONS] Spawned 213 nodes - mode: origin
CrypticAnimusScene.tsx:114 [CrypticAnimusScene] Memoizing graph data
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:08:02.889Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:08:02.890Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:98 [GRAPH VERSION] Raw structure changed - updating ref. Nodes: 213 Links: 276
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 213
CrypticAnimusScene.tsx:204 [Physics config] Retry 1...
CrypticAnimusScene.tsx:245 [Window FG] Retry 1...
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: null}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:129 [ForceGraphAdapter] Creating safe data for version: 0
ForceGraphAdapter.tsx:129 [ForceGraphAdapter] Creating safe data for version: 0
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: null}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:142 [FGAdapter] ref after mount: {current: {…}}
ForceGraphAdapter.tsx:144 [FGAdapter] ref.current: {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
ForceGraphAdapter.tsx:145 [FGAdapter] ref.current keys: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
ForceGraphAdapter.tsx:146 [FGAdapter] Assigning window.__FG = ref.current
ForceGraphAdapter.tsx:148 [FGAdapter] window.__FG assigned successfully
ForceGraphAdapter.tsx:149 [CLAUDE] ready-for-smoke-screen
ForceGraphAdapter.tsx:162 [FGAdapter] Data changed, calling refresh() {nodeCount: 213, linkCount: 276}
ForceGraphAdapter.tsx:171 [FGAdapter] Called ref.current.refresh() successfully
ForceGraphAdapter.tsx:142 [FGAdapter] ref after mount: {current: {…}}
ForceGraphAdapter.tsx:144 [FGAdapter] ref.current: {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
ForceGraphAdapter.tsx:145 [FGAdapter] ref.current keys: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
ForceGraphAdapter.tsx:146 [FGAdapter] Assigning window.__FG = ref.current
ForceGraphAdapter.tsx:148 [FGAdapter] window.__FG assigned successfully
ForceGraphAdapter.tsx:149 [CLAUDE] ready-for-smoke-screen
ForceGraphAdapter.tsx:162 [FGAdapter] Data changed, calling refresh() {nodeCount: 213, linkCount: 276}
ForceGraphAdapter.tsx:171 [FGAdapter] Called ref.current.refresh() successfully
CrypticAnimusScene.tsx:210 [Physics config] Initialized successfully
CrypticAnimusScene.tsx:213 [CrypticAnimusScene] Configuring physics forces!
CrypticAnimusScene.tsx:289 [REHEAT] Initial d3ReheatSimulation called
CrypticAnimusScene.tsx:302 [TICKS] Starting forced tick execution...
CrypticAnimusScene.tsx:328 [TICKS] Executed 20 ticks successfully (target: 20)
CrypticAnimusScene.tsx:331 [SIMULATION] Testing if forces are applied...
CrypticAnimusScene.tsx:335 [FORCES] link: true charge: true center: true
CrypticAnimusScene.tsx:338 [Debug] window.__FG type: object
CrypticAnimusScene.tsx:339 [Debug] window.__FG has graphData method: false
CrypticAnimusScene.tsx:237 [Violation] 'setTimeout' handler took 247ms
```

## Test 2 - Hover on Node

### Test 2: Process

1. CD @ workplace root ➜ `rm -rf .next node_modules/.cache`
2. `NEXT_PUBLIC_DEBUG_GRAPH=false pnpm dev --filter cryptic-vault-demo` ➜ wait for “Ready in 1910ms”.
3. Incognito tab ➜ load `http://localhost:3000`.
4. Keep cursor out of viewport and do **nothing** for 5 s.
5. Move cursor into frame and then hover on/off one.
6. Copying a **representative console log excerpt** at that time
7. Clearly document a chronological account

### Test 2: Chronological Account

1. On initial load: the HUD is visible, then, maybe 0.05 secs later (it's hard to say precisely), I see a yellow and green node, labeled "conflict" and "reassurance" respectively, drift into frame and settle down.
2. The scene is running at **~73 FPS** counter top-left, and the HUD.
3. I moved my cursor into the viewport and hovered on/off only the yellow node labelled "conflicts" quickly, **the console log started firing like crazy and the dev tools window froze and then crashed**.

### Test 2: Console Log Excerpt

```
Navigated to http://localhost:3000/
CrypticVaultScene.tsx:168 [SceneContent] Transforming full graph - NO filtering. Nodes: 213
CrypticVaultScene.tsx:168 [SceneContent] Transforming full graph - NO filtering. Nodes: 213
CrypticAnimusScene.tsx:114 [CrypticAnimusScene] Memoizing graph data
CrypticAnimusScene.tsx:159 [INIT POSITIONS] Spawned 213 nodes - mode: origin
CrypticAnimusScene.tsx:114 [CrypticAnimusScene] Memoizing graph data
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:08:02.889Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:08:02.890Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:98 [GRAPH VERSION] Raw structure changed - updating ref. Nodes: 213 Links: 276
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 213
CrypticAnimusScene.tsx:204 [Physics config] Retry 1...
CrypticAnimusScene.tsx:245 [Window FG] Retry 1...
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: null}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:129 [ForceGraphAdapter] Creating safe data for version: 0
ForceGraphAdapter.tsx:129 [ForceGraphAdapter] Creating safe data for version: 0
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: null}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:142 [FGAdapter] ref after mount: {current: {…}}
ForceGraphAdapter.tsx:144 [FGAdapter] ref.current: {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
ForceGraphAdapter.tsx:145 [FGAdapter] ref.current keys: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
ForceGraphAdapter.tsx:146 [FGAdapter] Assigning window.**FG = ref.current
ForceGraphAdapter.tsx:148 [FGAdapter] window.**FG assigned successfully
ForceGraphAdapter.tsx:149 [CLAUDE] ready-for-smoke-screen
ForceGraphAdapter.tsx:162 [FGAdapter] Data changed, calling refresh() {nodeCount: 213, linkCount: 276}
ForceGraphAdapter.tsx:171 [FGAdapter] Called ref.current.refresh() successfully
ForceGraphAdapter.tsx:142 [FGAdapter] ref after mount: {current: {…}}
ForceGraphAdapter.tsx:144 [FGAdapter] ref.current: {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
ForceGraphAdapter.tsx:145 [FGAdapter] ref.current keys: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']0: "emitParticle"1: "getGraphBbox"2: "d3ReheatSimulation"3: "d3Force"4: "resetCountdown"5: "tickFrame"6: "refresh"length: 7[[Prototype]]: Array(0)
ForceGraphAdapter.tsx:146 [FGAdapter] Assigning window.**FG = ref.current
ForceGraphAdapter.tsx:148 [FGAdapter] window.**FG assigned successfully
ForceGraphAdapter.tsx:149 [CLAUDE] ready-for-smoke-screen
ForceGraphAdapter.tsx:162 [FGAdapter] Data changed, calling refresh() {nodeCount: 213, linkCount: 276}
ForceGraphAdapter.tsx:171 [FGAdapter] Called ref.current.refresh() successfully
CrypticAnimusScene.tsx:210 [Physics config] Initialized successfully
CrypticAnimusScene.tsx:213 [CrypticAnimusScene] Configuring physics forces!
CrypticAnimusScene.tsx:289 [REHEAT] Initial d3ReheatSimulation called
CrypticAnimusScene.tsx:302 [TICKS] Starting forced tick execution...
CrypticAnimusScene.tsx:328 [TICKS] Executed 20 ticks successfully (target: 20)
CrypticAnimusScene.tsx:331 [SIMULATION] Testing if forces are applied...
CrypticAnimusScene.tsx:335 [FORCES] link: true charge: true center: true
CrypticAnimusScene.tsx:338 [Debug] window.**FG type: object
CrypticAnimusScene.tsx:339 [Debug] window.**FG has graphData method: false
CrypticAnimusScene.tsx:237 [Violation] 'setTimeout' handler took 247ms
events-f681e724.esm.js:2271 [Violation] 'requestAnimationFrame' handler took 61ms
events-f681e724.esm.js:2271 [Violation] 'requestAnimationFrame' handler took 56ms
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.391Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.391Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.417Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.417Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.451Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.452Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.476Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.477Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.503Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.504Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.526Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.527Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.554Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.555Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.577Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.578Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.604Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.605Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.627Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.627Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.653Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.654Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.677Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.678Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.704Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.705Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.726Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.726Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.751Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.752Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.772Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.773Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.799Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:964 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-08-06T14:09:11.799Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined

```
