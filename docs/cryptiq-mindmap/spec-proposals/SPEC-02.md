# SPEC-02: Cryptiq Mindmap Implementation

## 1. Executive Summary

**User Promise**: Transform your encrypted memories into an explorable 3D brain visualization where neurons represent individual memories, revealing hidden patterns through affinity, temporal, and causal lenses.

**What This Proves**: The Refinery SDK can deliver deterministic, performant graph visualizations at scale (1k+ nodes) using SDK-first patterns without physics simulation.

**Top Risks**: (1) Brain vertex count limitations when nodes exceed available surface vertices, (2) Edge rendering performance impact with dense connectivity graphs, (3) Lens computation cost for large memory datasets.

## 2. End-User Experience

### 30-Second Journey
1. **0-5s**: Page loads, glowing wireframe brain appears with particles mapped to surface
2. **5-10s**: User sees their memories as glowing neurons, color-coded by category (Affinity lens default)
3. **10-15s**: Clicks a neuron—details panel slides in showing memory text, related concepts
4. **15-20s**: Hovers over connected neurons—synapse edges pulse, showing relationships
5. **20-25s**: Switches to Temporal lens—timeline appears, neurons brighten by recency
6. **25-30s**: Drags timeline—watches memories fade in/out chronologically, patterns emerge

### Primary Flows
- **Explore**: Pan/zoom brain, hover for highlights, click for details
- **Filter**: Toggle categories, search memories, hide/show secret items
- **Analyze**: Switch lenses (Affinity→Temporal→Causal), observe pattern changes
- **Timeline**: Scrub through time periods, watch memory evolution

### Key States
- **Happy Path**: 100-500 memories load instantly, smooth 60fps interaction
- **Empty State**: "Add your first memory" prompt with sample data option
- **Error State**: "Unable to load memories" with retry button and offline mode fallback

## 3. Data Plan

### Memory to Node Mapping
- **Direct 1:1**: Each memory becomes exactly one node
- **Node attributes**:
  - `id`: memory.id
  - `position`: deterministic brain vertex assignment
  - `color`: derived from originalCategory (Affinity lens)
  - `brightness`: derived from date recency (Temporal lens)
  - `size`: base + concept count modifier
  - `visible`: based on filters/timeline/secret flag

### Edge Generation by Lens

#### Affinity Edges (Default ON)
- Created between memories sharing conceptIds
- Weight = shared concept count / total unique concepts
- Undirected, rendered as subtle glow
- Color inherits from dominant category

#### Temporal Edges (Default OFF)
- Created between consecutive memories by date
- Directed from older→newer
- Pulse animation shows time flow
- Opacity based on time gap (closer = brighter)

#### Causal Edges (Default OFF)  
- Derived from conceptId overlap + temporal proximity
- Directed based on date order
- Triggered pulse on selection
- Confidence score affects edge brightness

### Sample Fixture
```json
{
  "memories": [
    {
      "id": "m1",
      "sentence": "Started learning piano at age 7",
      "conceptIds": ["music", "childhood", "learning"],
      "secret": false,
      "date": "1995-09-15",
      "originalCategory": "education"
    },
    {
      "id": "m2", 
      "sentence": "First piano recital was terrifying",
      "conceptIds": ["music", "performance", "fear"],
      "secret": false,
      "date": "1996-05-20",
      "originalCategory": "experience"
    },
    {
      "id": "m3",
      "sentence": "Met best friend at music camp",
      "conceptIds": ["music", "friendship", "summer"],
      "secret": false,
      "date": "1998-07-10",
      "originalCategory": "social"
    }
  ]
}
```

**Expected Edges**:
- Affinity: m1↔m2↔m3 (all share "music")
- Temporal: m1→m2→m3 (chronological)
- Causal: m1→m2 (learning→performance)

## 4. Rendering Plan

### Brain Surface Mapping Algorithm
1. Load brain mesh vertices (~10k vertices)
2. Divide vertices into 4 regions: frontal (30%), temporal (25%), parietal (25%), occipital (20%)
3. For each memory:
   - Hash(memory.id + originalCategory) % region_vertices
   - If vertex occupied: spiral search for nearest free vertex
   - Store vertex assignment in deterministic map
4. Fallback for overflow: Create concentric shells at 1.01x, 1.02x scale

### Particle Attributes
- **Base size**: 5px
- **Size modifiers**: +1px per conceptId (max +5px)
- **Color**: HSL mapping from categories (8 distinct hues)
- **Brightness**: 0.3-1.0 based on temporal distance
- **Pulse**: 0.5s fade in/out on hover/selection

### Synapse Edges
- **Geometry**: THREE.QuadraticBezierCurve3 between vertices
- **Material**: Emissive with 0.3 opacity
- **Width**: 1-3px based on edge weight
- **Pulse**: Animated uniform along curve for directionality
- **LOD**: Hide edges when camera distance > 100 units

### Performance Optimizations
- **Instanced particles**: Single draw call for all neurons
- **Edge culling**: Max 100 visible edges, prioritize by weight
- **Vertex reuse**: Pool vertex buffers between lens switches
- **Frame budget**: 16ms target, degrade quality if exceeded

## 5. SDK Integration

### Package Responsibilities

#### @refinery/store
- `memorySlice`: Raw memory data, filters, search state
- `lensSlice`: Active lens, lens-specific parameters
- `selectionSlice`: Selected nodes, hover state, multi-select

#### @refinery/canvas-r3f
- `BrainMesh`: Wireframe brain renderer
- `ParticleCloud`: Instanced neuron particles
- `SynapseRenderer`: Edge drawing with pulse shaders
- `CameraController`: Pan/zoom with limits

#### @refinery/graph-forge
- `computeAffinity()`: Generate affinity edges from conceptIds
- `computeTemporal()`: Generate temporal edges from dates
- `computeCausal()`: Derive causal edges from concept+time overlap

#### @refinery/widget-hud
- `LensSelector`: Three-state toggle (Affinity/Temporal/Causal)
- `TimelineSlider`: Date range control with play button
- `FilterPanel`: Category checkboxes, search input
- `StatsDisplay`: Node/edge counts, fps meter

### Event Flow
1. User clicks lens button → `dispatch(setLens('temporal'))`
2. Store triggers edge recomputation → `computeTemporal(memories)`
3. Canvas receives new edges → `updateSynapses(edges)`
4. Particles update attributes → `updateParticleColors(lens)`
5. HUD reflects state → `<LensSelector active="temporal" />`

## 6. Milestones

### M0: Brain Canvas Foundation (Week 1)
- [ ] Load and render wireframe brain mesh
- [ ] Implement camera controls (pan/zoom/rotate)
- [ ] Create particle system with 500 test points
- [ ] Basic HUD frame (non-functional)
- **Demo**: Rotating brain with random particles

### M1: Data Integration (Week 2)
- [ ] Memory store setup with sample data
- [ ] Vertex assignment algorithm
- [ ] Node selection system
- [ ] Details panel with memory content
- **Demo**: Click neurons to see real memories

### M2: Lens System (Week 3)
- [ ] Affinity lens with category colors
- [ ] Temporal lens with timeline
- [ ] Causal lens with edge computation
- [ ] Lens switching animations
- **Demo**: Switch lenses to see different patterns

### M3: Polish & Performance (Week 4)
- [ ] Synapse edge rendering
- [ ] Pulse animations and transitions
- [ ] Search and filter controls
- [ ] Performance optimizations
- **Demo**: Full experience at 60fps with 500+ nodes

## 7. Performance & QA

### Measurement Methods
- Chrome DevTools Performance profiler
- Stats.js FPS meter overlay
- React DevTools Profiler for component renders
- Memory heap snapshots for leak detection

### Performance Budgets
- First paint: <1s
- Time to interactive: <2s
- Lens switch: <800ms
- Frame time: <16ms (60fps)
- Memory usage: <200MB

### Tunable Parameters
- `maxVisibleEdges`: 50-200 (default 100)
- `particleLOD`: Distance-based size reduction
- `edgeQuality`: Line segments per curve (5-20)
- `animationSpeed`: Pulse rate multiplier (0.5-2.0)

### Smoke Tests
1. Load with 0, 1, 100, 1000 memories
2. Rapid lens switching (10x in 5s)
3. Timeline scrub from start to end
4. Select all → deselect all
5. Browser resize during interaction

## 8. Risks & Fallbacks

### 1. Brain Vertex Insufficiency
**Risk**: 10k vertices < node count for large datasets
**Mitigation**: Concentric shell expansion at 1.01x scale increments; vertex sharing with jittered offsets

### 2. Edge Rendering Bottleneck
**Risk**: 2000+ edges tank framerate
**Mitigation**: Progressive edge loading; importance-based culling; LOD system hides distant edges

### 3. Lens Computation Cost
**Risk**: Causal analysis expensive for large graphs
**Mitigation**: Web Worker computation; incremental updates; precomputed edge cache

### 4. Memory Growth
**Risk**: Retained references cause heap bloat
**Mitigation**: Explicit disposal of Three.js geometries; weak references for caches; periodic GC hints

### 5. Browser Compatibility
**Risk**: WebGL unavailable or buggy
**Mitigation**: Feature detection with 2D canvas fallback; reduced particle count mode; static image export

## 9. Assumptions & Open Questions

### Assumptions Made
- Brain mesh is pre-optimized (<50k vertices)
- Memories have valid dates (YYYY-MM-DD format)
- ConceptIds are normalized strings
- Categories limited to ~10 distinct values
- Users have 50-1000 memories typically

### Open Questions
1. Should secret memories be completely hidden or just dimmed?
2. How to handle memories with identical dates?
3. What happens when user has no memories in a time range?
4. Should edge weights affect pulse speed or just brightness?
5. Can we precompute all three lens edges or compute on-demand?

## Implementation Plan

### M0: Brain Canvas Foundation (Days 1-5)

#### Day 1: Scene Setup
- [ ] Initialize Three.js scene with WebGLRenderer
- [ ] Configure camera (PerspectiveCamera, FOV 60, near 0.1, far 1000)
- [ ] Add ambient + directional lighting
- [ ] Implement OrbitControls with constraints (min/max distance, no pan below Y=0)
- [ ] Add stats.js FPS meter

#### Day 2: Brain Mesh
- [ ] Load brain.obj model via OBJLoader
- [ ] Apply wireframe material (emissive blue, opacity 0.6)
- [ ] Extract and store vertex positions for mapping
- [ ] Implement vertex region classification (frontal/temporal/parietal/occipital)
- [ ] Test with vertex visualization debug mode

#### Day 3: Particle System
- [ ] Create BufferGeometry for particles
- [ ] Write vertex shader for particle positioning
- [ ] Write fragment shader for glow effect
- [ ] Implement instanced rendering for 1000 test particles
- [ ] Add particle size and color uniforms

#### Day 4: HUD Foundation
- [ ] Create React component structure for HUD
- [ ] Position HUD overlay with CSS Grid
- [ ] Add placeholder lens selector buttons
- [ ] Add placeholder timeline slider
- [ ] Style with minimal dark theme

#### Day 5: Integration & Testing
- [ ] Connect canvas to React app
- [ ] Verify 60fps with 1000 particles
- [ ] Test on different screen sizes
- [ ] Document setup instructions
- [ ] Create M0 demo video

### M1: Data Integration (Days 6-10)

#### Day 6: Store Setup
- [ ] Create memorySlice with Zustand
- [ ] Load sample memories fixture
- [ ] Implement filter/search reducers
- [ ] Add selection state management
- [ ] Connect store to React components

#### Day 7: Vertex Assignment
- [ ] Implement deterministic hash function
- [ ] Create vertex-to-memory mapping
- [ ] Handle collision resolution (spiral search)
- [ ] Test with various memory counts
- [ ] Add debug visualization for mapping

#### Day 8: Particle Data Binding
- [ ] Update particle positions from memory mapping
- [ ] Bind particle colors to categories
- [ ] Bind particle sizes to concept count
- [ ] Implement hover detection via raycasting
- [ ] Add selection highlighting

#### Day 9: Details Panel
- [ ] Create slide-in panel component
- [ ] Display memory sentence and metadata
- [ ] Show related concepts as tags
- [ ] Add close button and keyboard dismiss
- [ ] Implement smooth transitions

#### Day 10: Integration & Testing
- [ ] Full data flow test (load→map→render→select)
- [ ] Performance profiling with real data
- [ ] Fix any state synchronization issues
- [ ] Update documentation
- [ ] Create M1 demo video

### M2: Lens System (Days 11-15)

#### Day 11: Affinity Lens
- [ ] Implement computeAffinity() in graph-forge
- [ ] Create category→color mapping
- [ ] Update particle shader for color uniform
- [ ] Add smooth color transitions
- [ ] Test with all categories

#### Day 12: Temporal Lens
- [ ] Implement computeTemporal() function
- [ ] Create timeline component
- [ ] Map date to brightness uniform
- [ ] Add date range filtering
- [ ] Implement play/pause animation

#### Day 13: Causal Lens
- [ ] Implement computeCausal() algorithm
- [ ] Calculate confidence scores
- [ ] Create edge data structures
- [ ] Add causal highlighting
- [ ] Test edge generation accuracy

#### Day 14: Lens Switching
- [ ] Create lens selector UI component
- [ ] Implement smooth transitions between lenses
- [ ] Update store on lens change
- [ ] Coordinate particle and edge updates
- [ ] Add lens-specific UI elements

#### Day 15: Integration & Testing
- [ ] Test all three lenses with sample data
- [ ] Verify smooth transitions
- [ ] Profile lens computation performance
- [ ] Fix any visual glitches
- [ ] Create M2 demo video

### M3: Polish & Performance (Days 16-20)

#### Day 16: Edge Rendering
- [ ] Implement THREE.QuadraticBezierCurve3 for synapses
- [ ] Create edge material with emissive glow
- [ ] Add edge instancing for performance
- [ ] Implement LOD system for edges
- [ ] Test with various edge counts

#### Day 17: Animations
- [ ] Add particle pulse on hover
- [ ] Implement edge pulse animation
- [ ] Create smooth camera transitions
- [ ] Add timeline scrubbing animation
- [ ] Implement reduced motion mode

#### Day 18: Search & Filters
- [ ] Create search input component
- [ ] Implement fuzzy memory search
- [ ] Add category filter checkboxes
- [ ] Implement secret memory toggle
- [ ] Add clear filters button

#### Day 19: Performance Optimization
- [ ] Implement edge culling (max 100 visible)
- [ ] Add particle LOD by distance
- [ ] Optimize shader uniforms
- [ ] Add requestAnimationFrame throttling
- [ ] Memory leak audit and fixes

#### Day 20: Final Polish
- [ ] Accessibility audit (keyboard nav, ARIA labels)
- [ ] Cross-browser testing
- [ ] Mobile responsive adjustments
- [ ] Final performance profiling
- [ ] Create final demo video and documentation

### Critical Path Dependencies

1. **M0 → M1**: Brain mesh vertices required for mapping
2. **M1 → M2**: Memory data required for lens computation
3. **M2 → M3**: Lens system required for edge generation

### Resource Requirements

- **Development**: 1 developer, 20 days
- **Assets**: brain.obj model (provided or sourced)
- **Testing**: Chrome, Firefox, Safari browsers
- **Performance**: Mid-range laptop (8GB RAM, integrated graphics)

### Success Metrics

- **M0**: Renders at 60fps with 1000 particles
- **M1**: Loads and displays 500 memories correctly
- **M2**: Lens switch completes in <800ms
- **M3**: Full experience maintains 60fps with edges

### Risk Mitigation Schedule

- **Day 5**: Vertex count validation (mitigation ready)
- **Day 10**: Memory scale testing (fallback ready)
- **Day 15**: Lens performance check (optimization ready)
- **Day 19**: Final performance audit (degradation ready)