# ForceGraphAdapter Integration Interfaces
**Generated:** 12-08-2025 by CARMACK-A
**Last Updated:** 10:27 PM EST, 12-08-2025 by DIJKSTRA-B
**Purpose:** Complete interface specification for canvas-latent drop-in replacement

## Change Tracking Table

| NAME | Commit | Change | Reason | Last Updated |
|------|--------|--------|--------|--------------|
| CARMACK-A | Initial | Created integration interfaces documentation | Extract complete contract for canvas-latent replacement | 10:00 PM EST, 12-08-2025 |
| DIJKSTRA-B | TBD | Added missing critical implementation details | onEngineStop handler, internal state refs, tintSprite helper, store actions | 10:27 PM EST, 12-08-2025 |

## Overview

This document provides the complete TypeScript interface specification extracted from `ForceGraphAdapter.tsx` to enable a binary-compatible drop-in replacement with the canvas-latent implementation. Every prop, method, and ref exposed by ForceGraphAdapter is documented here with exact type signatures.

## Critical Context

**ForceGraph Replacement Status:**
- ForceGraph IS being replaced due to fundamental issues (see working-doc Decision Log lines 90-115)
- Canvas-latent must maintain EXACT compatibility for Thursday demo
- All interfaces below must be implemented identically for drop-in compatibility

## Component Interfaces

### ForceGraphAdapterProps

Complete props interface that the canvas-latent adapter must accept:

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

  // Other (pass-through to ForceGraph3D)
  [key: string]: any
}
```

### ForceGraphAdapterRef

Complete ref interface that must be exposed via React.forwardRef:

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

  // Visual feedback methods (CRITICAL - custom implementations)
  highlightNode: (nodeId: string | null) => void
  selectNode: (nodeId: string, toggle?: boolean) => void
}
```

## Implementation Requirements

### 1. Component Structure

The canvas-latent replacement must:
- Use `React.forwardRef` to expose the ref interface
- Accept all props from `ForceGraphAdapterProps`
- Implement all methods in `ForceGraphAdapterRef`
- Pass through unknown props via spread operator

### 2. Visual Feedback Implementation

The adapter implements two critical visual feedback methods:

#### highlightNode(nodeId: string | null)
- **Behavior:** Applies yellow (0xffff00) tint to highlighted node
- **State Management:** Tracks currently highlighted node
- **Color Restoration:** Restores original color when highlight removed
- **Special Case:** If node is selected, maintains orange (0xffa500) instead of original

#### selectNode(nodeId: string, toggle?: boolean)
- **Behavior:** Applies orange (0xffa500) tint to selected nodes
- **State Management:** Maintains Set of selected node IDs
- **Toggle Logic:** If toggle=true and already selected, deselects
- **Color Priority:** Selection color takes precedence unless highlighted

### 3. Lens Change Detection

The adapter monitors `activeCategories` and `activeTags` props:
- Triggers `d3ReheatSimulation()` when lens changes
- Implements one-shot reheat with 2-second cooldown
- Stores previous lens state for comparison

### 4. Global Exposure

**CRITICAL:** The adapter exposes itself to `window.__FG` for debugging:
```javascript
useEffect(() => {
  if (ref && typeof ref === 'object' && 'current' in ref && ref.current) {
    (window as any).__FG = ref.current
  }
}, [ref])
```

### 5. Monkey-Patch Context

The current implementation includes a monkey-patch for `Object.freeze` to prevent physics node freezing. Canvas-latent may not need this if not using d3-force physics.

### 6. onEngineStop Handler

**CRITICAL:** The adapter adds an onEngineStop handler to ForceGraph3D:
```javascript
onEngineStop={() => {
  if (internalRef.current) {
    internalRef.current.d3AlphaTarget?.(0.3)?.restart?.()
  }
}}
```
This restarts the simulation with alpha target 0.3 when physics stops. Canvas-latent must replicate this behavior.

### 7. Internal State Management

The adapter maintains several internal refs for state tracking:
- `highlightedNodeRef`: Tracks currently highlighted node ID
- `selectedNodesRef`: Set of selected node IDs
- `prevLensRef`: Previous lens state for change detection
- `hasReheatedRef`: Boolean flag for reheat cooldown
- `originalColorsRef`: Map storing original node colors before tinting

### 8. Helper Functions

#### tintSprite(material: any, hex: number)
Helper function for safe material color mutations:
- Validates material has color property
- Sets color via `material.color.setHex(hex)`
- Marks material for update via `material.needsUpdate = true`

## Store Integration

The adapter integrates with the store's UISlice actions:
- `selectNodes(nodeIds, mode)` - Called via onNodeClick handler
- `setHoverNode(nodeId)` - Called via onNodeHover handler
- `clearSelection()` - May be called via onBackgroundClick
- Event handlers (onNodeClick, onNodeHover, etc.) dispatch these store actions
- Canvas-latent must call these handlers at appropriate times

## Type Compatibility Checklist

☐ All props from `ForceGraphAdapterProps` accepted  
☐ All methods from `ForceGraphAdapterRef` implemented  
☐ React.forwardRef wrapper in place  
☐ highlightNode visual feedback working (yellow: 0xffff00)  
☐ selectNode visual feedback working (orange: 0xffa500)  
☐ Lens change detection triggers animation  
☐ window.__FG global exposure for debugging  
☐ Event handlers properly invoked  
☐ Unknown props passed through  
☐ onEngineStop handler restarts simulation with alpha 0.3  
☐ Internal state refs properly maintained  
☐ tintSprite helper for material mutations  
☐ Store actions (selectNodes, setHoverNode, clearSelection) dispatched correctly  

## Usage Pattern Reference

From `CrypticAnimusScene.tsx`, the adapter is used as:
```typescript
<ForceGraphAdapter
  ref={forceGraphRef}
  graphData={graphData}
  onNodeClick={handleNodeClick}
  onNodeHover={handleNodeHover}
  nodeThreeObject={nodeThreeObject}
  // ... other props
  activeCategories={activeCategories}
  activeTags={activeTags}
/>
```

## Migration Path

To replace ForceGraphAdapter with canvas-latent:
1. Implement all interfaces documented above
2. Ensure visual feedback methods work identically
3. Verify lens change animations trigger
4. Test all event handlers fire correctly
5. Confirm window.__FG debugging access

## Validation

The replacement is successful when:
- All TypeScript interfaces compile without error
- Visual feedback (highlight/select) matches color codes exactly
- Event handlers fire with correct parameters
- Lens changes trigger appropriate animations
- No runtime errors in console
- Thursday demo runs without modification to consuming code