# CLAUDE-01-scratchpad.md — Cryptiq Mindmap Spec Work

## 1. Context Restatement

### Task
Produce a concise, decision-ready SPEC-01.md and phased implementation plan for the Cryptiq Mindmap demo.

### Core Constraints
- **SDK-first approach**: Use Refinery SDK end-to-end (canvas • store • lens • intent)
- **Deterministic & physics-free**: Neurons mapped to brain-surface vertices
- **Lenses**: Affinity / Temporal / Causal — attribute-only effects (color/brightness/size/pulses)
- **Connectivity**: Connected mode only — GET /dataset.json or POST /enrich, same-origin, TLS, no third-party
- **Memory schema**: Fixed `{ id, sentence, conceptIds[], secret, date, originalCategory }`
- **Visual anchors**: Glowing wireframe brain, particle neurons, optional curved synapse edges, minimal HUD
- **No WebGPU**

### Acceptance Bars
- **Performance**: ~1k nodes @ ≥60 fps pan/zoom; lens switch ≤800 ms; click→highlight ≤100 ms; first frame ≤2 s
- **Determinism**: Same input + params = identical positions/attributes
- **UX**: 30-second walkthrough to "first insight"

### Workflow Progress
- [x] Restate context, task, constraints & acceptance bars
- [ ] Make required judgment calls with justifications and risks
- [ ] Draft SPEC-01.md per Required Output format
- [ ] Create implementation plan & checklist for M0-M3

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