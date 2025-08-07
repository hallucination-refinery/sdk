# Baseline Smoke Screen Tests

Last Updated: 11:15 AM EST, 07/08/2025

## Context

- Branch: `repro-fg-remount`
- Commit: 8c587e11
- Browser: Chrome Incognito 138.0.7204.169 (arm64)
- Changes: ✅ Pipeline Tracing Complete:
  Successfully instrumented the store-to-renderer pipeline with console.log tracing. The implementation adds non-invasive logging at three critical stages:
  1. [STORE] - ui-slice.ts actions log dispatch and state updates
  2. [PROPS] - CrypticAnimusScene logs event handling and prop flow
  3. [STYLE] - ForceGraphAdapter logs imperative material mutations

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
2. The scene is running at **~72 FPS** counter top-left, and the HUD.

### Test 1: Full Console Log

```
Navigated to http://localhost:3000/
CrypticAnimusScene.tsx:159 [INIT POSITIONS] Spawned 213 nodes - mode: origin
CrypticAnimusScene.tsx:98 [GRAPH VERSION] Raw structure changed - updating ref. Nodes: 213 Links: 276
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 213
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
CrypticAnimusScene.tsx:218 [Physics config] Retry 1...
CrypticAnimusScene.tsx:259 [Window FG] Retry 1...
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c5c5cb290', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cfbf127ae', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'cf2bbf5ec', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'cdf8bdcca', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'cdd55b905', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c843d7870', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'ceaa7c88f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c79a9247e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c74ef33e8', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c652b607a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cc742484d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c8173ab2d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c85aa9c70', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'c13cebb4a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c55ba44c5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c2800cc7f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'cff1d4018', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'ca59c85d0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'c535c8110', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cbc52d6c2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'c33ca164a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c6361cb4f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cef78a38b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cee11cbb1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'ccffbc1ef', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'cc4842cc4', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c74d36234', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'cee99331f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cdd956ea1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c376b7f32', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c56eb31b9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cfb053573', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cedcb24bc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c7d7f4b95', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'c2f12bdee', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c25d961aa', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c8e99e6ed', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c70b1c9bd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cccbea023', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c3a9984dd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c03a535e4', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cd163d4f3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cef22c14d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cb8c02222', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c4921c0e2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c5fc25157', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c972c97bd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c3851db91', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c8ae1016c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c56ab24c1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'ce2fae53e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'cc770fdb2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c7a55b332', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cf792d1af', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'c82fb7647', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'c8e7bbb6a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c0b006cd1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'c00285b01', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'c25890dea', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c6d98fb14', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'cfb56812c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'ca835c723', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c2241aef0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cb7331b23', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c83b96b4f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'c9d0588aa', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'c48a098c0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c27d54905', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'c7301e7fb', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c434990c8', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cb5e4ead7', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'cd36a7b45', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c60986435', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cad773eab', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'ca5450742', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'cd28770db', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c77ae9ae5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c5af9982f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cb39e5d5c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c3c02fcb3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'ca41157d2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c7c99ba8b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'c384aafcf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'ca78bb5af', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'ce8b72849', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'ccdcf7310', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c9c9eb43c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c1a7a5d5d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'ccf640cac', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c5047db93', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c869352a0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c1493cabc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c76a3bf25', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c3650d69a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'c1f618a24', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c340cbdad', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'ceb399bca', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cf738a9e1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'ccf8292e9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c8ade5c49', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3c259fef', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c5e2bab0e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1f9db45c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1e4ad5b4', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c9a1cd11b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb4639457', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c17d356af', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb71b3926', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd305c2ff', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c4b721a70', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c657f8b8d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c0d25c673', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce898d890', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c04efe311', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd9f5bc4f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cfe17f210', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd5b5d6d1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce029d95e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cfdf1abed', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c2f075e79', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1a54e072', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ccb2b2f6c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ceeb65581', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb178b270', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce0067c5c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cecee7df9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ccd81ff8f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca9946b8d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cdacf98f1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c7873dac5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cececa383', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3b0c869b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc2bbbfee', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c9e36580a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c0492e1cf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cea0d59fe', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1ac0d342', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca3d2eb5a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cff96989a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c14952ea7', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c50976366', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c98df5000', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c906c3f65', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cfa52c07a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cceee4ce9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c0f7fb9ac', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c26769d05', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cf88d57e3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3a56aefd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd3af37c0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce8a87cd1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd3b05c25', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'caa5eb943', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cda217c26', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c4f1d1909', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca0c391dc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd25ec3ea', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca53a1f2f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c96dcda94', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ced8ce15d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c7b48bdfa', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c88be5f44', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cea08be1c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c8ecfe6cf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c5855a307', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c6b48a717', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc56234bf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c36965f1b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c365a170a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb48197be', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c609144d7', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1bd6aaf6', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c25a9ac40', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cfd668493', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c7859277f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc65f5535', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3e3245cc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc6f0738f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca611af7d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c12bc654f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc47cce08', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ceb9d11e5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c09300fce', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c478deb51', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1d3736ab', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c892dec8f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c2bd59755', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce0d42452', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c86164a6f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c82c6b22c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c225ab6cd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3d5f2683', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce34d16d1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c086172d2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c7df2f6f9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cfb1f5a76', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3148c486', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc8155878', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1b857668', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb21b5dc1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce0598a7a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc0089e65', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd00ccf76', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c2339842d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cffe18113', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c98ded198', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c7dc22b2c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c0ed27a5f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c8b20d363', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c695e0665', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c2d0a70a3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c01baf36b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc54fc001', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
events-f681e724.esm.js:2271 [Violation] 'requestAnimationFrame' handler took 71ms
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
CrypticAnimusScene.tsx:224 [Physics config] Initialized successfully
CrypticAnimusScene.tsx:227 [CrypticAnimusScene] Configuring physics forces!
CrypticAnimusScene.tsx:303 [REHEAT] Initial d3ReheatSimulation called
CrypticAnimusScene.tsx:316 [TICKS] Starting forced tick execution...
CrypticAnimusScene.tsx:342 [TICKS] Executed 20 ticks successfully (target: 20)
CrypticAnimusScene.tsx:345 [SIMULATION] Testing if forces are applied...
CrypticAnimusScene.tsx:349 [FORCES] link: true charge: true center: true
CrypticAnimusScene.tsx:352 [Debug] window.__FG type: object
CrypticAnimusScene.tsx:353 [Debug] window.__FG has graphData method: false
webpack-internal:///…AnimusScene.tsx:234 [Violation] 'setTimeout' handler took 242ms
 [PROBE] nodeThreeObject: {nodeId: 'c5c5cb290', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cfbf127ae', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'cf2bbf5ec', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'cdf8bdcca', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'cdd55b905', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c843d7870', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'ceaa7c88f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c79a9247e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c74ef33e8', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c652b607a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cc742484d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c8173ab2d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c85aa9c70', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'c13cebb4a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c55ba44c5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c2800cc7f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'cff1d4018', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'ca59c85d0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'c535c8110', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cbc52d6c2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'c33ca164a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c6361cb4f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cef78a38b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cee11cbb1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'ccffbc1ef', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'cc4842cc4', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c74d36234', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'cee99331f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cdd956ea1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c376b7f32', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c56eb31b9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cfb053573', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cedcb24bc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c7d7f4b95', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'c2f12bdee', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c25d961aa', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c8e99e6ed', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c70b1c9bd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cccbea023', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c3a9984dd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c03a535e4', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cd163d4f3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cef22c14d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cb8c02222', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c4921c0e2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c5fc25157', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c972c97bd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c3851db91', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c8ae1016c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c56ab24c1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'ce2fae53e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'cc770fdb2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c7a55b332', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cf792d1af', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'c82fb7647', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'c8e7bbb6a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c0b006cd1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'c00285b01', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'c25890dea', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c6d98fb14', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'cfb56812c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'ca835c723', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c2241aef0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cb7331b23', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c83b96b4f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'c9d0588aa', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'c48a098c0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c27d54905', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'c7301e7fb', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c434990c8', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cb5e4ead7', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'cd36a7b45', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c60986435', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cad773eab', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'ca5450742', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'cd28770db', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c77ae9ae5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c5af9982f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cb39e5d5c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c3c02fcb3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'ca41157d2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c7c99ba8b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'c384aafcf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'ca78bb5af', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'ce8b72849', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'ccdcf7310', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c9c9eb43c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c1a7a5d5d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'ccf640cac', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c5047db93', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c869352a0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c1493cabc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c76a3bf25', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c3650d69a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'c1f618a24', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c340cbdad', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'ceb399bca', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cf738a9e1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'ccf8292e9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c8ade5c49', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3c259fef', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c5e2bab0e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1f9db45c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1e4ad5b4', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c9a1cd11b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb4639457', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c17d356af', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb71b3926', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd305c2ff', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c4b721a70', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c657f8b8d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c0d25c673', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce898d890', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c04efe311', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd9f5bc4f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cfe17f210', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd5b5d6d1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce029d95e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cfdf1abed', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c2f075e79', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1a54e072', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ccb2b2f6c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ceeb65581', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb178b270', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce0067c5c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cecee7df9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ccd81ff8f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca9946b8d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cdacf98f1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c7873dac5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cececa383', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3b0c869b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc2bbbfee', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c9e36580a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c0492e1cf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cea0d59fe', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1ac0d342', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca3d2eb5a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cff96989a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c14952ea7', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c50976366', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c98df5000', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c906c3f65', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cfa52c07a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cceee4ce9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c0f7fb9ac', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c26769d05', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cf88d57e3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3a56aefd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd3af37c0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce8a87cd1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd3b05c25', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'caa5eb943', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cda217c26', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c4f1d1909', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca0c391dc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd25ec3ea', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca53a1f2f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c96dcda94', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ced8ce15d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c7b48bdfa', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c88be5f44', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cea08be1c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c8ecfe6cf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c5855a307', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c6b48a717', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc56234bf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c36965f1b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c365a170a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb48197be', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c609144d7', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1bd6aaf6', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c25a9ac40', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cfd668493', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c7859277f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc65f5535', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3e3245cc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc6f0738f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca611af7d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c12bc654f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc47cce08', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ceb9d11e5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c09300fce', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c478deb51', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1d3736ab', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c892dec8f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c2bd59755', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce0d42452', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c86164a6f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c82c6b22c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c225ab6cd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3d5f2683', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce34d16d1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c086172d2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c7df2f6f9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cfb1f5a76', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3148c486', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc8155878', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1b857668', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb21b5dc1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce0598a7a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc0089e65', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd00ccf76', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c2339842d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cffe18113', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c98ded198', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c7dc22b2c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c0ed27a5f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c8b20d363', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c695e0665', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c2d0a70a3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c01baf36b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc54fc001', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
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
3. I moved my cursor into the viewport, then proceeded to do the following steps:
   3.1 Hovered on only the yellow node labelled "conflicts".
   3.2 While _still hovering_ on the same node, I clicked _once._
   3.3 I then proceeded to un-hover off of the same node.
   3.4 There was **no visual change** for any of these steps (3.1 to 3.3)
   3.5 Here is the browser log excerpt for steps 3.1 to 3.3:

```
CrypticAnimusScene.tsx:851 [PROPS] CrypticAnimusScene.handleNodeHover: {nodeId: 'cdf8bdcca', hasRef: true, timestamp: 1754580375059}
CrypticAnimusScene.tsx:859 [PROPS] Calling parent onNodeHoverProp handler: {nodeId: 'cdf8bdcca'}
ui-slice.ts:145 [STORE] setHoverNode called: {nodeId: 'cdf8bdcca', timestamp: 1754580375060}
ui-slice.ts:147 [STORE] setHoverNode executing in microtask: {nodeId: 'cdf8bdcca'}
ui-slice.ts:152 [STORE] setHoverNode state updated: {before: null, after: 'cdf8bdcca'}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754580375087}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:833 [PROPS] CrypticAnimusScene.handleNodeClick: {nodeId: 'cdf8bdcca', hasRef: true, timestamp: 1754580385812}
CrypticAnimusScene.tsx:841 [PROPS] Calling parent onNodeClick handler: {nodeId: 'cdf8bdcca'}
ui-slice.ts:72 [STORE] selectNodes called: {nodeIds: Array(1), mode: 'replace', timestamp: 1754580385812}
ui-slice.ts:74 [STORE] selectNodes executing in microtask: {nodeIds: Array(1), mode: 'replace'}
ui-slice.ts:92 [STORE] selectNodes state updated: {before: Array(0), after: Array(1)}
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754580385842}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(1), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754580385862}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
```

4. I then proceeded to navigate to the 'Catalyst' filter tag, _trying to avoid hovering over any other nodes_.
   4.1 I clicked _once_ toggling the 'Catalyst' filter tag off. The yellow node labelled "conflicts" disappeared **as expected**. The following log was triggered:

```
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 5, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754580771654}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
```

4.2 I then clicked _once_ toggling the 'Catalyst' filter tag on. The yellow node labelled "conflicts" appeared **as expected**. The following log was triggered:

```
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754580919871}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cf2bbf5ec', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cdf8bdcca', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c55ba44c5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c2800cc7f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ccffbc1ef', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c376b7f32', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c2f12bdee', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c25d961aa', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c4921c0e2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc770fdb2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca835c723', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c48a098c0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb5e4ead7', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce8b72849', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c8ade5c49', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c9a1cd11b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb71b3926', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c4b721a70', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c2f075e79', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb178b270', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cecee7df9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cececa383', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c906c3f65', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cfa52c07a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'caa5eb943', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca0c391dc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c7b48bdfa', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c8ecfe6cf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc56234bf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c36965f1b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c86164a6f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c82c6b22c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cfb1f5a76', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3148c486', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce0598a7a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc0089e65', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c2339842d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c7dc22b2c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c2d0a70a3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
```

5. I then proceeded to scroll to zoom out and navigate to the timeline scrubber, _trying to avoid hovering over any other nodes_.
   5.1 I clicked and dragged the timeline scrubber to the earliest date. The nodes gradually disappeared as expected **as expected**. The following console logs triggered:

```
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 206
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581179209}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 199
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581179236}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 192
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581179294}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 179
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581179340}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 156
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581179391}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 142
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581179421}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 127
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581179462}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 108
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581179501}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 92
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581179541}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 73
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581179566}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 66
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581179587}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 54
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581179610}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 51
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581179628}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 42
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581179645}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 38
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581179669}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 33
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581179689}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 27
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581179721}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 19
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581179757}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 15
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581179773}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 12
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581179789}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 7
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581179803}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 4
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581179819}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
```

5.2 I clicked and dragged the timeline scrubber back to the latest date. The nodes gradually appeared as expected **as expected**. The following console logs triggered:

```
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 12
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581225141}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cee11cbb1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cffe18113', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c98ded198', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c7dc22b2c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c0ed27a5f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c8b20d363', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c695e0665', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c2d0a70a3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 15
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581225330}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc0089e65', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd00ccf76', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c2339842d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 19
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581225432}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc8155878', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1b857668', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb21b5dc1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce0598a7a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 23
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581225465}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c086172d2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c7df2f6f9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cfb1f5a76', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3148c486', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 27
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581225491}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c82c6b22c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c225ab6cd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3d5f2683', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce34d16d1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 30
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581225508}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c2bd59755', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce0d42452', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c86164a6f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 33
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581225525}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c478deb51', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1d3736ab', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c892dec8f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 38
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581225545}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca611af7d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c12bc654f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc47cce08', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ceb9d11e5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c09300fce', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 47
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581225573}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb48197be', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c609144d7', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1bd6aaf6', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c25a9ac40', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cfd668493', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c7859277f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc65f5535', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3e3245cc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc6f0738f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 54
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581225599}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c7c99ba8b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c8ecfe6cf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c5855a307', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c6b48a717', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc56234bf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c36965f1b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c365a170a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 58
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581225622}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ceaa7c88f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd163d4f3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c88be5f44', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cea08be1c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 66
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581225665}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd3af37c0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c4f1d1909', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca0c391dc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd25ec3ea', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca53a1f2f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c96dcda94', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ced8ce15d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c7b48bdfa', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 87
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581225740}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c83b96b4f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce898d890', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c0492e1cf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cea0d59fe', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1ac0d342', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca3d2eb5a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cff96989a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c14952ea7', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c50976366', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c98df5000', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c906c3f65', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cfa52c07a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cceee4ce9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c0f7fb9ac', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c26769d05', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cf88d57e3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3a56aefd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce8a87cd1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd3b05c25', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'caa5eb943', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cda217c26', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 119
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581225879}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ccffbc1ef', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1f9db45c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1e4ad5b4', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c9a1cd11b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb4639457', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c17d356af', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb71b3926', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd305c2ff', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c4b721a70', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c657f8b8d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c0d25c673', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c04efe311', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd9f5bc4f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cfe17f210', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd5b5d6d1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce029d95e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cfdf1abed', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c2f075e79', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1a54e072', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ccb2b2f6c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ceeb65581', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb178b270', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce0067c5c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cecee7df9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ccd81ff8f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca9946b8d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cdacf98f1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c7873dac5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cececa383', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3b0c869b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc2bbbfee', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c9e36580a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 127
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581225908}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c2f12bdee', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c340cbdad', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ceb399bca', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cf738a9e1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ccf8292e9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c8ade5c49', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3c259fef', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c5e2bab0e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 132
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581225936}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c869352a0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1493cabc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c76a3bf25', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3650d69a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1f618a24', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 138
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581225983}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c384aafcf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ccdcf7310', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c9c9eb43c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1a7a5d5d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ccf640cac', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c5047db93', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 142
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581226037}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3c02fcb3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca41157d2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca78bb5af', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce8b72849', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 146
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581226078}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd28770db', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c77ae9ae5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c5af9982f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb39e5d5c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 151
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581226096}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb5e4ead7', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd36a7b45', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c60986435', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cad773eab', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca5450742', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 159
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581226121}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca835c723', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c2241aef0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb7331b23', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c9d0588aa', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c48a098c0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c27d54905', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c7301e7fb', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c434990c8', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 164
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581226155}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c0b006cd1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c00285b01', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c25890dea', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c6d98fb14', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cfb56812c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 171
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581226186}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c56ab24c1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce2fae53e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc770fdb2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c7a55b332', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cf792d1af', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c82fb7647', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c8e7bbb6a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 176
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581226230}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c4921c0e2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c5fc25157', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c972c97bd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3851db91', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c8ae1016c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 183
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581226268}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c8e99e6ed', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c70b1c9bd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cccbea023', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3a9984dd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c03a535e4', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cef22c14d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb8c02222', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 192
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581226319}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc4842cc4', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c74d36234', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cee99331f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cdd956ea1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c376b7f32', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c56eb31b9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cfb053573', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cedcb24bc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c7d7f4b95', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 195
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581226355}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c33ca164a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c6361cb4f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cef78a38b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 199
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581226380}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c55ba44c5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c2800cc7f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c535c8110', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cbc52d6c2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 206
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581226423}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c74ef33e8', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc742484d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c8173ab2d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c85aa9c70', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c13cebb4a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cff1d4018', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca59c85d0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 213
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581226465}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c5c5cb290', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cfbf127ae', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cf2bbf5ec', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cdf8bdcca', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cdd55b905', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c843d7870', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c79a9247e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
```

6. I then proceeded to navigate to the Lens toggler component, _trying to avoid hovering over any other nodes_, and clicked/selected the "Affinity" lens.
   6.1 The Lens toggler component correctly switched the selected lens from "Causal" to "Affinity", but the nodes **did not** change or move at all. The following console logs triggered:

```
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754581396498}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
events-f681e724.esm.js:2271 [Violation] 'requestAnimationFrame' handler took 52ms
```

### Test 2: Console Log Excerpt

**NOTE:** This excerpt covers **only** step 1 to 2 of the "Test 2: Chronological Account".

```
Navigated to http://localhost:3000/
CrypticAnimusScene.tsx:159 [INIT POSITIONS] Spawned 213 nodes - mode: origin
CrypticAnimusScene.tsx:98 [GRAPH VERSION] Raw structure changed - updating ref. Nodes: 213 Links: 276
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 213
CrypticAnimusScene.tsx:195 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
CrypticAnimusScene.tsx:218 [Physics config] Retry 1...
CrypticAnimusScene.tsx:259 [Window FG] Retry 1...
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c5c5cb290', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cfbf127ae', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'cf2bbf5ec', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'cdf8bdcca', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'cdd55b905', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c843d7870', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'ceaa7c88f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c79a9247e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c74ef33e8', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c652b607a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cc742484d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c8173ab2d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c85aa9c70', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'c13cebb4a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c55ba44c5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c2800cc7f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'cff1d4018', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'ca59c85d0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'c535c8110', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cbc52d6c2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'c33ca164a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c6361cb4f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cef78a38b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cee11cbb1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'ccffbc1ef', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'cc4842cc4', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c74d36234', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'cee99331f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cdd956ea1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c376b7f32', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c56eb31b9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cfb053573', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cedcb24bc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c7d7f4b95', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'c2f12bdee', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c25d961aa', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c8e99e6ed', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c70b1c9bd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cccbea023', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c3a9984dd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c03a535e4', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cd163d4f3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cef22c14d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cb8c02222', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c4921c0e2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c5fc25157', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c972c97bd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c3851db91', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c8ae1016c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c56ab24c1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'ce2fae53e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'cc770fdb2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c7a55b332', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cf792d1af', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'c82fb7647', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'c8e7bbb6a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c0b006cd1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'c00285b01', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'c25890dea', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c6d98fb14', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'cfb56812c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'ca835c723', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c2241aef0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cb7331b23', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c83b96b4f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'c9d0588aa', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'c48a098c0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c27d54905', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'c7301e7fb', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c434990c8', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cb5e4ead7', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'cd36a7b45', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c60986435', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cad773eab', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'ca5450742', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'cd28770db', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c77ae9ae5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c5af9982f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cb39e5d5c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c3c02fcb3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'ca41157d2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c7c99ba8b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'c384aafcf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'ca78bb5af', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'ce8b72849', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'ccdcf7310', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c9c9eb43c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c1a7a5d5d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'ccf640cac', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c5047db93', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c869352a0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c1493cabc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c76a3bf25', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c3650d69a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'c1f618a24', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c340cbdad', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'ceb399bca', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cf738a9e1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'ccf8292e9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c8ade5c49', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3c259fef', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c5e2bab0e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1f9db45c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1e4ad5b4', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c9a1cd11b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb4639457', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c17d356af', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb71b3926', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd305c2ff', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c4b721a70', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c657f8b8d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c0d25c673', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce898d890', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c04efe311', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd9f5bc4f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cfe17f210', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd5b5d6d1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce029d95e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cfdf1abed', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c2f075e79', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1a54e072', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ccb2b2f6c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ceeb65581', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb178b270', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce0067c5c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cecee7df9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ccd81ff8f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca9946b8d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cdacf98f1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c7873dac5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cececa383', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3b0c869b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc2bbbfee', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c9e36580a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c0492e1cf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cea0d59fe', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1ac0d342', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca3d2eb5a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cff96989a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c14952ea7', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c50976366', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c98df5000', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c906c3f65', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cfa52c07a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cceee4ce9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c0f7fb9ac', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c26769d05', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cf88d57e3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3a56aefd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd3af37c0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce8a87cd1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd3b05c25', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'caa5eb943', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cda217c26', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c4f1d1909', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca0c391dc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd25ec3ea', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca53a1f2f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c96dcda94', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ced8ce15d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c7b48bdfa', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c88be5f44', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cea08be1c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c8ecfe6cf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c5855a307', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c6b48a717', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc56234bf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c36965f1b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c365a170a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb48197be', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c609144d7', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1bd6aaf6', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c25a9ac40', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cfd668493', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c7859277f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc65f5535', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3e3245cc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc6f0738f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca611af7d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c12bc654f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc47cce08', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ceb9d11e5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c09300fce', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c478deb51', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1d3736ab', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c892dec8f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c2bd59755', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce0d42452', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c86164a6f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c82c6b22c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c225ab6cd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3d5f2683', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce34d16d1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c086172d2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c7df2f6f9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cfb1f5a76', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3148c486', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc8155878', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1b857668', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb21b5dc1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce0598a7a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc0089e65', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd00ccf76', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c2339842d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cffe18113', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c98ded198', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c7dc22b2c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c0ed27a5f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c8b20d363', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c695e0665', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c2d0a70a3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c01baf36b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc54fc001', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
events-f681e724.esm.js:2271 [Violation] 'requestAnimationFrame' handler took 71ms
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
CrypticAnimusScene.tsx:224 [Physics config] Initialized successfully
CrypticAnimusScene.tsx:227 [CrypticAnimusScene] Configuring physics forces!
CrypticAnimusScene.tsx:303 [REHEAT] Initial d3ReheatSimulation called
CrypticAnimusScene.tsx:316 [TICKS] Starting forced tick execution...
CrypticAnimusScene.tsx:342 [TICKS] Executed 20 ticks successfully (target: 20)
CrypticAnimusScene.tsx:345 [SIMULATION] Testing if forces are applied...
CrypticAnimusScene.tsx:349 [FORCES] link: true charge: true center: true
CrypticAnimusScene.tsx:352 [Debug] window.__FG type: object
CrypticAnimusScene.tsx:353 [Debug] window.__FG has graphData method: false
webpack-internal:///…AnimusScene.tsx:234 [Violation] 'setTimeout' handler took 242ms
 [PROBE] nodeThreeObject: {nodeId: 'c5c5cb290', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cfbf127ae', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'cf2bbf5ec', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'cdf8bdcca', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'cdd55b905', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c843d7870', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'ceaa7c88f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c79a9247e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c74ef33e8', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c652b607a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cc742484d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c8173ab2d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c85aa9c70', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'c13cebb4a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c55ba44c5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c2800cc7f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'cff1d4018', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'ca59c85d0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'c535c8110', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cbc52d6c2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'c33ca164a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c6361cb4f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cef78a38b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cee11cbb1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'ccffbc1ef', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'cc4842cc4', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c74d36234', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'cee99331f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cdd956ea1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c376b7f32', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c56eb31b9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cfb053573', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cedcb24bc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c7d7f4b95', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'c2f12bdee', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c25d961aa', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c8e99e6ed', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c70b1c9bd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cccbea023', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c3a9984dd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c03a535e4', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cd163d4f3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cef22c14d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cb8c02222', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c4921c0e2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c5fc25157', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c972c97bd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c3851db91', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c8ae1016c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c56ab24c1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'ce2fae53e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'cc770fdb2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c7a55b332', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cf792d1af', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'c82fb7647', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'c8e7bbb6a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c0b006cd1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'c00285b01', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'c25890dea', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c6d98fb14', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'cfb56812c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'ca835c723', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c2241aef0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cb7331b23', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c83b96b4f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'c9d0588aa', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'c48a098c0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'c27d54905', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
 [PROBE] nodeThreeObject: {nodeId: 'c7301e7fb', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c434990c8', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cb5e4ead7', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'cd36a7b45', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c60986435', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'cad773eab', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'ca5450742', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'cd28770db', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c77ae9ae5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c5af9982f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cb39e5d5c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c3c02fcb3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'ca41157d2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c7c99ba8b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'c384aafcf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'ca78bb5af', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'ce8b72849', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
 [PROBE] nodeThreeObject: {nodeId: 'ccdcf7310', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c9c9eb43c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c1a7a5d5d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'ccf640cac', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c5047db93', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'c869352a0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c1493cabc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c76a3bf25', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'c3650d69a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
 [PROBE] nodeThreeObject: {nodeId: 'c1f618a24', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c340cbdad', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'ceb399bca', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
 [PROBE] nodeThreeObject: {nodeId: 'cf738a9e1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
 [PROBE] nodeThreeObject: {nodeId: 'ccf8292e9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
 [PROBE] nodeThreeObject: {nodeId: 'c8ade5c49', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3c259fef', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c5e2bab0e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1f9db45c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1e4ad5b4', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c9a1cd11b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb4639457', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c17d356af', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb71b3926', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd305c2ff', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c4b721a70', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c657f8b8d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c0d25c673', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce898d890', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c04efe311', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd9f5bc4f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cfe17f210', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd5b5d6d1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce029d95e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cfdf1abed', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c2f075e79', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1a54e072', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ccb2b2f6c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ceeb65581', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb178b270', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce0067c5c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cecee7df9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ccd81ff8f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca9946b8d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cdacf98f1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c7873dac5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cececa383', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3b0c869b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc2bbbfee', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c9e36580a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c0492e1cf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cea0d59fe', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1ac0d342', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca3d2eb5a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cff96989a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c14952ea7', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c50976366', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c98df5000', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c906c3f65', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cfa52c07a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cceee4ce9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c0f7fb9ac', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c26769d05', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cf88d57e3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3a56aefd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd3af37c0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce8a87cd1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd3b05c25', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'caa5eb943', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cda217c26', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c4f1d1909', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca0c391dc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd25ec3ea', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca53a1f2f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c96dcda94', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ced8ce15d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c7b48bdfa', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c88be5f44', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cea08be1c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c8ecfe6cf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c5855a307', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c6b48a717', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc56234bf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c36965f1b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c365a170a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb48197be', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c609144d7', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1bd6aaf6', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c25a9ac40', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cfd668493', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c7859277f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc65f5535', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3e3245cc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc6f0738f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ca611af7d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c12bc654f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc47cce08', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ceb9d11e5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c09300fce', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c478deb51', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1d3736ab', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c892dec8f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c2bd59755', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce0d42452', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c86164a6f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c82c6b22c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c225ab6cd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3d5f2683', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce34d16d1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c086172d2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c7df2f6f9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cfb1f5a76', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c3148c486', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc8155878', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c1b857668', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cb21b5dc1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'ce0598a7a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc0089e65', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cd00ccf76', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c2339842d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cffe18113', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c98ded198', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c7dc22b2c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c0ed27a5f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c8b20d363', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c695e0665', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c2d0a70a3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'c01baf36b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:787 [PROBE] nodeThreeObject: {nodeId: 'cc54fc001', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
```
