# CLAUDE-03-scratchpad.md

## Context Restatement

### Task
Produce a concise, decision-ready SPEC-03.md and phased implementation plan for the Cryptiq Mindmap demo - an SDK-first, offline, physics-free experience with neurons anchored to a brain surface.

### Constraints
- **SDK Architecture**: Must use Refinery SDK end-to-end (canvas • store • lens • intent)
- **Deterministic**: Neurons mapped to brain-surface vertices, no physics simulation
- **Lenses**: Affinity/Temporal/Causal - attribute-only effects (color/brightness/size/pulses)
- **Connectivity**: GET /dataset.json or POST /enrich, same-origin only, TLS, no third-party services
- **Input Schema**: Fixed memories[] structure with id, sentence, conceptIds, secret, date, originalCategory
- **Visual Elements**: Glowing wireframe brain, particle neurons, optional curved synapse edges, minimal HUD
- **No WebGPU**: Client-side visualization only

### Acceptance Bars
- **Performance**: ~1k nodes @ ≥60 fps pan/zoom; lens switch ≤800 ms; click→highlight ≤100 ms; first frame ≤2 s
- **Determinism**: Same input + params = identical positions/attributes
- **UX**: 30-second walkthrough to first insight without training

## Judgment Calls & Justifications

### 1. Node Basis
**Decision**: Nodes = memories only (not derived concepts initially)
**Justification**: 
- Simplest mapping from input data
- Each memory has unique id, position, and attributes
- Concepts can be shown via edge connections between memories sharing conceptIds
**Risk**: May limit visual richness; mitigated by rich edge visualization

### 2. Edge Policy
**Decision**: 
- **Affinity edges**: Between memories sharing conceptIds (undirected, default ON)
- **Temporal edges**: Sequential memories within 7-day window (directed, default OFF)
- **Causal edges**: Derived from sentence analysis patterns (directed, default OFF)
- **Pulse animations**: On hover/select and during active lens changes
**Justification**: Affinity is most intuitive default; temporal/causal are advanced views
**Risk**: Edge density may overwhelm; mitigated by lens toggling and transparency

### 3. Scale Target & Fixture
**Decision**: Target ~500 nodes, ~2000 edges
**Sample fixture**:
```json
{
  "memories": [
    {"id": "m1", "sentence": "Started learning piano", "conceptIds": ["music", "learning"], "secret": false, "date": "2024-01-15", "originalCategory": "personal"},
    {"id": "m2", "sentence": "First piano recital", "conceptIds": ["music", "achievement"], "secret": false, "date": "2024-02-20", "originalCategory": "milestone"},
    {"id": "m3", "sentence": "Teaching sister piano", "conceptIds": ["music", "teaching", "family"], "secret": false, "date": "2024-03-10", "originalCategory": "personal"}
  ]
}
```
**Justification**: Realistic memory density for 1-2 year period
**Risk**: May need LOD for larger datasets

### 4. Interactions
**Decision**: 
- Single-select for details panel
- Multi-select via shift-click for comparison
- Timeline: month granularity with zoom to week/day
- Filters: Include mode (show only) vs Exclude mode (hide)
**Justification**: Balances simplicity with power-user features
**Risk**: Multi-select complexity; mitigated by clear visual feedback

### 5. Vertex Assignment
**Decision**: Deterministic hash-based assignment with stratified regions
- Brain divided into regions (frontal, parietal, temporal, occipital)
- Hash(memory.id) % vertices_in_region
- When oversubscribed: create jitter shell at 1.05x radius
**Justification**: Preserves brain silhouette, ensures determinism
**Risk**: Clustering in regions; mitigated by good hash distribution

### 6. Accessibility & UI
**Decision**:
- Tab navigation through neurons
- Arrow keys for graph traversal
- Reduced motion toggle disables pulses/transitions
- High contrast mode for better visibility
- Screen reader descriptions for nodes/edges
**Justification**: Basic a11y coverage for demo
**Risk**: Complex graph navigation; mitigated by logical traversal order

## Next Steps
1. Review existing SPEC files for context
2. Draft SPEC-03.md with these decisions
3. Create detailed implementation plan

## Notes & Observations
- Branch is ~229 commits ahead of main, CI unreliable
- Must target refactor/context-consolidation-aug17 branch
- Demo-specific visuals stay in app layer, not SDK core
- Connected mode allows dataset.json or enrich endpoint only