# SPEC-03.md — Cryptiq Mindmap Implementation Specification

## Executive Summary

**User Promise**: Experience your memories as a living neural network anchored to a brain surface, revealing hidden patterns through affinity, temporal, and causal lenses in a deterministic, physics-free visualization.

**What This Proves**: Refinery SDK delivers performant, deterministic graph rendering with multi-lens exploration while maintaining visual stability and supporting 1k+ node graphs at 60fps.

**Top Risks**: (1) Vertex oversubscription requiring jitter shell fallback, (2) Edge density overwhelming visual clarity, (3) Causal inference accuracy from limited sentence data, (4) Performance degradation with 2k+ edges, (5) Brain mesh loading/rendering overhead.

## End-User Experience

### 30-Second Journey
1. **0-3s**: Brain wireframe materializes, memories appear as glowing neurons on surface
2. **3-8s**: User recognizes color patterns (categories) across brain regions
3. **8-12s**: Clicks neuron—details panel reveals memory text, date, concepts
4. **12-18s**: Sees connected memories pulse via shared concepts (affinity edges)
5. **18-23s**: Switches to Temporal lens—timeline appears, recent memories brighten
6. **23-30s**: Scrubs timeline, watches memory patterns evolve across months

### Primary Flows
- **Discovery**: Load → see brain → identify clusters → click for details
- **Exploration**: Pan/zoom → hover highlights → follow edge connections
- **Analysis**: Switch lenses → observe attribute changes → filter categories
- **Time Travel**: Scrub timeline → watch temporal patterns → identify gaps

### Key States
- **Happy**: 500 memories render smoothly, instant lens switches, responsive interaction
- **Empty**: "No memories yet" with sample data button, brain renders in ghost mode
- **Error**: Fallback to cached data, "Offline mode" indicator, retry connection button
- **Loading**: Brain wireframe first, then particles fade in progressively

## Data Plan

### Memory Node Mapping
Each memory maps directly to one node with deterministic positioning:
```javascript
{
  id: memory.id,
  position: hashToVertex(memory.id, brainVertices),
  attributes: {
    color: categoryColors[memory.originalCategory],
    size: 5 + memory.conceptIds.length,
    brightness: 1.0 - daysSince(memory.date) / 365,
    opacity: memory.secret ? 0.3 : 1.0
  }
}
```

### Edge Generation

**Affinity Edges** (default ON, undirected):
- Connect memories sharing ≥1 conceptId
- Weight = |shared concepts| / |unique concepts|
- Render as subtle curved arcs
- Color blends source/target categories

**Temporal Edges** (default OFF, directed):
- Connect memories within 7-day windows
- Direction: older → newer
- Opacity inversely proportional to time gap
- Pulse animation on hover

**Causal Edges** (default OFF, directed):
- Pattern detection: "started"→"completed", "learned"→"applied"
- Require conceptId overlap + temporal sequence
- Confidence score affects brightness
- Triggered pulse shows causality flow

### Sample Fixture
```json
{
  "memories": [
    {
      "id": "m_2024_001",
      "sentence": "Started learning Rust for systems programming",
      "conceptIds": ["programming", "rust", "learning"],
      "secret": false,
      "date": "2024-01-15",
      "originalCategory": "technical"
    },
    {
      "id": "m_2024_002",
      "sentence": "Built first WebAssembly module in Rust",
      "conceptIds": ["programming", "rust", "wasm", "achievement"],
      "secret": false,
      "date": "2024-02-28",
      "originalCategory": "projects"
    },
    {
      "id": "m_2024_003",
      "sentence": "Debugging memory leak was frustrating",
      "conceptIds": ["programming", "debugging", "challenges"],
      "secret": true,
      "date": "2024-03-10",
      "originalCategory": "technical"
    }
  ]
}
```

Expected edges:
- Affinity: All three connected via "programming"
- Temporal: m_2024_001 → m_2024_002 (44 days)
- Causal: m_2024_001 → m_2024_002 (learning → achievement)

## Rendering Plan

### Brain Surface Mapping
1. Load brain mesh (~10k vertices)
2. Hash memory.id to vertex index: `hash(id) % vertexCount`
3. Position = vertex.position * 1.0 (on surface)
4. Oversubscription handling:
   - First N memories: surface vertices
   - Overflow: jitter shell at 1.05x radius
   - Maintain determinism via seeded random

### Particle Attributes
- Base size: 5 units
- Size modifier: +1 per conceptId (max +5)
- Color: HSL with category hue, 70% saturation
- Brightness: Affinity=category, Temporal=recency, Causal=confidence
- Opacity: 1.0 normal, 0.3 secret, 0.1 filtered

### Synapse Edges
- Geometry: THREE.QuadraticBezierCurve3
- Material: Emissive with additive blending
- Width: 1-3 units based on weight
- Pulse: Shader-based animation along curve
- LOD: Hide edges when zoomed out >2x

### Performance Optimizations
- Instanced rendering for particles
- Edge batching by lens type
- Frustum culling for off-screen elements
- Progressive rendering: brain → particles → edges
- FPS monitoring with quality auto-adjust

## SDK Integration

### Package Structure
```
@packages/canvas - Brain mesh, particle system, edge renderer
@packages/store - Memory state, lens state, filter state
@packages/lens - Affinity/Temporal/Causal transformations
@packages/intent - User interactions, selections, timeline
```

### Event Flow
1. User clicks neuron → Intent.select(nodeId)
2. Store updates selection → Store.setSelected(nodeId)
3. Lens applies highlight → Lens.highlight(node, edges)
4. Canvas renders changes → Canvas.updateAttributes(updates)

### State Slices
```typescript
interface MindmapState {
  memories: Memory[]
  nodes: Map<string, Node>
  edges: { affinity: Edge[], temporal: Edge[], causal: Edge[] }
  activeLens: 'affinity' | 'temporal' | 'causal'
  filters: { categories: Set<string>, timeRange: [Date, Date] }
  selection: { nodeId?: string, edgeIds: string[] }
}
```

## Milestones

### M0: Brain Canvas (Week 1)
- Load and render brain wireframe mesh
- Map 50 sample memories to vertices
- Basic pan/zoom controls
- Minimal HUD (lens selector, FPS counter)
- **Demo**: Rotating brain with static neurons

### M1: Lens System (Week 2)
- Implement three lens transformations
- Affinity edges with category colors
- Timeline slider for temporal lens
- Node selection and details panel
- **Demo**: Switch lenses, see visual changes

### M2: Interactions (Week 3)
- Hover highlights with edge pulsing
- Multi-select with comparison view
- Category filters and search
- Keyboard navigation (tab/arrows)
- **Demo**: Full interaction flow

### M3: Polish & Performance (Week 4)
- Performance optimizations for 1k nodes
- Loading states and error handling
- Accessibility features (reduced motion, high contrast)
- Export snapshot functionality
- **Demo**: Production-ready experience

## Performance & QA

### Measurement
- Chrome DevTools Performance profiler
- Stats.js for FPS monitoring
- Custom metrics: lens switch time, click response time
- Memory profiling for leak detection

### Budgets
- First frame: <2s
- Lens switch: <800ms
- Pan/zoom: 60fps minimum
- Click response: <100ms
- Memory usage: <200MB for 1k nodes

### Tunable Parameters
- `maxEdgesVisible`: 500-2000
- `particleQuality`: low/medium/high
- `edgeCurveSegments`: 8-32
- `enablePulseAnimations`: true/false

### Smoke Tests
1. Load 10/100/1000 memories
2. Switch all three lenses rapidly
3. Pan/zoom to extremes
4. Select/deselect 50 nodes quickly
5. Timeline scrub entire range

## Risks & Fallbacks

1. **Brain vertex exhaustion**
   - Risk: >10k memories exceed vertices
   - Fallback: Multi-layer jitter shells at 1.05x, 1.1x, 1.15x

2. **Edge rendering crushes FPS**
   - Risk: 2k+ edges tank performance
   - Fallback: Dynamic LOD, show only top 500 by weight

3. **Causal inference inaccuracy**
   - Risk: Poor pattern matching from sentences
   - Fallback: Disable by default, mark as "experimental"

4. **Memory leaks in particle system**
   - Risk: Long sessions degrade performance
   - Fallback: Periodic geometry disposal and recreation

5. **Brain mesh fails to load**
   - Risk: Network issues or CORS
   - Fallback: Procedural sphere with brain-like distortion

## Assumptions & Open Questions

### Assumptions
- Brain mesh available as .obj or .gltf file
- Three.js already integrated in SDK canvas package
- Memory data arrives pre-sanitized (no XSS in sentences)
- Browser supports WebGL2 (no WebGPU required)
- Connected mode serves from same origin

### Open Questions
- Should secret memories be completely hidden or just dimmed?
- How to handle memories with 0 conceptIds?
- Should timeline show gaps or compress empty periods?
- Edge bundling for visual clarity—implement or not?
- Support export to image/video for sharing?

## Implementation Plan

### M0: Brain Canvas + Minimal HUD (Week 1)

#### Day 1-2: Environment Setup
- [ ] Create app scaffold in SDK workspace
- [ ] Configure Three.js in @packages/canvas
- [ ] Set up development server with hot reload
- [ ] Create basic HTML shell with canvas element
- [ ] Initialize Stats.js for FPS monitoring

#### Day 3-4: Brain Mesh Integration
- [ ] Source/create brain .obj or .gltf model (~10k vertices)
- [ ] Implement mesh loader in canvas package
- [ ] Apply wireframe material with emissive glow
- [ ] Add orbit controls for pan/zoom/rotate
- [ ] Optimize mesh rendering (indexed geometry, LOD)

#### Day 5-6: Memory Mapping
- [ ] Create sample fixture with 50 memories
- [ ] Implement deterministic hash function for vertex assignment
- [ ] Render memories as instanced particles
- [ ] Map particle positions to brain vertices
- [ ] Add basic particle attributes (size, color)

#### Day 7: Minimal HUD
- [ ] Create lens selector (Affinity/Temporal/Causal)
- [ ] Add FPS counter overlay
- [ ] Implement basic CSS layout for HUD
- [ ] Wire lens selector to store state
- [ ] Test with different memory counts

**M0 Deliverable**: Rotating brain with 50 neurons, lens selector, 60fps

### M1: Lens System + Edges (Week 2)

#### Day 8-9: Store & State Management
- [ ] Define MindmapState interface
- [ ] Implement memory slice in store
- [ ] Create lens state management
- [ ] Add node/edge data structures
- [ ] Set up Redux DevTools integration

#### Day 10-11: Affinity Lens
- [ ] Parse conceptIds to generate affinity edges
- [ ] Implement category → color mapping
- [ ] Create edge geometry (Bezier curves)
- [ ] Apply emissive materials with blending
- [ ] Optimize edge batching for performance

#### Day 12-13: Temporal Lens
- [ ] Add timeline slider component
- [ ] Calculate date-based brightness
- [ ] Implement temporal edge generation
- [ ] Add directional pulse shader
- [ ] Handle timeline scrubbing events

#### Day 14: Causal Lens & Details Panel
- [ ] Implement causal pattern detection
- [ ] Generate causal edges with confidence scores
- [ ] Create details panel component
- [ ] Wire selection events to panel
- [ ] Display memory text, date, concepts

**M1 Deliverable**: Three working lenses with edges, timeline, details panel

### M2: Rich Interactions (Week 3)

#### Day 15-16: Hover & Selection
- [ ] Implement raycasting for mouse interaction
- [ ] Add hover state with edge highlighting
- [ ] Create selection state management
- [ ] Implement neighbor highlighting
- [ ] Add selection visual feedback

#### Day 17-18: Multi-Select & Comparison
- [ ] Add shift-click for multi-select
- [ ] Create comparison view in details panel
- [ ] Implement selection box rendering
- [ ] Add clear selection button
- [ ] Handle deselection logic

#### Day 19-20: Filters & Search
- [ ] Create category filter chips
- [ ] Implement include/exclude modes
- [ ] Add search input with fuzzy matching
- [ ] Update visibility based on filters
- [ ] Animate filter transitions

#### Day 21: Keyboard Navigation
- [ ] Add tab navigation through nodes
- [ ] Implement arrow key graph traversal
- [ ] Create keyboard shortcut for lens switching
- [ ] Add escape key for deselection
- [ ] Document accessibility features

**M2 Deliverable**: Full interaction suite with filters, search, keyboard nav

### M3: Polish & Performance (Week 4)

#### Day 22-23: Performance Optimization
- [ ] Profile with Chrome DevTools
- [ ] Implement frustum culling
- [ ] Add dynamic LOD for edges
- [ ] Optimize particle instancing
- [ ] Create quality settings (low/medium/high)

#### Day 24-25: Loading & Error States
- [ ] Design loading sequence (brain → particles → edges)
- [ ] Add progress indicators
- [ ] Implement error boundaries
- [ ] Create offline mode fallback
- [ ] Add retry mechanisms

#### Day 26-27: Accessibility & Polish
- [ ] Add reduced motion toggle
- [ ] Implement high contrast mode
- [ ] Create screen reader descriptions
- [ ] Add tooltip system
- [ ] Polish visual transitions

#### Day 28: Testing & Documentation
- [ ] Run smoke test suite
- [ ] Load test with 1k memories
- [ ] Document API interfaces
- [ ] Create user guide
- [ ] Prepare demo script

**M3 Deliverable**: Production-ready, accessible, performant experience

### Post-Launch Checklist

#### Performance Validation
- [ ] Verify 60fps with 1k nodes
- [ ] Confirm <800ms lens switches
- [ ] Check <100ms click response
- [ ] Validate <2s first frame
- [ ] Monitor memory usage <200MB

#### Quality Assurance
- [ ] Test on Chrome, Firefox, Safari
- [ ] Verify mobile touch interactions
- [ ] Check accessibility with screen reader
- [ ] Validate keyboard-only navigation
- [ ] Test with various data scales

#### Documentation
- [ ] API reference for SDK integration
- [ ] User guide with screenshots
- [ ] Performance tuning guide
- [ ] Troubleshooting section
- [ ] Example datasets

### Risk Monitoring

**Weekly checkpoints**:
1. Vertex count vs memory count ratio
2. Edge rendering FPS impact
3. Memory leak detection
4. Browser compatibility issues
5. User feedback on causal accuracy

**Fallback triggers**:
- FPS <30: Reduce edge segments
- Memory >300MB: Reset particle system
- Vertices exhausted: Enable jitter shells
- Edges >2k: Apply weight threshold
- Load failure: Use procedural sphere