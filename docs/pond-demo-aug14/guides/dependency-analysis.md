# ForceGraph Dependency Analysis
**Generated:** 12-08-2025 by HOPPER-A
**Component Analysis:** CrypticAnimusScene & ForceGraphAdapter

## Dependency Tree

### CrypticAnimusScene Dependencies

```
CrypticAnimusScene.tsx
├── React Core
│   ├── react (useEffect, useState, useCallback, useMemo, useLayoutEffect, useRef)
│   └── react.Component (ErrorBoundary)
├── Next.js
│   └── next/dynamic (dynamic import)
├── Three.js Ecosystem
│   ├── three (THREE namespace)
│   └── @react-three/fiber (useFrame)
├── Force Graph
│   └── @refinery/canvas-r3f (ForceGraphAdapter)
├── Local Utilities
│   ├── ./CrypticNodeSprite
│   │   ├── buildCrypticNodeSprite()
│   │   └── cleanupCrypticSpriteCache()
│   ├── @/utils/clusterPalette
│   │   ├── OPACITY_VALUES
│   │   └── LINK_COLORS
│   └── @/utils/graphTraversal
│       └── TraversalResult (type)
└── Types
    └── NodeObject<T> (local definition)
```

### ForceGraphAdapter Dependencies

```
ForceGraphAdapter.tsx
├── React Core
│   ├── react (forwardRef, useMemo, useEffect, useCallback, useRef, useImperativeHandle)
│   └── React.Ref
├── Force Graph Library
│   └── r3f-forcegraph
│       └── ForceGraph3D (default export)
└── Three.js
    └── three
        └── THREE.SpriteMaterial
```

## Import Analysis

### CrypticAnimusScene Imports
```typescript
// React ecosystem
import React, { useEffect, useState, useCallback, useMemo, useLayoutEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

// Three.js ecosystem  
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Local modules
import { buildCrypticNodeSprite, cleanupCrypticSpriteCache } from './CrypticNodeSprite'
import { OPACITY_VALUES, LINK_COLORS } from '@/utils/clusterPalette'
import { type TraversalResult } from '@/utils/graphTraversal'

// Dynamic import
const ForceGraph3D = dynamic(
  () => import('@refinery/canvas-r3f').then((mod) => mod.ForceGraphAdapter),
  { ssr: false, loading: () => null }
)
```

### ForceGraphAdapter Imports
```typescript
import React, { forwardRef, useMemo, useEffect } from 'react'
import ForceGraph3D from 'r3f-forcegraph'
import * as THREE from 'three'
```

## Three.js Patterns Used

### 1. Sprite Material Pattern
```javascript
// Sprite creation with material
const sprite = new THREE.Sprite(material)
sprite.material.opacity = 1
sprite.material.needsUpdate = true
```

### 2. Color Mutation Pattern
```javascript
material.color.setHex(0xffff00)  // Yellow highlight
material.color.setHex(0xffa500)  // Orange selection
material.color.getHex()           // Get current color
```

### 3. Frame-based Updates
```javascript
useFrame(() => {
  // Update sprite materials each frame
  sprite.material.opacity = targetOpacity
  sprite.material.needsUpdate = true
})
```

### 4. Three.js Object Hierarchy
```javascript
// Node → __threeObj → material → color/opacity
node.__threeObj.material.color.setHex(hex)
```

### 5. Scene Graph Access
```javascript
// Via ForceGraph ref
fgRef.current.scene()
fgRef.current.camera()
fgRef.current.renderer()
fgRef.current.controls()
```

## React Patterns Catalogued

### 1. Dynamic Import Pattern
```javascript
const ForceGraph3D = dynamic(
  () => import('@refinery/canvas-r3f').then((mod) => mod.ForceGraphAdapter),
  { ssr: false, loading: () => null }
)
```

### 2. Error Boundary Pattern
```javascript
class FGErrorBoundary extends React.Component {
  componentDidCatch(error, info) {
    console.error('[FGErrorBoundary]', error, info)
  }
  render() {
    return this.props.children
  }
}
```

### 3. Ref Forwarding Pattern
```javascript
const ForceGraphAdapter = forwardRef((props, ref) => {
  const internalRef = React.useRef(null)
  React.useImperativeHandle(ref, () => ({
    ...internalRef.current,
    highlightNode,
    selectNode,
  }))
})
```

### 4. Memoization Patterns
```javascript
// Props memoization
const memoizedGraphData = useMemo(() => ({
  nodes: memoizedNodes,
  links: memoizedLinks,
}), [memoizedNodes, memoizedLinks])

// Callback memoization
const handleNodeClick = useCallback((node) => {
  // Handle click
}, [onNodeClick])
```

### 5. Effect with Cleanup Pattern
```javascript
useEffect(() => {
  // Setup
  return () => {
    cleanupCrypticSpriteCache()
  }
}, [])
```

### 6. Retry Pattern with Refs
```javascript
const retryCount = useRef(0)
const checkAndConfigure = () => {
  if (!fgRef.current) {
    retryCount.current++
    if (retryCount.current > 50) return
    setTimeout(checkAndConfigure, 100)
    return
  }
  // Configure
}
```

### 7. State Tracking with Refs
```javascript
const hasSpawnedRef = useRef(false)
if (!hasSpawnedRef.current) {
  // One-time initialization
  hasSpawnedRef.current = true
}
```

## State Management Flow

### Data Flow Architecture
```
External Store (Zustand/Redux)
    ↓ Props
CrypticAnimusScene
    ├── Memoization Layer
    │   ├── useMemo(graphData)
    │   ├── useMemo(nodes/links)
    │   └── useCallback(handlers)
    ├── Ref Layer
    │   ├── graphDataRef
    │   ├── fgRef
    │   └── tracking refs
    ↓ Props + Refs
ForceGraphAdapter
    ├── Internal State
    │   ├── highlightedNodeRef
    │   ├── selectedNodesRef
    │   └── originalColorsRef
    ├── Imperative API
    │   ├── highlightNode()
    │   └── selectNode()
    ↓ Props
r3f-forcegraph (ForceGraph3D)
    ↓
Three.js Scene Graph
```

### Event Flow
```
User Interaction
    ↓
Three.js Raycaster
    ↓
r3f-forcegraph handlers
    ↓
ForceGraphAdapter callbacks
    ├── onNodeClick
    ├── onNodeHover
    └── onBackgroundClick
    ↓
CrypticAnimusScene handlers
    ├── handleNodeClick
    └── handleNodeHover
    ↓
Parent Component (Store Actions)
```

## Physics Engine Integration

### D3-Force-3D Integration
```
ForceGraphAdapter
    ↓ d3Force() method
d3-force-3d simulation
    ├── force('link')
    │   ├── distance(200)
    │   └── strength(0.5)
    ├── force('charge')
    │   ├── strength(-500)
    │   └── distanceMax(800)
    └── force('center')
        └── strength(0.1)
```

### Simulation Control
```javascript
// Reheat simulation
d3ReheatSimulation()

// Tick control
tickFrame()

// Alpha manipulation
d3AlphaTarget(0.3).restart()
```

## Performance Patterns

### 1. Batch Updates
```javascript
useFrame(() => {
  // Batch all material updates in single frame
  nodes.forEach(node => {
    // Update materials
  })
})
```

### 2. Ref-based State
```javascript
// Avoid React re-renders
const stateRef = useRef(value)
// Direct mutation without re-render
stateRef.current = newValue
```

### 3. Memoized Callbacks
```javascript
// Prevent prop changes triggering re-renders
const callback = useCallback(() => {}, [])
```

### 4. Structured Clone
```javascript
// Deep clone for immutability
const nodes = structuredClone(data.nodes)
```

### 5. Early Returns
```javascript
if (!fgRef.current) return
if (!graphData) return
```

## Package Structure

### NPM Dependencies
```json
{
  "dependencies": {
    "react": "^18.x",
    "three": "^0.15x",
    "@react-three/fiber": "^8.x",
    "r3f-forcegraph": "^1.x",
    "next": "^13.x"
  }
}
```

### Module Resolution
```
@refinery/canvas-r3f → packages/canvas-r3f
@/utils → apps/legacy-import/cryptic-vault-demo/utils
./CrypticNodeSprite → relative to component
```

## Critical Integration Points

### 1. ForceGraph Ref Methods Required
- d3Force(name, force)
- d3ReheatSimulation()
- graphData()
- tickFrame()
- refresh()
- getGraphBbox()
- cameraPosition()
- zoomToFit()

### 2. Node Object Structure
```javascript
{
  id: string,
  x: number,
  y: number,
  z: number,
  __threeObj: THREE.Sprite,
  type: string,
  metadata: { cluster, topics },
  secret: boolean,
  label: string
}
```

### 3. Link Object Structure
```javascript
{
  source: string | node,
  target: string | node,
  weight: number,
  sign: '+' | '-' | undefined
}
```

### 4. Material Update Contract
- Materials must be SpriteMaterial
- Must support color.setHex()
- Must set needsUpdate = true
- Must track original colors

### 5. Filter State Contract
- activeCategories: Set<string>
- activeTags: Set<string>
- visibleIds: Set<string>
- showSecrets: boolean

## Browser APIs Used

### 1. Window Object Extension
```javascript
window.__FG = fgRef.current
```

### 2. Console APIs
```javascript
console.log()
console.error()
console.assert()
console.table()
```

### 3. Timing APIs
```javascript
setTimeout()
setInterval()
clearInterval()
Date.now()
```

### 4. Process Environment
```javascript
process.env.NODE_ENV
process.env.NEXT_PUBLIC_DEBUG_GRAPH
process.env.NEXT_PUBLIC_GRAPH_SPAWN
```

## Monkey Patches

### Object.freeze Override (lines 17-24)
```javascript
const __origFreeze = Object.freeze
Object.freeze = function(obj) {
  if (obj && typeof obj === 'object' && 
      'vx' in obj && 'vy' in obj && 'vz' in obj) {
    return obj // Skip freezing physics nodes
  }
  return __origFreeze(obj)
}
```

## Canvas-Latent Implementation Requirements

Based on this dependency analysis, the canvas-latent implementation must:

1. **Replace r3f-forcegraph** with native Three.js/R3F implementation
2. **Implement d3-force-3d** physics simulation directly
3. **Maintain the same ref method interface** for compatibility
4. **Use InstancedMesh** instead of individual Sprites for performance
5. **Implement material attribute buffers** for colors/opacity
6. **Handle the same event flow** through Raycaster
7. **Support all memoization patterns** for performance
8. **Maintain ref-based state** to avoid re-renders
9. **Implement frame-based updates** via useFrame
10. **Support the same filter state contract**
11. **Expose the same window.__FG** debugging interface
12. **Handle dynamic imports** with the same pattern
13. **Maintain error boundaries** for robustness
14. **Support all imperative methods** on the ref
15. **Keep the same data structure** for nodes/links