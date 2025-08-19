# CLAUDE-02-scratchpad.md — Cryptiq Mindmap Spec Development

## Context Restatement

### Task
Produce a concise, decision-ready SPEC-01.md and phased implementation plan for the Cryptiq Mindmap demo - an SDK-first, offline, physics-free experience with neurons anchored to a brain surface.

### Constraints (Ground Truth)
1. **SDK Architecture**: Must use Refinery SDK end-to-end (canvas • store • lens • intent) - no ad-hoc render/state paths
2. **Positioning**: Deterministic & physics-free - neurons mapped to brain-surface vertices, no simulated drift
3. **Lenses**: Affinity/Temporal/Causal - attribute-only effects (color/brightness/size/pulses), not geometry shuffles
4. **Connectivity**: Connected (strict) - GET /dataset.json or POST /enrich with memories[] → graph; same-origin only, TLS, no third-party services/analytics/LLM calls, minimal PII, ephemeral processing, client-side visualization, no WebGPU
5. **Data Schema**: memories[] fixed: { id: string, sentence: string, conceptIds: string[], secret: boolean, date: YYYY-MM-DD, originalCategory: string }
6. **Visual Anchors**: glowing wireframe brain canvas, particle neurons, optional curved synapse edges, minimal HUD, details panel
7. **Demo Layer**: Brain mesh/shaders/HUD live in app layer using SDK contracts, not SDK core

### Acceptance Bars
1. **Performance**: ~1k nodes @ ≥60 fps pan/zoom; lens switch ≤800 ms; click→highlight ≤100 ms; first frame ≤2 s on mid-range laptop
2. **Determinism**: same input + params ⇒ identical positions/attributes
3. **UX**: 30-second walkthrough to "first insight" without training

### Required Judgment Calls
1. Node basis: MVP nodes = memories or derived concepts
2. Edge policy: which types, directionality, default on/off, pulse animations
3. Scale target & fixture: ~N nodes / M edges with sample JSON
4. Interactions: single vs multi-select, details fields, timeline granularity, filter semantics
5. Vertex assignment: strategy when nodes > brain vertices
6. Accessibility & UI minimalism: keyboard nav, reduced motion, minimal HUD

### File Boundaries
- Safe to read: SDK packages (@packages), current branch context (@docs/context-consolidation/final-docs), CLAUDE.md, PRD/brief (@docs/cryptiq-mindmap/cryptiq-mindmap-brief.md)
- Avoid: legacy/stalled docs (treat as unverified)
- Never: modify build/CI, delete files, introduce WebGPU/network dependencies

## Next Steps
1. Read safe documentation to understand SDK architecture and capabilities
2. Review PRD/brief materials for product requirements
3. Make judgment calls with clear justifications
4. Draft SPEC-01.md with all required sections
5. Create detailed implementation plan for M0-M3

## Documentation Analysis Notes

### SDK Architecture
- **Core packages**: canvas-r3f (React Three Fiber), store (Zustand), graph-forge (layout), schema (validation)
- **Key APIs**: forgeGraph(), useRefineryStore(), Canvas/CanvasProvider components
- **Data flow**: RawMemory[] → forgeGraph() → ForgeResult → Store → Canvas rendering
- **Intent system**: CREATE_NODE, SELECT_NODE, etc. for user interactions
- **No physics**: Deterministic positioning via graph-forge, positions static

### Cryptiq Data Structure
- **Fixed schema**: memories[] with {id, sentence, conceptIds[], secret, date, originalCategory}
- **Derived nodes**: Can create concept nodes from conceptIds referenced in memories
- **Legacy structure** (adaptable): nodes with id/title/type/ring/cluster/dates/createdFrom
- **Edge sets per lens**: edges_causal, edges_affinity, edges_temporal

### Brain Canvas Integration
- Existing 3dbrain repo shows wireframe brain with particle neurons
- Particles need mapping to brain surface vertices (not random sphere)
- Synapse edges via THREE.TubeGeometry for curved connections
- Shaders handle lens effects (color/brightness/size)

## Judgment Calls & Justifications

### 1. Node Basis
**Decision**: Nodes = memories + derived concepts (hybrid approach)
- Each memory becomes a node (preserves raw data fidelity)
- Each unique conceptId becomes a concept node (enables concept clustering)
- **Justification**: Provides both granular memory view and higher-level concept patterns
- **Risk**: May exceed 1k nodes with large memory sets → mitigate with filtering

### 2. Edge Policy
**Decision**: 
- **Affinity**: Undirected edges between nodes sharing conceptIds (default ON)
- **Temporal**: Directed edges for sequential memories within 7-day window (default OFF)
- **Causal**: Directed edges when memory content indicates causality keywords (default OFF)
- **Pulses**: Show on hover/selection along connected edges
- **Justification**: Affinity is most intuitive default; temporal/causal are advanced views
- **Risk**: Causal detection may be inaccurate without LLM → use simple keyword matching

### 3. Scale Target & Fixture
**Decision**: Target ~800 nodes, ~2000 edges for demo
- 500 memories + 300 concept nodes
- **Sample fixture**: 10 memories, 15 concepts, ~30 edges
- **Justification**: Under 1k node performance target, rich enough for insights
- **Risk**: Real data may vary → implement progressive loading

### 4. Interactions
**Decision**:
- **Selection**: Single-click select, shift-click multi-select
- **Details**: Show sentence, date, concepts, related memories on selection
- **Timeline**: Month granularity with day-level precision on zoom
- **Filters**: Include mode (show matching), exclude mode (hide matching)
- **Justification**: Standard interaction patterns, minimal learning curve
- **Risk**: Multi-select performance → limit to 50 nodes

### 5. Vertex Assignment
**Decision**: Stratified vertex assignment with jitter shell
- Divide brain vertices into regions by category
- Assign nodes round-robin within region vertices
- When oversubscribed, create jitter shell 5-10 units from surface
- **Justification**: Preserves brain silhouette while handling overflow
- **Risk**: Jitter may look messy → limit to 20% overflow maximum

### 6. Accessibility & UI Minimalism
**Decision**:
- Tab navigation through UI controls
- Arrow keys for node selection traversal
- Reduced motion toggle disables pulses/animations
- HUD: lens switcher, timeline, search, edge toggle only
- **Justification**: Essential controls only, keyboard-navigable
- **Risk**: May need tooltips → add on-demand help overlay

## Risk Assessment

1. **Performance degradation >1k nodes**
   - Mitigation: LOD system, edge culling at distance
2. **Vertex oversubscription visual clutter**
   - Mitigation: Opacity falloff for overflow nodes
3. **Causal edge accuracy without LLM**
   - Mitigation: Simple keyword matching, user-editable
4. **Brain model loading time**
   - Mitigation: Progressive loading, low-poly fallback
5. **Memory data privacy concerns**
   - Mitigation: All processing client-side, no external calls