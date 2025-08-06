# Baseline Smoke Screen Tests

Last Updated: 3:45 PM EST, 06/08/2025

## Context

- Branch: `repro-fg-remount`
- Commit: f98a5f1c
- Browser: Chrome Incognito 138.0.7204.169 (arm64)
- Changes:
  - Added highlightNode(id) and selectNode(id, toggle) helpers to ForceGraphAdapter
  - Used React.useImperativeHandle to merge custom methods with existing ref API
  - Restored all click/hover handlers to use imperative methods
  - Removed all NO-OP comments
  - Kept all uiStore writes commented out to prevent remounts

## General Observations

_Not_ part of any smoke-screen test and unverifiable against console logs, these are the key observations:

1. All nodes and links _are visible_ if you zoom out and/or pan.
2. Timeline scrubber and category filters toggle visibility correctly.
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
2. The scene is running at **~71 FPS** counter top-left, and the HUD.

### Test 1: Full Console Log

```
Navigated to http://localhost:3000/
CrypticAnimusScene.tsx:159 [INIT POSITIONS] Spawned 213 nodes - mode: origin
CrypticAnimusScene.tsx:98 [GRAPH VERSION] Raw structure changed - updating ref. Nodes: 213 Links: 276
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 213
CrypticAnimusScene.tsx:204 [Physics config] Retry 1...
CrypticAnimusScene.tsx:245 [Window FG] Retry 1...
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
ForceGraphAdapter.tsx:145 [FGAdapter] ref.current keys: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']0: "emitParticle"1: "getGraphBbox"2: "d3ReheatSimulation"3: "d3Force"4: "resetCountdown"5: "tickFrame"6: "refresh"length: 7[[Prototype]]: Array(0)
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
CrypticAnimusScene.tsx:237 [Violation] 'setTimeout' handler took 230ms
events-f681e724.esm.js:2271 [Violation] 'requestAnimationFrame' handler took 58ms
events-f681e724.esm.js:2271 [Violation] 'requestAnimationFrame' handler took 62ms
```

## Test 2 - Hover & Click on Node -> Filter Tag On/Off -> Timeline Scrubber

### Test 2: Process

1. CD @ workplace root ➜ `rm -rf .next node_modules/.cache`
2. `NEXT_PUBLIC_DEBUG_GRAPH=false pnpm dev --filter cryptic-vault-demo` ➜ wait for “Ready in 1910ms”.
3. Incognito tab ➜ load `http://localhost:3000`.
4. Keep cursor out of viewport and do **nothing** for 5 s.
5. Move cursor into frame and then hover on/off one and then click.
6. Drag timeline scrubber to the begining
7. Switched from the Causal to the Affinity Lens
8. Copying the **console log**
9. Clearly document a chronological account

### Test 2: Chronological Account

1. On initial load: the HUD is visible, then, maybe 0.05 secs later (it's hard to say precisely), I see a yellow and green node, labeled "conflict" and "reassurance" respectively, drift into frame and settle down.
2. The scene is running at **~73 FPS** counter top-left, and the HUD.
3. I moved my cursor into the viewport and hovered on/off only the yellow node labelled "conflicts" quickly and then clicked, **the console log did not spam**
4. I then toggled the 'Catalyst' filter tag on and off, it toggled visibility of the yellow node labelled "conflicts" **as intended**
5. I then dragged the timeline scrubber to the earliest date, it toggled visibility **as intended**
6. I then switched from the Causal to the Affinity Lens, it **did not update the graph as intended**

### Test 2: Console Log Excerpt

```
Navigated to http://localhost:3000/
CrypticAnimusScene.tsx:159 [INIT POSITIONS] Spawned 213 nodes - mode: origin
CrypticAnimusScene.tsx:98 [GRAPH VERSION] Raw structure changed - updating ref. Nodes: 213 Links: 276
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 213
CrypticAnimusScene.tsx:204 [Physics config] Retry 1...
CrypticAnimusScene.tsx:245 [Window FG] Retry 1...
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
ForceGraphAdapter.tsx:145 [FGAdapter] ref.current keys: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']0: "emitParticle"1: "getGraphBbox"2: "d3ReheatSimulation"3: "d3Force"4: "resetCountdown"5: "tickFrame"6: "refresh"length: 7[[Prototype]]: Array(0)
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
CrypticAnimusScene.tsx:237 [Violation] 'setTimeout' handler took 230ms
events-f681e724.esm.js:2271 [Violation] 'requestAnimationFrame' handler took 58ms
events-f681e724.esm.js:2271 [Violation] 'requestAnimationFrame' handler took 62ms
events-f681e724.esm.js:2271 [Violation] 'requestAnimationFrame' handler took 53ms
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 211
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 206
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 202
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 199
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 192
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 183
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 176
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 164
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 159
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 156
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 151
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 146
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 138
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 132
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 127
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 116
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 108
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 96
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 87
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 81
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 73
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 62
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 54
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 47
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 42
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 38
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 27
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 19
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 12
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 4
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 12
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 15
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 23
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 27
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 30
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 33
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 38
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 42
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 47
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 51
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 54
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 58
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 62
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 66
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 70
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 73
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 81
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 87
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 138
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 151
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 164
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 183
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 199
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 213
```
