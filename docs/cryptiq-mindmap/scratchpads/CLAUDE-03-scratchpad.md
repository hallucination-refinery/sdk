# CLAUDE-03-scratchpad

## CONTEXT RESTATEMENT

### Purpose
Produce a concise, decision-ready SPEC-01.md and phased implementation plan for the Cryptiq Mindmap demo - an SDK-first, offline, physics-free experience with neurons anchored to a brain surface.

### Task
1. Create this scratchpad to track all decisions and reasoning
2. Read safe documentation (SDK packages, context consolidation docs, PRD/brief)
3. Make required judgment calls with justification and risks
4. Draft SPEC-01.md (3-5 pages) with all required sections
5. Create detailed implementation plan for milestones M0-M3

### Constraints (Ground Truth - Immutable)
- **SDK Architecture**: Must use Refinery SDK end-to-end (canvas • store • lens • intent)
- **Deterministic Rendering**: Neurons mapped to brain-surface vertices, no physics/drift
- **Lenses**: Affinity/Temporal/Causal - attribute-only effects (color/brightness/size/pulses)
- **Connectivity**: Connected mode only - GET /dataset.json or POST /enrich, same-origin, TLS, no third-party
- **Input Schema**: Fixed memories[] schema: {id, sentence, conceptIds[], secret, date, originalCategory}
- **Visual Anchors**: Glowing wireframe brain, particle neurons, optional curved synapse edges, minimal HUD
- **No WebGPU**: All visualization client-side without WebGPU

### Acceptance Bars
- **Performance**: 1k nodes @ 60fps pan/zoom, lens switch ≤800ms, click→highlight ≤100ms, first frame ≤2s
- **Determinism**: Same input + params = identical positions/attributes
- **UX**: 30-second walkthrough to "first insight" without training

### Workflow Progress
- [x] Create scratchpad
- [x] Restate context, task, constraints & acceptance bars
- [x] Read safe documentation
- [x] Make required judgment calls with justifications and risks
- [x] Draft SPEC-01.md per Required Output format (complete with implementation plan for M0-M3)

## DOCUMENTATION READING LOG

### Files Read:
1. **cryptiq-mindmap-brief.md**: Vision for glowing brain mindmap with neurons on surface, lenses for exploring connections
2. **architecture.md**: SDK packages structure - canvas-r3f, store (Zustand), schema (Zod), graph-forge
3. **Package.json files**: Confirmed dependencies - Three.js 0.176.0, React 19.1.0, @react-three/fiber

### Key SDK Components Identified:
- **@refinery/canvas-r3f**: React Three Fiber components for 3D rendering
- **@refinery/store**: Zustand-based state management with slices
- **@refinery/schema**: Zod validation for data models
- **@refinery/graph-forge**: Graph layout computation (deterministic)

## 2. Required Judgment Calls

### Node Basis Decision
**Choice**: Nodes = memories (direct mapping)
- **Justification**: Simplest MVP; each memory is a distinct neural activation point
- **Mapping**: 1:1 from memories[] array to nodes
- **Risk**: May lack conceptual clustering; mitigated by using conceptIds for edge creation

### Edge Policy Decision
**Choice**: 
- **Types**: All three (causal, affinity, temporal)
- **Directionality**: Temporal (directed by date), Causal (directed), Affinity (undirected)
- **Default**: Affinity ON, others OFF (toggle-able)
- **Pulses**: On hover/selection and during active lens transitions
- **Justification**: Provides richest data exploration while keeping default view clean
- **Risk**: Too many edges may clutter; mitigated by default OFF for 2/3 types

### Scale Target & Fixture
**Target**: ~500 nodes / 2000 edges
- **Justification**: Half of perf target leaves headroom; realistic for personal memory dataset
- **Sample fixture**: Will create 5-node example showing all edge types

### Interactions Decision
**Choice**:
- Single-select for details panel
- Multi-select via shift-click for comparison
- Timeline: Month granularity (collapsible to week/day)
- Filters: Include mode (show matching)
- **Justification**: Standard UX patterns, progressive disclosure
- **Risk**: Multi-select complexity; fallback to single-only if needed

### Vertex Assignment Strategy
**Choice**: Deterministic hash-based assignment with stratified regions
- Brain vertices divided into regions (frontal, temporal, parietal, occipital)
- Hash(memory.id) % region_vertices for assignment
- If collision: offset to nearest free vertex in region
- **Justification**: Preserves brain silhouette, deterministic, handles overflow
- **Risk**: Clustering at region boundaries; mitigated by jitter within vertex radius

### Accessibility & UI Minimalism
**Choice**:
- Tab navigation through controls
- Arrow keys for node selection
- Reduced motion toggle (disables pulses/transitions)
- HUD: Lens selector, timeline slider, search bar, stats counter
- **Justification**: WCAG 2.1 AA compliance, proven patterns
- **Risk**: Keyboard nav complexity; progressive enhancement approach

## 3. Key Technical Decisions

### SDK Package Usage
- **@refinery/canvas**: WebGL brain mesh, particle system
- **@refinery/store**: Memory data slice, lens state, selection state
- **@refinery/lens**: Affinity/Temporal/Causal compute functions
- **@refinery/intent**: User interaction handlers

### Data Flow
1. Load memories[] → store
2. Compute edges based on active lens
3. Map nodes to brain vertices
4. Render via canvas
5. Handle interactions via intent

### Performance Strategy
- Vertex buffer objects for particles
- Instanced rendering for edges
- LOD system: hide edges at far zoom
- RequestAnimationFrame throttling

## 4. Sample Fixture Design

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
    },
    {
      "id": "m4",
      "sentence": "Quit piano after argument with teacher",
      "conceptIds": ["music", "conflict", "decision"],
      "secret": true,
      "date": "1999-11-30",
      "originalCategory": "conflict"
    },
    {
      "id": "m5",
      "sentence": "Returned to music through guitar in college",
      "conceptIds": ["music", "growth", "learning"],
      "secret": false,
      "date": "2006-02-14",
      "originalCategory": "education"
    }
  ]
}
```

### Expected Edges
- **Temporal**: m1→m2→m3→m4→m5 (chronological)
- **Affinity**: All nodes connected via "music" concept
- **Causal**: m1→m2 (learning→recital), m4→m5 (quit→return)

## 5. Risk Analysis

1. **Brain vertex count < nodes**: Stratified sampling with jitter shells
2. **Edge rendering performance**: LOD system, edge culling beyond threshold
3. **Memory data quality**: Graceful degradation for missing fields
4. **Lens computation cost**: Memoization, web workers for large datasets
5. **Browser compatibility**: WebGL fallback to 2D canvas if needed

## 6. Implementation Phases

### M0: Brain Canvas + Minimal HUD
- Brain mesh loader and renderer
- Basic camera controls
- Node particle system
- HUD frame (non-functional)

### M1: Data Integration
- Memory store setup
- Node→vertex mapping
- Basic selection system
- Details panel

### M2: Lens System
- Affinity lens (default)
- Temporal lens
- Causal lens
- Lens switching UI

### M3: Polish & Perf
- Edge rendering
- Pulse animations
- Timeline controls
- Performance optimizations

## 7. Task Completion Summary

### Deliverables Completed:
1. **CLAUDE-01-scratchpad.md**: Created comprehensive scratchpad tracking all decisions and reasoning
2. **SPEC-01.md**: Produced complete specification document with:
   - Executive summary with user promise and risk assessment
   - Detailed 30-second user journey
   - Data plan with sample fixture
   - Rendering plan with vertex mapping algorithm
   - SDK integration architecture
   - Four milestones (M0-M3) with clear deliverables
   - Performance budgets and QA plan
   - Risk mitigation strategies
   - Detailed 20-day implementation plan with daily tasks

### Key Decisions Made:
- Direct memory-to-node mapping (1:1)
- Three lens types with Affinity as default
- Deterministic hash-based vertex assignment
- 500 node / 2000 edge scale target
- SDK-first approach using canvas-r3f, store, schema, and graph-forge packages

### Implementation Ready:
The spec provides a complete roadmap for building the Cryptiq Mindmap demo, with clear technical decisions, performance targets, and risk mitigations in place.