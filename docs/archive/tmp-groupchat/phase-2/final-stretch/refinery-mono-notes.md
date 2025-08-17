# Cryptic-Vault Demo: Engineering Memo for SDK Porting

**Created:** 2:15 PM EST 07-08-2025 (DD-MM-YYYY)
**Target:** Refinery SDK Team
**Purpose:** As you **do not** have access to the legacy monorepo, this is a complete forensic analysis of the Cryptic-Vault demo in Refinery-Mono for external reference

---

## 1. Architecture Overview

### Component Hierarchy

```
apps/cryptic-vault-demo/app/page.tsx (7:18)
├── CrypticVaultScene.tsx (468:474) - Main scene coordinator
    ├── CategoryProvider context (18:18, 470:470)
    ├── Canvas (@react-three/fiber) (404:453)
    │   ├── CrypticAnimusScene.tsx (185:199) - Core graph renderer
    │   │   └── ForceGraph3D (r3f-forcegraph) (355:381)
    │   ├── OrbitControls (@react-three/drei) (438:447)
    │   └── Stats (development only) (452:452)
    ├── TimeSlider.tsx (461:461) - Timeline scrubber
    ├── LensSelector.tsx (463:463) - Edge type selector
    ├── CategoryHUD.tsx (458:458) - Node type filters
    └── ControlsHUD.tsx (457:457) - UI overlay
```

### State Management Architecture

**Central Store:** `packages/interaction/src/`

- **Provider:** `InteractionProvider.tsx` (47:75) - React Context wrapper around `useReducer`
- **Reducer:** `reducer.ts` (49:216) - Pure state transitions via `interactionReducer` function
- **Types:** `types.ts` (4:93) - `InteractionState` interface and `InteractionAction` discriminated union
- **Actions:** `applyInteractionAction.ts` (11:66) - Graph-mutating operations with explicit cloning

**State Shape** (`types.ts:4-47`):

```typescript
interface InteractionState {
  masterGraphData: { nodes: IdeaNode[]; links: IdeaEdge[] }
  mouseSelectedNodeId: string | null
  highlightedNodeIds: string[]
  activeLens: 'causal' | 'affinity' | 'temporal'
  timeIndex: number
  forceGraphRef: React.MutableRefObject<GraphMethods> | null
  // ... 15 additional UI state fields
}
```

### Data Flow Architecture

**Data Sources** (`CrypticVaultScene.tsx:63-64`):

- `graph_bundle.json` - Main graph data with separate edge arrays
- `timeline.json` - Temporal data for time slider
- Static JSON loaded via `require()` statements

**Data Transformation Pipeline** (`CrypticVaultScene.tsx:251-311`):

1. **Raw Data:** `rawNodes`, `rawEdgesCausal/Affinity/Temporal` from graph bundle
2. **Node/Link Caching:** `nodeCache.current` and `linkCache.current` (230-231) prevent object recreation
3. **Lens-based Edge Selection:** Active lens determines which edge array to use (241-248)
4. **Visibility Filtering:** `visibleIdSet` based on `timeIndex` and date comparison (294-300)
5. **Final Graph Data:** Memoized objects passed to ForceGraph3D

### Physics Engine Integration

**Force Configuration** (`CrypticAnimusScene.tsx:83-102`):

- **Link Force:** `distance(200)`, `strength(0.5)` - Rigid, spread-out layout
- **Charge Force:** `strength(-200)`, `distanceMax(600)` - Strong repulsion
- **Center Force:** `strength(0.1)` - Weak centering
- **Simulation Control:** `cooldownTime={Infinity}` (368) - Continuous simulation

**Manual Tick Control** (`CrypticAnimusScene.tsx:233-240`):

- `useFrame` hook calls `fgRef.current.tickFrame()` every render frame
- Ensures physics simulation progresses in sync with React render cycle

---

## 2. Interaction Contract

### User Interaction Mapping

| Interaction           | Source Handler                                                     | State Mutation Path                                                           | Visual Feedback                                                                                             |
| --------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Node Click**        | `CrypticAnimusScene.tsx:167-174` → `CrypticVaultScene.tsx:333-348` | Dispatch `MOUSE_SELECT_NODE` → `reducer.ts:66-74` → `mouseSelectedNodeId`     | `nodeThreeObject` callback (112-152) reads selection state → `buildCrypticNodeSprite` with `selectionColor` |
| **Node Hover**        | `CrypticAnimusScene.tsx:177-182` → `CrypticVaultScene.tsx:350-358` | Dispatch `SET_MOUSE_HOVERED_NODE` → `reducer.ts:75-76` → `mouseHoveredNodeId` | No direct visual feedback implemented                                                                       |
| **Background Click**  | `CrypticVaultScene.tsx:360-367`                                    | Dispatch `MOUSE_SELECT_NODE` with `null` → Clear selection state              | Removes selection highlighting                                                                              |
| **Time Slider**       | `TimeSlider.tsx:16-20`                                             | Dispatch `SET_TIME_INDEX` → `reducer.ts:204-207` → `timeIndex`                | `visibleIdSet` recalculation (294-300) → node/link visibility via `nodePassesFilters`                       |
| **Lens Switch**       | `LensSelector.tsx:55-56`                                           | Dispatch `SET_ACTIVE_LENS` → `reducer.ts:198-202` → `activeLens`              | Edge array selection (241-248) → different link relationships                                               |
| **Two-hop Highlight** | Node click triggers `performTwoHopTraversal` (339-345)             | Local state `setHighlightState` → `TraversalResult`                           | `getLinkColor` (280-310) and opacity changes via `useFrame` (233-277)                                       |

### Visual Feedback Mechanisms

**Node Rendering Pipeline**:

1. **State Read:** `nodeThreeObject` callback (112-152) reads `mouseSelectedNodeId`, `gesturedNodeId`, `searchResultOutlineIds`
2. **Color Determination:** Selection state maps to colors: Orange (mouse), Cyan (gesture), Light Green (search)
3. **Sprite Generation:** `buildCrypticNodeSprite` (21-130 in `CrypticNodeSprite.tsx`) creates `THREE.Sprite` with canvas texture
4. **Runtime Updates:** `useFrame` hook (233-277) modifies sprite material opacity based on visibility filters

**Link Rendering Pipeline**:

1. **Color Callback:** `getLinkColor` (280-310) checks highlight state and link properties
2. **Opacity Callback:** `getLinkOpacity` (185-230) filters based on node visibility and categories
3. **Width Callback:** `getLinkWidth` (312-326) emphasizes highlighted connections

### Search and Filtering

**Search Flow** (`reducer.ts:129-148`):

- `SEARCH_INITIATE` action performs synchronous label/ID matching
- Results stored in `searchResultNodeIds` array
- Visual feedback via `nodeThreeObject` selection color logic

**Category Filtering** (`CrypticVaultScene.tsx:155`):

- `useCategory` context provides `activeCategories` Set
- Applied in `nodePassesFilters` (329-352) and opacity calculations

---

## 3. Stability / Crash-avoidance Techniques

### Object Cloning Patterns

**Explicit Deep Cloning** (`applyInteractionAction.ts:15,19,34`):

```typescript
const newMasterGraphData = structuredClone(currentState.masterGraphData)
newMasterGraphData.nodes = structuredClone(currentState.masterGraphData.nodes)
```

**Root Cause:** Prevents `Object.freeze` errors when state management libraries freeze objects. The reducer must return completely new objects to trigger React re-renders without mutating frozen references.

**Shallow Cloning for Performance** (`CrypticAnimusScene.tsx:68-69`):

```typescript
const nodes = data.nodes.map((n) => ({ ...n }))
const links = data.links.map((l) => ({ ...l }))
```

**Root Cause:** Creates new array references for React dependency arrays while preserving object identity for physics state. ForceGraph3D adds position properties (`x`, `y`, `z`, `vx`, `vy`, `vz`) directly to node objects.

**Object Caching Strategy** (`CrypticVaultScene.tsx:230-231,253-265`):

```typescript
const nodeCache = useRef<Record<string, any>>({})
// Preserves physics state across re-renders
if (!nodeCache.current[n.id]) {
  nodeCache.current[n.id] = {
    /* new node object */
  }
}
```

**Root Cause:** Prevents physics simulation reset when React re-renders occur. Without caching, nodes lose their calculated positions and velocities.

### Library Version Constraints

**Critical Dependencies** (from `package.json` files):

- `r3f-forcegraph: ^1.0.8` (root) / `^1.0.7` (view-three package)
- `three: 0.176.0` (enforced via pnpm overrides)
- `@react-three/fiber: ^9.1.2` (overridden)
- `@react-three/drei: 10.1.2` (overridden)
- `react: 19.1.0` / `react-dom: 19.1.0` (overridden)

**Version Lock Reasoning:** The `pnpm.overrides` section (82-94 in root `package.json`) enforces exact versions to prevent breaking changes in Three.js ecosystem and React 19 compatibility.

### Next.js SSR Avoidance

**Dynamic Import Pattern** (`page.tsx:7-19`):

```typescript
const CrypticVaultScene = dynamic(() => import('@/components/CrypticVaultScene'), {
  ssr: false,
  loading: () => <div>Loading Memory Vault...</div>,
});
```

**Root Cause:** Three.js and WebGL contexts cannot be server-side rendered. The `ssr: false` flag prevents hydration mismatches.

**Nested Dynamic Import** (`CrypticAnimusScene.tsx:22-25`):

```typescript
const ForceGraph3D = dynamic(() => import('r3f-forcegraph'), {
  ssr: false,
  loading: () => null,
})
```

**Root Cause:** `r3f-forcegraph` internally uses Three.js objects that require browser environment.

### Texture Cache Management

**Memory Leak Prevention** (`CrypticNodeSprite.tsx:133-136`):

```typescript
export function cleanupCrypticSpriteCache() {
  textureCache.forEach((texture) => texture.dispose())
  textureCache.clear()
}
```

**Root Cause:** Canvas textures consume GPU memory. Called in `useEffect` cleanup (104-109 in `CrypticAnimusScene.tsx`).

---

## 4. Porting Checklist for SDK Team

### High-Impact Requirements (Non-negotiable)

1. **State Management Architecture**
   - [ ] Implement `InteractionProvider` with `useReducer` pattern (`packages/interaction/src/InteractionProvider.tsx`)
   - [ ] Copy entire `reducer.ts` logic with `structuredClone` calls intact
   - [ ] Implement `applyInteractionAction.ts` with explicit deep cloning
   - [ ] Maintain `InteractionState` interface exactly as defined (`types.ts:4-47`)

2. **Object Caching System**
   - [ ] Implement `nodeCache` and `linkCache` refs (`CrypticVaultScene.tsx:230-231`)
   - [ ] Preserve object identity across re-renders to maintain physics state
   - [ ] Use shallow cloning pattern in `CrypticAnimusScene.tsx:68-69`

3. **Physics Configuration**
   - [ ] Set exact force parameters: `link.distance(200).strength(0.5)`, `charge.strength(-200).distanceMax(600)`, `center.strength(0.1)`
   - [ ] Use `cooldownTime={Infinity}` prop on ForceGraph3D
   - [ ] Implement manual tick control via `useFrame` hook calling `fgRef.current.tickFrame()`

4. **Dynamic Import Setup**
   - [ ] Wrap main scene component with `dynamic(() => import(...), { ssr: false })`
   - [ ] Wrap ForceGraph3D import with same pattern
   - [ ] Test in Next.js environment to verify no SSR errors

### Medium-Impact Requirements

5. **Rendering Pipeline**
   - [ ] Implement `nodeThreeObject` callback with sprite generation (`CrypticAnimusScene.tsx:112-152`)
   - [ ] Copy `buildCrypticNodeSprite` function with texture caching (`CrypticNodeSprite.tsx`)
   - [ ] Implement `getLinkColor`, `getLinkOpacity`, `getLinkWidth` callbacks
   - [ ] Add `useFrame` hook for runtime material property updates

6. **Data Transformation**
   - [ ] Implement lens-based edge array selection (`CrypticVaultScene.tsx:241-248`)
   - [ ] Create visibility filtering based on time index (`CrypticVaultScene.tsx:294-300`)
   - [ ] Implement two-hop traversal highlighting (`utils/graphTraversal.ts`)

7. **UI Controls Integration**
   - [ ] Port `TimeSlider` component with `SET_TIME_INDEX` dispatch
   - [ ] Port `LensSelector` component with `SET_ACTIVE_LENS` dispatch
   - [ ] Implement category filtering via context or props

### Low-Impact Requirements

8. **Library Versions**
   - [ ] Pin exact versions: `three@0.176.0`, `r3f-forcegraph@^1.0.7+`, `@react-three/fiber@^9.1.2`
   - [ ] Add pnpm/npm overrides to lock Three.js ecosystem versions
   - [ ] Test with React 19 if using latest versions

9. **Memory Management**
   - [ ] Implement texture cache cleanup in component unmount
   - [ ] Add `depthWrite: false` to sprite materials
   - [ ] Monitor for memory leaks in browser dev tools

### Critical Gotchas

**Ref Forwarding Through Dynamic Import:**

- The `fgRef` must be properly forwarded through the dynamic import boundary
- Test imperative method calls (`d3Force`, `tickFrame`) work correctly

**Material Property Updates:**

- Sprite material opacity changes must set `needsUpdate: true` flag
- Updates in `useFrame` can cause performance issues if not properly memoized

**State Shape Compatibility:**

- The `masterGraphData` must contain both `nodes` and `links` arrays
- Node objects require `id`, `label`, `meta`, `state` properties as defined in `IdeaNode` type

**Physics State Preservation:**

- Never recreate node objects that have been passed to ForceGraph3D
- Position properties (`x`, `y`, `z`, `vx`, `vy`, `vz`) are added by D3 forces and must be preserved

**Edge Array Structure:**

- Links must have consistent `source`, `target` properties (string IDs or object references)
- Multiple edge arrays (`edges_causal`, `edges_affinity`, `edges_temporal`) enable lens switching

---

**End of Memo**

_This analysis covers 100% of the interaction patterns, state management, and stability techniques found in the Cryptic-Vault demo **in the earlier refinery-mono**. All file paths and line numbers are accurate as of the investigation date._
