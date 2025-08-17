# Baseline Smokescreen

Updated: 12:28 PM EST 12-08-2025 (DD-MM-YYYY)

## Context

- Branch: `repro-fg-remount`
- Commit: 66c927c6
- Browser: Chrome Incognito 138.0.7204.169 (arm64)
- Changes:
  - Removed node_modules/caches and pruned pnpm store
  - Reinstalled all workspaces
  - Fixed selector compile error in apps/legacy-import/cryptic-vault-demo/store/selectors.ts
  - Launched dev server to proceed with the baseline smoke screen test
  - Understand the baseline as it stands to chart the best path forward

## Test

### Process

1.  CD @ workplace root ➜ `rm -rf .next node_modules/.cache`
2.  `NEXT_PUBLIC_DEBUG_GRAPH=false pnpm dev --filter cryptic-vault-demo` ➜ wait for “Ready in 2s”.
3.  Incognito tab ➜ load `http://localhost:3000`.
4.  Keep cursor out of viewport and do **nothing** for 5 s.
5.  Copy log _at initial load_ for reference.
6.  Proceed to Test and document chronological account, copying console log excerpts as needed.

### Chronological Account

1. On initial load: the HUD is visible, then, maybe 0.05 secs later (it's hard to say precisely), I see a number of green nodes and thin black links drift into frame from the left side of the viewport and settle down in the left half.
2. The scene is running at **~110 FPS** counter top-left, and the HUD. I copied the console log (see "Console Log (Initial Load)" section below)
3. **Hover ON/OFF Node:** Then I proceeded to click on the viewport and move cursor into frame and then hover _on and off_ a green node labelled "Maintain Relationship". There was _no visual feeback_ but the following _logs fired on hover:_

```
[PROPS] CrypticAnimusScene.handleNodeHover: {nodeId: 'c843d7870', hasRef: true, timestamp: 1755015028474}
CrypticAnimusScene.tsx:935 [PROPS] Calling imperative highlightNode: {nodeId: 'c843d7870'}
ForceGraphAdapter.tsx:167 [STYLE] ForceGraphAdapter.highlightNode called: {nodeId: 'c843d7870', timestamp: 1755015028475}
ForceGraphAdapter.tsx:173 [STYLE] highlightNode early return - no graphData
CrypticAnimusScene.tsx:940 [PROPS] Calling parent onNodeHoverProp handler: {nodeId: 'c843d7870'}
ui-slice.ts:145 [STORE] setHoverNode called: {nodeId: 'c843d7870', timestamp: 1755015028475}
ui-slice.ts:147 [STORE] setHoverNode executing in microtask: {nodeId: 'c843d7870'}
ui-slice.ts:152 [STORE] setHoverNode state updated: {before: null, after: 'c843d7870'}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015028489}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
```

4. **Hover On Node -> Click -> Hover Off Node:** I proceeded to rehover on and click the same green node labelled "Maintain Relationship". There was _no visual feeback_. **NOTE & CROSS-REFERENCE WITH 3. ABOVE:** There was _no_ console log that fired on rehover but the following console log fired _on click:_

```
CrypticAnimusScene.tsx:906 [PROPS] CrypticAnimusScene.handleNodeClick: {nodeId: 'c843d7870', hasRef: true, timestamp: 1755015273104}
CrypticAnimusScene.tsx:913 [PROPS] Calling imperative selectNode: {nodeId: 'c843d7870'}
ForceGraphAdapter.tsx:237 [STYLE] ForceGraphAdapter.selectNode called: {nodeId: 'c843d7870', toggle: true, timestamp: 1755015273104}
ForceGraphAdapter.tsx:244 [STYLE] selectNode early return - no graphData
CrypticAnimusScene.tsx:918 [PROPS] Calling parent onNodeClick handler: {nodeId: 'c843d7870'}
ui-slice.ts:72 [STORE] selectNodes called: {nodeIds: Array(1), mode: 'replace', timestamp: 1755015273105}
ui-slice.ts:74 [STORE] selectNodes executing in microtask: {nodeIds: Array(1), mode: 'replace'}
ui-slice.ts:92 [STORE] selectNodes state updated: {before: Array(0), after: Array(1)}
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: 'c843d7870', searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015273128}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(1), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015273139}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
```

5. **Timeline Scrubber - Click/Drag to June 18 -> Drag back to June 21:** I proceeded to move my cursor to the timeline scrubber.
   5.1 I clicked and dragged the slider to the earliest date, the visibility of the nodes/links _disappeared as expected_ and the console log _fired once for each date_, here is the console log that encompasses this _entire interaction:_

```
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 206
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015543844}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 195
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015543886}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 188
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015543931}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 183
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015543940}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 179
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015543966}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 171
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015543992}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 159
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544022}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 146
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544061}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 142
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544072}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 138
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544094}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 132
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544118}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 127
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544140}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 119
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544166}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 116
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544191}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 113
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544212}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 108
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544229}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 104
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544245}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 101
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544263}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 96
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544281}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 92
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544314}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 87
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544348}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 81
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544367}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 73
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544386}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 70
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544415}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 66
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544434}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 62
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544451}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 58
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544466}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 54
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544484}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 51
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544505}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 47
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544516}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 42
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544533}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 38
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544556}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 33
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544574}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 30
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544600}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 27
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544611}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 23
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544625}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 19
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544658}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 15
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544675}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 12
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544697}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 7
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544724}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 4
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015544747}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
```

5.2 I then dragged the console logs back to the latest date, Jun 21st. Visibility toggled and the logs fired in tandem. 6. **Lens Switcher - Causal -> Affinity:** I then proceeded to the Lens Switcher UI and clicked to switch to the Affinity lens. The nodes _remained stationary_ and the following logs fired:

```
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1755015862748}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
```

### Console Log (Initial Load)

Below is the browser console log _after initial load_ (i.e step 1. in the chronological account above):

```
Navigated to http://localhost:3000/
CrypticAnimusScene.tsx:171 [INIT POSITIONS] Spawned 213 nodes - mode: origin
CrypticAnimusScene.tsx:103 [GRAPH VERSION] Raw structure changed - updating ref. Nodes: 213 Links: 276
CrypticAnimusScene.tsx:116 [REMOUNT CHECK] graphDataRef updated, visibleIds: 213
CrypticAnimusScene.tsx:207 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
CrypticAnimusScene.tsx:239 [Physics config] Retry 1...
CrypticAnimusScene.tsx:280 [Window FG] Retry 1...
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c5c5cb290', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cfbf127ae', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cf2bbf5ec', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cdf8bdcca', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cdd55b905', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c843d7870', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ceaa7c88f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c79a9247e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c74ef33e8', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c652b607a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cc742484d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c8173ab2d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c85aa9c70', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c13cebb4a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c55ba44c5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c2800cc7f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cff1d4018', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ca59c85d0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c535c8110', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cbc52d6c2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c33ca164a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c6361cb4f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cef78a38b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cee11cbb1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ccffbc1ef', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cc4842cc4', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c74d36234', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cee99331f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cdd956ea1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c376b7f32', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c56eb31b9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cfb053573', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cedcb24bc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c7d7f4b95', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c2f12bdee', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c25d961aa', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c8e99e6ed', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c70b1c9bd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cccbea023', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c3a9984dd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c03a535e4', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cd163d4f3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cef22c14d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cb8c02222', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c4921c0e2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c5fc25157', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c972c97bd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c3851db91', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c8ae1016c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c56ab24c1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ce2fae53e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cc770fdb2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c7a55b332', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cf792d1af', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c82fb7647', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c8e7bbb6a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c0b006cd1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c00285b01', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c25890dea', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c6d98fb14', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cfb56812c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ca835c723', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c2241aef0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cb7331b23', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c83b96b4f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c9d0588aa', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c48a098c0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c27d54905', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c7301e7fb', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c434990c8', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cb5e4ead7', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cd36a7b45', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c60986435', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cad773eab', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ca5450742', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cd28770db', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c77ae9ae5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c5af9982f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cb39e5d5c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c3c02fcb3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ca41157d2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c7c99ba8b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c384aafcf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ca78bb5af', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ce8b72849', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ccdcf7310', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c9c9eb43c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c1a7a5d5d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ccf640cac', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c5047db93', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c869352a0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c1493cabc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c76a3bf25', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c3650d69a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c1f618a24', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c340cbdad', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ceb399bca', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cf738a9e1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ccf8292e9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c8ade5c49', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c3c259fef', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c5e2bab0e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c1f9db45c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c1e4ad5b4', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c9a1cd11b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cb4639457', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c17d356af', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cb71b3926', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cd305c2ff', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c4b721a70', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c657f8b8d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c0d25c673', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ce898d890', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c04efe311', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cd9f5bc4f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cfe17f210', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cd5b5d6d1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ce029d95e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cfdf1abed', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c2f075e79', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c1a54e072', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ccb2b2f6c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ceeb65581', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cb178b270', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ce0067c5c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cecee7df9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ccd81ff8f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ca9946b8d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cdacf98f1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c7873dac5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cececa383', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c3b0c869b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cc2bbbfee', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c9e36580a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c0492e1cf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cea0d59fe', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c1ac0d342', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ca3d2eb5a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cff96989a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c14952ea7', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c50976366', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c98df5000', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c906c3f65', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cfa52c07a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cceee4ce9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c0f7fb9ac', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c26769d05', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cf88d57e3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c3a56aefd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cd3af37c0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ce8a87cd1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cd3b05c25', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'caa5eb943', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cda217c26', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c4f1d1909', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ca0c391dc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cd25ec3ea', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ca53a1f2f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c96dcda94', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ced8ce15d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c7b48bdfa', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c88be5f44', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cea08be1c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c8ecfe6cf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c5855a307', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c6b48a717', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cc56234bf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c36965f1b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c365a170a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cb48197be', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c609144d7', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c1bd6aaf6', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c25a9ac40', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cfd668493', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c7859277f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cc65f5535', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c3e3245cc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cc6f0738f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ca611af7d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c12bc654f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cc47cce08', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ceb9d11e5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c09300fce', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c478deb51', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c1d3736ab', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c892dec8f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c2bd59755', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ce0d42452', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c86164a6f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c82c6b22c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c225ab6cd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c3d5f2683', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ce34d16d1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c086172d2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c7df2f6f9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cfb1f5a76', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c3148c486', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cc8155878', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c1b857668', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cb21b5dc1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ce0598a7a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cc0089e65', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cd00ccf76', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c2339842d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cffe18113', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c98ded198', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c7dc22b2c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c0ed27a5f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c8b20d363', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c695e0665', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c2d0a70a3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c01baf36b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cc54fc001', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
debounce.js:104 [Violation] 'setTimeout' handler took 135ms
CrypticAnimusScene.tsx:245 [Physics config] Initialized successfully
CrypticAnimusScene.tsx:248 [CrypticAnimusScene] Configuring physics forces!
CrypticAnimusScene.tsx:327 [REHEAT] Initial d3ReheatSimulation called
CrypticAnimusScene.tsx:343 [TICKS] Starting forced tick execution...
CrypticAnimusScene.tsx:369 [TICKS] Executed 20 ticks successfully (target: 20)
CrypticAnimusScene.tsx:372 [SIMULATION] Testing if forces are applied...
CrypticAnimusScene.tsx:376 [FORCES] link: true charge: true center: true
CrypticAnimusScene.tsx:386 [Debug] window.__FG type: object
CrypticAnimusScene.tsx:387 [Debug] window.__FG has graphData method: false
CrypticAnimusScene.tsx:272 [Violation] 'setTimeout' handler took 242ms
ForceGraphAdapter.tsx:320 [FGAdapter] ref after mount: {current: {…}}
ForceGraphAdapter.tsx:322 [FGAdapter] ref.current: {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
ForceGraphAdapter.tsx:323 [FGAdapter] ref.current keys: (9) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh', 'highlightNode', 'selectNode']
ForceGraphAdapter.tsx:324 [FGAdapter] Assigning window.__FG = ref.current
ForceGraphAdapter.tsx:326 [FGAdapter] window.__FG assigned successfully
ForceGraphAdapter.tsx:327 [CLAUDE] ready-for-smoke-screen
ForceGraphAdapter.tsx:338 [FGAdapter] Initial refresh() on mount completed
ForceGraphAdapter.tsx:320 [FGAdapter] ref after mount: {current: {…}}
ForceGraphAdapter.tsx:322 [FGAdapter] ref.current: {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
ForceGraphAdapter.tsx:323 [FGAdapter] ref.current keys: (9) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh', 'highlightNode', 'selectNode']
ForceGraphAdapter.tsx:324 [FGAdapter] Assigning window.__FG = ref.current
ForceGraphAdapter.tsx:326 [FGAdapter] window.__FG assigned successfully
ForceGraphAdapter.tsx:327 [CLAUDE] ready-for-smoke-screen
ForceGraphAdapter.tsx:338 [FGAdapter] Initial refresh() on mount completed
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c5c5cb290', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cfbf127ae', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cf2bbf5ec', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cdf8bdcca', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cdd55b905', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c843d7870', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ceaa7c88f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c79a9247e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c74ef33e8', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c652b607a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cc742484d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c8173ab2d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c85aa9c70', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c13cebb4a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c55ba44c5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c2800cc7f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cff1d4018', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ca59c85d0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c535c8110', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cbc52d6c2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c33ca164a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c6361cb4f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cef78a38b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cee11cbb1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ccffbc1ef', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cc4842cc4', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c74d36234', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cee99331f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cdd956ea1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c376b7f32', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c56eb31b9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cfb053573', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cedcb24bc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c7d7f4b95', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c2f12bdee', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c25d961aa', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c8e99e6ed', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c70b1c9bd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cccbea023', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c3a9984dd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c03a535e4', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cd163d4f3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cef22c14d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cb8c02222', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c4921c0e2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c5fc25157', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c972c97bd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c3851db91', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c8ae1016c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c56ab24c1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ce2fae53e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cc770fdb2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c7a55b332', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cf792d1af', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c82fb7647', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c8e7bbb6a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c0b006cd1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c00285b01', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c25890dea', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c6d98fb14', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cfb56812c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ca835c723', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c2241aef0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cb7331b23', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c83b96b4f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c9d0588aa', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c48a098c0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c27d54905', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c7301e7fb', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c434990c8', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cb5e4ead7', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cd36a7b45', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c60986435', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cad773eab', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ca5450742', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cd28770db', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c77ae9ae5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c5af9982f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cb39e5d5c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c3c02fcb3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ca41157d2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c7c99ba8b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c384aafcf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ca78bb5af', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ce8b72849', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ccdcf7310', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c9c9eb43c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c1a7a5d5d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ccf640cac', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c5047db93', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c869352a0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c1493cabc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c76a3bf25', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c3650d69a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c1f618a24', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c340cbdad', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ceb399bca', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cf738a9e1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ccf8292e9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c8ade5c49', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c3c259fef', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c5e2bab0e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c1f9db45c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c1e4ad5b4', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c9a1cd11b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cb4639457', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c17d356af', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cb71b3926', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cd305c2ff', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c4b721a70', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c657f8b8d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c0d25c673', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ce898d890', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c04efe311', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cd9f5bc4f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cfe17f210', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cd5b5d6d1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ce029d95e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cfdf1abed', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c2f075e79', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c1a54e072', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ccb2b2f6c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ceeb65581', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cb178b270', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ce0067c5c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cecee7df9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ccd81ff8f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ca9946b8d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cdacf98f1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c7873dac5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cececa383', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c3b0c869b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cc2bbbfee', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c9e36580a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c0492e1cf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cea0d59fe', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c1ac0d342', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ca3d2eb5a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cff96989a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c14952ea7', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c50976366', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c98df5000', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c906c3f65', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cfa52c07a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cceee4ce9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c0f7fb9ac', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c26769d05', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cf88d57e3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c3a56aefd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cd3af37c0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ce8a87cd1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cd3b05c25', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'caa5eb943', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cda217c26', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c4f1d1909', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ca0c391dc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cd25ec3ea', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ca53a1f2f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c96dcda94', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ced8ce15d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c7b48bdfa', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c88be5f44', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cea08be1c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c8ecfe6cf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c5855a307', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c6b48a717', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cc56234bf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c36965f1b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c365a170a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cb48197be', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c609144d7', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c1bd6aaf6', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c25a9ac40', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cfd668493', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c7859277f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cc65f5535', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c3e3245cc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cc6f0738f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ca611af7d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c12bc654f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cc47cce08', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ceb9d11e5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c09300fce', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c478deb51', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c1d3736ab', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c892dec8f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c2bd59755', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ce0d42452', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c86164a6f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c82c6b22c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c225ab6cd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c3d5f2683', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ce34d16d1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c086172d2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c7df2f6f9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cfb1f5a76', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c3148c486', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cc8155878', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c1b857668', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cb21b5dc1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'ce0598a7a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cc0089e65', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cd00ccf76', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c2339842d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cffe18113', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c98ded198', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c7dc22b2c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c0ed27a5f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c8b20d363', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c695e0665', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c2d0a70a3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'c01baf36b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:859 [PROBE] nodeThreeObject: {nodeId: 'cc54fc001', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
```
