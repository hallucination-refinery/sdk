# ForceGraph Integration Current State Documentation
**Generated:** 12-08-2025 by HOPPER-A
**Last Analyzed Commit:** feat/pond-demo-aug14

## Overview
This document captures the complete current state of ForceGraph integration, documenting every interface, prop, method, and integration point that the canvas-latent implementation must satisfy.

## Component Architecture

### CrypticAnimusScene Component
**Location:** `/workspace/apps/legacy-import/cryptic-vault-demo/components/CrypticAnimusScene.tsx`
**Lines:** 1152

### ForceGraphAdapter Component  
**Location:** `/workspace/packages/canvas-r3f/src/adapters/ForceGraphAdapter.tsx`
**Lines:** 419

## Complete Interface Definitions

### CrypticAnimusSceneProps Interface (lines 41-59)
```typescript
interface CrypticAnimusSceneProps {
  data: {
    nodes: any[]
    links: any[]
  }
  onNodeClick?: (node: any) => void
  onNodeHoverProp?: (node: any | null) => void
  mouseSelectedNodeId?: string | null
  searchResultOutlineIds?: string[]
  currentInteractionMode?: 'mouse' | 'gesture'
  gesturedNodeId?: string | null
  onBackgroundClickRequest?: () => void
  activeCategories?: Set<string>
  highlightState?: TraversalResult | null
  visibleIds?: Set<string>
  showSecrets?: boolean
  activeTags?: Set<string>
  graphVersion?: number
}
```

### ForceGraphAdapterProps Interface (lines 27-84)
```typescript
export interface ForceGraphAdapterProps {
  // Core props
  ref?: React.Ref<any>
  graphData: { nodes: any[]; links: any[] }

  // Node/Link ID accessors
  nodeId?: string
  linkSource?: string
  linkTarget?: string

  // Event handlers
  onNodeClick?: (node: any, event?: any) => void
  onNodeHover?: (node: any | null) => void
  onNodeRightClick?: (node: any, event?: any) => void
  onLinkClick?: (link: any, event?: any) => void
  onLinkHover?: (link: any | null) => void
  onBackgroundClick?: (event?: any) => void
  onBackgroundRightClick?: (event?: any) => void

  // Node rendering
  nodeThreeObject?: (node: any) => any
  nodeThreeObjectExtend?: (obj: any, node: any) => boolean
  nodeVisibility?: (node: any) => boolean
  nodeColor?: (node: any) => string
  nodeOpacity?: number
  nodeRelSize?: number
  nodeVal?: (node: any) => number
  nodeLabel?: (node: any) => string
  nodeDesc?: (node: any) => string

  // Link rendering
  linkVisibility?: (link: any) => boolean
  linkColor?: (link: any) => string
  linkWidth?: (link: any) => number
  linkCurvature?: number | ((link: any) => number)
  linkCurveRotation?: number | ((link: any) => number)
  linkMaterial?: any
  linkOpacity?: number
  linkResolution?: number

  // Camera
  enableNodeDrag?: boolean
  enableNavigationControls?: boolean
  enablePointerInteraction?: boolean

  // Performance
  enableZoomPanInteraction?: boolean

  // Freeze crash guard
  disableLinkForce?: boolean // defaults to false

  // Lens props for detecting changes
  activeCategories?: Set<string>
  activeTags?: Set<string>

  // Other
  [key: string]: any
}
```

### ForceGraphAdapterRef Interface (lines 86-121)
```typescript
export interface ForceGraphAdapterRef {
  // Physics engine methods
  d3Force: (forceName: string, force?: any) => any
  d3ReheatSimulation: () => void

  // Data access
  graphData: () => { nodes: any[]; links: any[] }

  // Animation control
  tickFrame: () => void

  // Camera control
  cameraPosition: (
    position?: { x?: number; y?: number; z?: number },
    lookAt?: { x?: number; y?: number; z?: number },
    transitionMs?: number
  ) => void
  zoomToFit: (durationMs?: number, padding?: number, nodeFilter?: (node: any) => boolean) => void

  // Scene access
  scene: () => any
  camera: () => any
  renderer: () => any
  controls: () => any

  // Node/Link access
  getGraphBbox: (nodeFilter?: (node: any) => boolean) => {
    x: [number, number]
    y: [number, number]
    z: [number, number]
  }

  // Visual feedback methods (custom additions)
  highlightNode: (nodeId: string | null) => void
  selectNode: (nodeId: string, toggle?: boolean) => void
}
```

## Key Integration Points

### Props Passed from CrypticAnimusScene to ForceGraphAdapter

The following props are passed from CrypticAnimusScene to ForceGraphAdapter (lines 1126-1148):

1. **ref={fgRef}** - ForceGraph reference for imperative methods
2. **graphData={memoizedGraphData}** - Nodes and links data structure
3. **nodeId="id"** - Node ID accessor
4. **linkSource="source"** - Link source accessor
5. **linkTarget="target"** - Link target accessor
6. **onNodeClick={handleNodeClick}** - Node click handler
7. **onNodeHover={handleNodeHover}** - Node hover handler
8. **nodeThreeObject={nodeThreeObject}** - Custom sprite renderer
9. **nodeThreeObjectExtend={nodeThreeObjectExtend}** - Sprite material setup
10. **linkColor={getLinkColor}** - Link color function
11. **linkWidth={getLinkWidth}** - Link width function
12. **linkCurvature={0.2}** - Link curvature constant
13. **warmupTicks={60}** - Initial simulation ticks
14. **cooldownTicks={180}** - Cooldown simulation ticks
15. **nodeVisibility={nodeVisibility}** - Node filter function
16. **linkVisibility={linkVisibility}** - Link filter function
17. **linkOpacity={getLinkOpacity}** - Link opacity function
18. **onBackgroundClick={onBackgroundClickRequest}** - Background click handler
19. **activeCategories={activeCategories}** - Category filter state
20. **activeTags={activeTags}** - Tag filter state

### Critical Callback Functions

#### nodeThreeObject (lines 827-878)
- Creates THREE.Sprite objects for nodes
- Handles selection coloring (orange, cyan, light green)
- Uses buildCrypticNodeSprite helper
- Must return a THREE.Object3D

#### nodeThreeObjectExtend (lines 881-901)
- Sets initial sprite opacity
- Modifies material properties
- Returns false to allow propagation

#### handleNodeClick (lines 904-923)
- Calls imperative selectNode on ref
- Forwards to parent onNodeClick prop
- Logs interaction for debugging

#### handleNodeHover (lines 926-945)
- Calls imperative highlightNode on ref
- Forwards to parent onNodeHoverProp
- Handles null for hover-off

#### nodePassesFilters (lines 1074-1093)
- Checks showSecrets flag
- Validates against visibleIds Set
- Checks activeCategories Set
- Validates activeTags Set
- Returns boolean for visibility

#### getLinkColor (lines 1031-1057)
- Handles highlight state coloring
- Upstream/downstream differentiation
- Sign-based coloring (+/-)
- Returns hex color string

#### getLinkWidth (lines 1059-1071)
- Base width 0.4
- Weighted width based on link.weight
- Highlight boost up to 3.0
- Returns numeric width

#### getLinkOpacity (lines 948-983)
- Checks node visibility at both ends
- Category/cluster filtering
- Highlight state handling
- Returns opacity value

## State Management

### Refs Used in CrypticAnimusScene
1. **fgRef** - ForceGraph instance reference
2. **graphDataRef** - Current graph data
3. **prevDataStatsRef** - Node/link count tracking
4. **hasSpawnedRef** - Initial spawn flag
5. **physicsRetryCount** - Physics setup retry counter
6. **windowFGRetryCount** - Window expose retry counter

### Refs Used in ForceGraphAdapter
1. **internalRef** - r3f-forcegraph instance
2. **highlightedNodeRef** - Current highlighted node ID
3. **selectedNodesRef** - Set of selected node IDs
4. **prevLensRef** - Previous categories/tags for change detection
5. **hasReheatedRef** - Simulation reheat flag
6. **originalColorsRef** - Map of original node colors

## Physics Configuration

### Force Configuration (lines 228-266)
```javascript
// Link force
d3Force('link')
  ?.distance(200)
  ?.strength(0.5)

// Charge force  
d3Force('charge')
  ?.strength(-500)
  ?.distanceMax(800)

// Center force
d3Force('center')?.strength(0.1)
```

### Initial Node Positioning (lines 131-175)
- Sphere spawn mode using golden ratio distribution
- Origin spawn mode (all at 0,0,0) for burst animation
- Small random perturbation to avoid symmetry

## Material Mutations

### Sprite Material Color Changes
1. **Highlight (Yellow):** 0xffff00 - Applied on hover
2. **Selection (Orange):** 0xffa500 - Applied on click
3. **Gesture (Cyan):** 0x00ffff - Gesture selection
4. **Search (Light Green):** 0x90ee90 - Search results

### Material Update Pattern (lines 132-139)
```javascript
const tintSprite = (material: any, hex: number) => {
  if (!material || !material.color) {
    console.error('[tintSprite] Invalid material:', material)
    return
  }
  material.color.setHex(hex)
  material.needsUpdate = true
}
```

## Frame Updates

### useFrame Hook (lines 986-1028)
- Ticks physics simulation each frame
- Updates sprite material opacity
- Handles visibility based on filters
- Manages highlight state opacity

## Data Flow

### Graph Data Pipeline
1. **Input:** Raw data prop → CrypticAnimusScene
2. **Memoization:** structuredClone for fresh objects
3. **Initial Position:** Spawn at origin or sphere
4. **Pass to Adapter:** memoizedGraphData prop
5. **Physics Simulation:** d3-force layout
6. **Frame Updates:** useFrame opacity/visibility
7. **Visual Feedback:** Material mutations

## Critical Dependencies

### External Libraries
- **r3f-forcegraph:** Core force graph implementation
- **three:** THREE.js for 3D rendering
- **@react-three/fiber:** React Three Fiber integration
- **d3-force-3d:** Physics simulation engine

### Internal Modules
- **@refinery/canvas-r3f:** SDK adapter export
- **@/utils/clusterPalette:** Color/opacity constants
- **@/utils/graphTraversal:** TraversalResult type
- **./CrypticNodeSprite:** Sprite building utilities

## Known Issues and Workarounds

### Object.freeze Monkey Patch (lines 17-24)
- Prevents freezing of physics nodes
- Avoids "Cannot assign to read only property" errors
- Checks for vx, vy, vz properties

### Window.__FG Exposure (lines 269-817)
- Exposes ForceGraph ref for debugging
- Multiple retry attempts with timeouts
- Extensive debug logging in dev mode

### Remount Prevention
- graphVersion prop removed
- Uses ref-based tracking instead
- Preserves graphData identity

## Performance Optimizations

### Memoization
- All callbacks memoized with useCallback
- Graph data memoized with useMemo
- Node map cached for lookups

### Sprite Caching
- buildCrypticNodeSprite uses cache
- cleanupCrypticSpriteCache on unmount
- Reuses sprite materials

### Simulation Control
- warmupTicks: 60 initial ticks
- cooldownTicks: 180 for settling
- Alpha target manipulation

## Canvas-Latent Requirements Summary

The canvas-latent implementation must:

1. Accept the same CrypticAnimusSceneProps interface
2. Implement all ForceGraphAdapterRef methods
3. Support the same prop forwarding pattern
4. Handle material mutations for visual feedback
5. Maintain refs for state tracking
6. Execute physics simulation with d3-force
7. Update node/link visibility per frame
8. Support imperative highlightNode/selectNode
9. Trigger store actions via callbacks
10. Respect all filter states (categories, tags, visibleIds, showSecrets)
11. Generate THREE.Sprite objects for nodes
12. Handle burst animation from origin
13. Maintain ~60fps with 300-1000 nodes
14. Keep memory under 200MB
15. Provide <16ms interaction latency