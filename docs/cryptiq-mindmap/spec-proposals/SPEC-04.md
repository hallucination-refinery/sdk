# SPEC-04: Unified Concept-Centric Cryptiq Mindmap

## 1. Executive Summary

**User Promise**: Transform your private memories into an explorable neural network where concept nodes on a brain surface reveal hidden patterns through affinity, temporal, and causal attribute lenses.

**What This Proves**: The Refinery SDK delivers deterministic, performant graph visualization with attribute-only lens transitions, maintaining ≥50fps at ~1k nodes without physics simulation.

**Top Risks**:

1. Concept extraction quality affects graph coherence
2. Brain vertex count limits at scale (>1k concepts)
3. Edge visibility management with dense connectivity

## 2. End-User Experience

### 30-Second Journey

1. **0-5s**: Page loads, glowing wireframe brain with concept neurons mapped to surface (optional, non-essential intro animation; **no position changes**).
2. **5-10s**: User sees derived concepts as particles, colored by category (Affinity lens)
3. **10-15s**: Clicks a concept—details panel shows contributing memories
4. **15-20s**: Selection reveals connected concepts via edges (default OFF)
5. **20-25s**: Switches to Temporal lens—concepts brighten by recency
6. **25-30s**: Timeline scrub reveals memory evolution patterns

### Primary Flows

- **Explore**: Pan/zoom brain, hover concepts for preview, click for memory provenance
- **Filter**: Toggle categories, search concepts/memories, timeline range
- **Analyze**: Switch lenses for attribute changes (no position shifts)
- **Focus**: Select concept to show edges, view memory contributors

### Key States

- **Happy Path**: 200-500 concepts from 500+ memories, smooth interaction
- **Empty State**: "Connect memories to begin" with sample data option
- **Error State**: "Processing unavailable" with pre-enriched fallback

## 3. Data Plan

### Concept Node Model

```typescript
interface ConceptNode {
  id: string // "concept_music"
  label: string // "music"
  createdFrom: string[] // ["m1", "m2", "m3"] memory IDs
  position: Vec3 // Brain vertex position (fixed)
  category: string // Dominant from memories
  firstSeen: string // Earliest memory date
  lastSeen: string // Latest memory date
  weight: number // Memory count
}
```

### Memory as Provenance Only

- Memories stored in details/metadata, not as nodes
- Aggregated into concepts via enrichment service
- Searchable but not directly visualized

### Concept Taxonomy (decided)

- Concepts are unique `conceptIds` derived from memories (normalized/case-folded).

- Minimum support = 1 (keep all); optionally merge via a small synonym map.

### Lens Attribute Mapping (NO POSITION CHANGES)

- **Affinity**: Category → color hue (8 distinct; overflow categories collapse to **neutral gray "Other"**).
- **Temporal**: Recency → brightness (day bins; brightness 0.3–1.0).
- **Causal**: Selected paths → pulse animations; **direction = oldest→newest**; **weight = co-occurrence × exp(−Δt/30 days)**; **pulses fire on selection only**.

### Edge Policy

- **Default**: OFF (performance + clarity)
- **On Hover/Selection**: Show edges to connected concepts
- **Optional**: Top-K global edges toggle
- **Visibility**: Only render if both endpoints visible

### Sample Fixture

```json
{
  "concepts": [
    {
      "id": "c_music",
      "label": "music",
      "createdFrom": ["m1", "m2", "m3"],
      "category": "education",
      "firstSeen": "1995-09-15",
      "lastSeen": "1998-07-10",
      "weight": 3
    },
    {
      "id": "c_learning",
      "label": "learning",
      "createdFrom": ["m1"],
      "category": "education",
      "firstSeen": "1995-09-15",
      "lastSeen": "1995-09-15",
      "weight": 1
    }
  ],
  "edges": [
    {
      "source": "c_music",
      "target": "c_learning",
      "type": "affinity",
      "weight": 0.6
    }
  ]
}
```

## 4. Rendering Plan

### Brain Surface Mapping

1. Load brain mesh (~10k vertices)
2. Region bucketing: frontal (30%), temporal (25%), parietal (25%), occipital (20%)
3. Deterministic assignment:
   - `hash(concept.id) % region_vertices`
   - Collision: spiral search for nearest free
   - Overflow: 1.01x, 1.02x concentric shells + jitter
4. Preserve silhouette stability

### Undersubscription Handling (few concepts vs many vertices)

- Do not add fake data nodes. Maintain silhouette with a **non-data ambient particle layer** (decorative, non-interactive) clearly distinct from concept neurons.

- Emphasize sparse concepts via **size/halo** adjustments; mapping remains deterministic.

### Particle Attributes

- **Size**: 3-8px (base + weight modifier)
- **Color**: HSL from category (Affinity)
- **Brightness**: 0.3-1.0 from recency (Temporal)
- **Secret handling (placeholder)**: Dim (0.5x opacity), reduce size (0.7x); final policy **deferred** for MVP.
- **Pulse**: 0.5s on hover/selection

### Synapse Edges

- **Geometry**: QuadraticBezierCurve (lighter than tubes)
- **Rendering**: Additive blend, 0.3 base opacity
- **Visibility Cap**: ≤100 edges (unless focused)
- **LOD**: Distance culling >100 units
- **Pulses**: Only on causal paths during focus

### Performance Strategy

- Instanced particle rendering
- Edge batching with frustum culling
- Attribute-only updates (no position recalc)
- Frame budget: 16ms with quality degradation

## 5. SDK Integration

### Package Responsibilities

#### @refinery/store

- `conceptSlice`: Concept nodes and metadata
- `lensSlice`: Active lens, parameters (NO position data)
- `selectionSlice`: Selected concepts, hover state
- `memorySlice`: Memory provenance data

#### @refinery/canvas-r3f

- `BrainMesh`: Wireframe renderer
- `ConceptParticles`: Instanced concept neurons
- `EdgeRenderer`: Bezier curves with LOD
- `CameraController`: Constrained orbit controls

#### @refinery/graph-forge

- `enrichToGraph()`: memories[] → concepts + edges
- `computeAffinityAttributes()`: Category-based colors
- `computeTemporalAttributes()`: Recency-based brightness
- `computeCausalPaths()`: Selection-based pulses

#### @refinery/widget-hud

- `LensSelector`: Affinity/Temporal/Causal toggle
- `Timeline`: Date range with concept aggregation
- `FilterPanel`: Categories, search
- `DetailsPanel`: Concept label, count, first/last seen, **top 3 memory snippets** (IDs only if secret).

### Event Flow (Attribute-Only)

1. Lens change → `dispatch(setLens('temporal'))`
2. Store update → Attribute recalculation only
3. Canvas update → Shader uniforms only
4. No position recalculation
5. Complete in <800ms

## 6. Milestones

### M0: Foundation & Fixture (Week 1)

- [ ] Brain mesh with vertex extraction
- [ ] Concept particle system (100 test nodes)
- [ ] Camera controls
- [ ] Minimal HUD shell
- [ ] Sample enriched fixture
- **Demo**: Brain with test concepts

### M1: Concept Integration (Week 2)

- [ ] Enrichment service connection (Connected mode)
- [ ] Concept→vertex mapping
- [ ] Selection system
- [ ] Details panel with memory provenance
- **Demo**: Real concepts with memory details

### M2: Attribute Lenses (Week 3)

- [ ] Affinity (category colors)
- [ ] Temporal (recency brightness)
- [ ] Causal (path pulses)
- [ ] Attribute-only transitions
- **Demo**: Lens switching without position changes

### M3: Edges & Polish (Week 4)

- [ ] Selective edge rendering
- [ ] Timeline with aggregation
- [ ] Search/filter system
- [ ] Performance optimization
- **Demo**: Complete experience at ≥50fps

### M3: Polish & Performance (Days 16-20)

#### Day 16: Edge Rendering

- [ ] Implement QuadraticBezierCurve edges
- [ ] Add edge visibility logic (default OFF)
- [ ] Show edges on selection only
- [ ] Implement weight→opacity mapping
- [ ] Batch edges for performance

#### Day 17: Edge Optimization

- [ ] Implement LOD system (distance culling)
- [ ] Add frustum culling
- [ ] Create Top-K edge toggle
- [ ] Cap visible edges at 100
- [ ] Profile with 1000 edges

#### Day 18: Timeline & Filters

- [ ] Create timeline with concept aggregation
- [ ] Add temporal binning (day/week/month)
- [ ] Implement fuzzy search
- [ ] Add category filter chips
- [ ] Create clear all button

#### Day 19: Performance Tuning

- [ ] Optimize shader uniforms
- [ ] Implement frame budget monitoring
- [ ] Add reduced motion mode
- [ ] Memory leak audit
- [ ] Ensure 60fps with 1000 concepts

#### Day 20: Final Polish

- [ ] Accessibility improvements (ARIA, keyboard)
- [ ] Cross-browser testing
- [ ] Mobile responsive adjustments
- [ ] Final performance profiling
- **M3 Demo**: Production-ready at ≥50fps

### Critical Success Metrics

- First frame ≤2s
- Pan/zoom ≥50fps sustained
- Lens switch ≤800ms (attributes only)
- Click→highlight ≤100ms
- 500+ concepts rendered smoothly
- Edges default OFF, cap at 100 visible
- All interactions deterministic
- Connected (strict) mode enforced

## 7. Performance & QA

### Unified Acceptance Bars

- **First frame**: ≤2s
- **Pan/zoom**: ≥50fps sustained
- **Lens switch**: ≤800ms (attributes only)
- **Click→highlight**: ≤100ms
- **Visible edges**: ≤100 (unless focused)

### Measurement

- Chrome Performance Profiler
- stats.js overlay
- Custom Performance API marks

### Tunable Parameters

- `maxVisibleEdges`: 100
- `edgeVisibility`: "selected" | "top-k" | "none"
- `particleDetail`: 1-3 (LOD levels)
- `pulseSpeed`: 0.5-2.0

### Smoke Tests

1. 0, 100, 500, 1000 concepts
2. Rapid lens switching (10x)
3. Select all → deselect pattern
4. Timeline full scrub
5. Memory search across concepts

## 8. Risks & Fallbacks

### 1. Concept Extraction Quality

**Risk**: Poor concept clustering from memories
**Mitigation**: Manual concept editing UI; pre-validated fixtures

### 2. Vertex Exhaustion

**Risk**: >10k concepts exceed surface
**Mitigation**: Thin shells + jitter; region rebalancing; concept merging

### 3. Edge Performance

**Risk**: Dense graphs tank framerate
**Mitigation**: Default OFF; selection-only; Top-K limit; LOD culling

### 4. Enrichment Failure

**Risk**: Service timeout/error
**Mitigation**: Pre-enriched dataset.json fallback (Connected strict)

### 5. Attribute Confusion

**Risk**: Users expect position changes with lenses
**Mitigation**: Clear UI language; smooth attribute transitions; onboarding

## 9. Assumptions & Open Questions

### Assumptions

- Enrichment service extracts ~0.5 concepts per memory
- Brain mesh optimized (<50k vertices)
- Categories converge to ~10 distinct values
- Temporal ranges span years not centuries
- Connected (strict) mode with same-origin only

### Decisions Locked

- **Nodes = Concepts** (not memories)
- **Concept taxonomy = unique conceptIds (normalized; min support = 1; optional synonym map)**
- **Edges default OFF** (edges appear on hover/selection)
- **Bezier curves** (not tubes) for MVP
- **Temporal edges excluded (MVP)**
- **Heuristic causal** (no NLP)
- **Temporal lens bins = day; brightness 0.3–1.0**

### Open Questions

1. Concept taxonomy source (conceptIds vs clustering)?
2. Temporal bin granularity for wide date ranges?
3. Details panel: which memory snippets to show?
4. Secret memories: visibility in concept aggregation?
5. Edge weight visualization (width vs opacity)?
