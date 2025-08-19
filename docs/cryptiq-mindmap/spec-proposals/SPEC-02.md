# SPEC-02: Cryptiq Mindmap Implementation

## 1. Executive Summary

**User Promise**: Transform your private memories into an explorable 3D brain visualization revealing hidden patterns through affinity, temporal, and causal lenses.

**What This Proves**: The Refinery SDK can deliver deterministic, performant, multi-lens graph experiences with minimal code while maintaining privacy and accessibility standards.

**Top Risks**: 
1. Performance degradation beyond 1k nodes requiring LOD optimization
2. Vertex oversubscription causing visual clutter on brain surface
3. Causal edge detection accuracy without LLM processing

## 2. End-User Experience

### 30-Second Journey
1. **0s**: Page loads, glowing wireframe brain appears with particles mapped to surface
2. **5s**: User sees their memories as glowing neurons, colored by category (Affinity lens default)
3. **10s**: Clicks a neuron - details panel shows memory text, date, concepts
4. **15s**: Observes highlighted synaptic arcs connecting to related memories
5. **20s**: Switches to Temporal lens - timeline appears, recent memories glow brighter
6. **25s**: Scrubs timeline - watches memory patterns flow across time
7. **30s**: First insight emerges from visual patterns

### Primary Flows
- **Explore**: Pan/zoom brain, hover neurons for preview, click for details
- **Filter**: Toggle categories, search keywords, adjust timeline range
- **Analyze**: Switch lenses to reveal different relationship patterns
- **Capture**: Snapshot current view for later reference

### Key States
- **Happy Path**: 500+ memories load, smooth 60fps interaction, patterns visible
- **Empty State**: "Add memories to begin" prompt with demo data option
- **Error State**: "Processing failed - data remains private" with retry option

## 3. Data Plan

### Memory Processing Pipeline
```typescript
// Input: Cryptiq memories[]
{
  id: string,
  sentence: string,
  conceptIds: string[],
  secret: boolean,
  date: "YYYY-MM-DD",
  originalCategory: string
}

// Transform to nodes:
// 1. Memory nodes (type: "memory")
// 2. Concept nodes (type: "concept", derived from unique conceptIds)
```

### Lens-Specific Attributes
- **Affinity Lens**: Color by originalCategory, size by connection count
- **Temporal Lens**: Brightness by recency (0.3-1.0 opacity), timeline position
- **Causal Lens**: Pulse animations along edges with "because/then/caused" keywords

### Sample Fixture
```json
{
  "memories": [
    {
      "id": "m_001",
      "sentence": "Started meditation practice because of anxiety",
      "conceptIds": ["c_meditation", "c_anxiety", "c_wellness"],
      "secret": false,
      "date": "2025-01-15",
      "originalCategory": "Wellness"
    },
    {
      "id": "m_002", 
      "sentence": "Meditation helped me sleep better",
      "conceptIds": ["c_meditation", "c_sleep"],
      "secret": false,
      "date": "2025-01-20",
      "originalCategory": "Wellness"
    }
  ]
}
```

### Edge Generation
- **Affinity edges**: Connect nodes sharing conceptIds (weight = shared count)
- **Temporal edges**: Connect memories within 7-day window (directed by date)
- **Causal edges**: Connect memories with causal keywords (directed)

## 4. Rendering Plan

### Brain Surface Mapping
```typescript
// Algorithm: Stratified vertex assignment
1. Load brain.obj → extract vertices array
2. Categorize vertices by hemisphere/lobe regions
3. Assign nodes to vertices:
   - Group nodes by originalCategory
   - Round-robin assign within category's region
   - If vertices exhausted, create jitter shell at radius+5
```

### Particle Attributes
- **Base**: White particles, 2-5 unit size based on importance
- **Affinity**: HSL color from category (8 distinct hues)
- **Temporal**: Opacity 0.3-1.0 based on date distance
- **Secret nodes**: Reduced opacity (0.5x), smaller size (0.7x)

### Synapse Edges
- **Geometry**: THREE.TubeGeometry with 3 control points for curves
- **Rendering**: Additive blending, 0.3 base opacity
- **Pulses**: AnimationMixer with position-along-curve shader
- **Performance**: Render only edges where both nodes visible
- **Fallback**: If >500 edges visible, show only selected node's edges

## 5. SDK Integration

### Package Responsibilities
```typescript
// @refinery/graph-forge
- Transform memories[] to ForgeResult with positions
- Seed-based deterministic layout

// @refinery/store
- GraphSlice: nodes/edges state management
- UISlice: lens selection, filters, timeline position
- AsyncSlice: data loading states

// @refinery/canvas-r3f
- Canvas: Three.js scene with brain mesh
- NodeSprite: particle renderer with lens-based shaders
- Custom TubeEdge component for synapses

// @refinery/widget-hud
- Lens switcher, timeline slider, search bar
- Category filter chips, edge toggle

// App layer (not SDK)
- Brain mesh loading and shader
- Memory enrichment endpoint integration
- Details panel component
```

### Event Flow
1. User action → Intent classification (SELECT_NODE, CHANGE_LENS, etc.)
2. Intent → Store action dispatch
3. Store update → Canvas re-render with new attributes
4. Shader uniforms update → Visual change

## 6. Milestones

### M0: Foundation (Week 1)
- Brain canvas with static test particles
- Basic pan/zoom/rotate controls
- Minimal HUD (lens switcher only)
- 10-node fixture rendering
- **Demo**: Rotating brain with test nodes

### M1: Data Integration (Week 2)
- Memory processing pipeline
- Vertex mapping algorithm
- Store integration with real data
- Node selection and details panel
- **Demo**: 100 memories on brain surface with selection

### M2: Lenses & Edges (Week 3)
- Three lens implementations with shaders
- Synapse edge rendering
- Timeline slider functionality
- Category filters
- **Demo**: Full lens switching with edges

### M3: Polish & Performance (Week 4)
- Performance optimization for 1k nodes
- Accessibility features
- Error handling and edge cases
- Final visual polish
- **Demo**: Production-ready experience

## 7. Performance & QA

### Measurement Methods
- Chrome DevTools Performance profiler
- stats.js for FPS monitoring
- Custom metrics via Performance API

### Performance Budgets
- First frame: <2s (brain mesh + initial nodes)
- Lens switch: <800ms (shader update + edge recalc)
- Pan/zoom: ≥60fps sustained
- Click response: <100ms to highlight

### Tunable Parameters
- `maxVisibleEdges`: 500 (reduce for performance)
- `particleSize`: 2-5 (smaller for density)
- `edgeOpacity`: 0.3 (lower for clarity)
- `animationSpeed`: 1.0 (reduce for accessibility)

### Smoke Tests
1. Load with 0, 10, 100, 1000 memories
2. Rapid lens switching (10 switches in 5s)
3. Multi-select 50 nodes
4. Timeline scrub across full range
5. Pan/zoom stress test

## 8. Risks & Fallbacks

1. **Brain mesh fails to load**
   - Fallback: Render nodes in sphere layout
   - Mitigation: Bundle low-poly backup mesh

2. **Performance <30fps at 1k nodes**
   - Fallback: Implement LOD with distance culling
   - Mitigation: Progressive loading, virtualization

3. **Vertex mapping creates clusters**
   - Fallback: Random vertex assignment
   - Mitigation: Better region categorization algorithm

4. **Causal edges incorrectly connected**
   - Fallback: Disable causal lens
   - Mitigation: User-editable edge creation

5. **Memory enrichment times out**
   - Fallback: Use client-side keyword extraction
   - Mitigation: Implement request chunking

## 9. Assumptions & Open Questions

### Assumptions
- Brain.obj model (~50k vertices) is available and optimized
- Cryptiq API provides enrichment endpoint at /enrich
- Users have modern browsers with WebGL support
- Memory data arrives pre-sanitized (no XSS concerns)
- Timeline ranges from earliest to latest memory date

### Open Questions
- Should concept nodes be visually distinct from memory nodes?
- How to handle memories without conceptIds?
- Should private (secret: true) memories appear in shared views?
- What happens when user has >10k memories?
- Should edges persist across lens changes or rebuild?

---

## Implementation Checklist

### M0 Setup
- [ ] Create Next.js app with Refinery SDK packages
- [ ] Integrate brain.obj with vertex shader
- [ ] Implement basic Three.js controls
- [ ] Create test fixture with 10 memories
- [ ] Add FPS counter and stats panel

### M1 Core
- [ ] Build memory→node transformation
- [ ] Implement vertex mapping algorithm
- [ ] Wire up useRefineryStore
- [ ] Create NodeSprite with click handler
- [ ] Build details panel component

### M2 Features
- [ ] Implement three lens shaders
- [ ] Create TubeEdge component
- [ ] Add timeline slider to HUD
- [ ] Build category filter system
- [ ] Add pulse animation system

### M3 Polish
- [ ] Optimize render loop
- [ ] Add keyboard navigation
- [ ] Implement reduced motion
- [ ] Create loading states
- [ ] Add error boundaries