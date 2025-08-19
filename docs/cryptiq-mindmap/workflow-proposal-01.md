# Workflow Proposal 01: Cryptiq Mindmap M0.5 Implementation

**Created:** 2025-08-19  
**Scope:** 10-hour milestone for brain mesh integration and concept mapping  
**Constraints:** SDK-first, concept nodes only, attribute-only lenses, no WebGPU

---

## Section A — Understanding (with quotes)

### Core Vision
From SPEC-04.md, Line 5: **"Transform your private memories into an explorable neural network where concept nodes on a brain surface reveal hidden patterns through affinity, temporal, and causal attribute lenses."**

Key understanding: This is about mapping **concept nodes** (not individual memories) onto a 3D brain surface, with visual attributes changing per lens but positions remaining fixed.

### Data Architecture  
From SPEC-04.md, Lines 43-54, the ConceptNode structure:
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

From cryptiq-mindmap-brief.md, Lines 30-31: **"Nodes in the visualization are derived concepts/themes, not individual memories; neurons on the brain represent concepts, and memories serve as provenance."**

### Performance Requirements
From SPEC-04.md, Lines 287-294:
- **"First frame: ≤2s"**
- **"Pan/zoom: ≥50fps sustained"**
- **"Lens switch: ≤800ms (attributes only)"**
- **"Click→highlight: ≤100ms"**

---

## Section B — Discrepancies/Unknowns (with quotes)

### Critical Gaps

1. **Memory Schema Mismatch**
   - Expected (brief, Lines 39-42): `{ id, sentence, conceptIds[], secret, date, originalCategory }`
   - SDK Reality (data-models.md, Lines 74-88): `{ id, content, position[], cluster, connections[], metadata }`
   - Impact: Need adapter layer for data transformation

2. **Missing Brain Mesh Infrastructure**
   - SPEC-04, Lines 119-120: **"Load brain mesh (~10k vertices)"**
   - Reality: No OBJ loader or mesh handling in canvas-r3f
   - Impact: Must implement from scratch

3. **Concept Extraction Not Implemented**
   - SPEC-04, Lines 181-183: **"enrichToGraph(): memories[] → concepts + edges"**
   - Reality: graph-forge doesn't aggregate memories to concepts
   - Impact: Need new extraction pipeline

4. **No Lens System**
   - SPEC-04, Lines 67-72: Three lens types with **"(NO POSITION CHANGES)"**
   - Reality: No lens state management or attribute mapping
   - Impact: Core feature missing

### Unknowns
- Brain mesh source (brief Lines 76-78 references github.com/iamwallam/3dbrain)
- Enrichment service endpoint (SPEC-04 Line 209: "Connected mode")
- Secret memory visual treatment (SPEC-04 Line 139: "final policy deferred")

---

## Section C — Task Decomposition & Challenges

### Core Problems Mapped to Claude Capabilities

#### Problem 1: Brain Surface Mapping
**Subtasks:**
1. Load brain.obj mesh → **Claude: Code generation for Three.js loader**
2. Extract ~10k vertices → **Claude: Array processing algorithms**
3. Region bucketing (30/25/25/20%) → **Claude: Spatial partitioning code**
4. Hash-based assignment → **Claude: Deterministic hashing implementation**
5. Collision resolution → **Claude: Spiral search algorithm**

**Challenge:** Cannot visually verify mesh topology without runtime

#### Problem 2: Concept-to-Vertex Assignment
**Subtasks:**
1. Stable hashing function → **Claude: Cryptographic hash implementation**
2. Modulo-based distribution → **Claude: Mathematical algorithms**
3. Occupancy tracking → **Claude: Set/Map data structures**
4. Overflow shells (1.01x, 1.02x) → **Claude: 3D geometry calculations**

**Challenge:** Balancing determinism with visual distribution

#### Problem 3: Performance Optimization
**Subtasks:**
1. Instanced particle rendering → **Claude: Three.js InstancedMesh code**
2. Frustum culling → **Claude: Spatial culling algorithms**
3. LOD implementation → **Claude: Distance-based quality reduction**
4. Frame budget monitoring → **Claude: Performance API integration**

**Challenge:** Cannot profile actual GPU performance

---

## Section D — Milestone (≈10h): outcomes + acceptance

### M0.5: Brain Mesh & Concept Mapping Foundation

#### Outcomes (exactly 3)
1. **Functional brain mesh** with vertex extraction and wireframe rendering
2. **100 test concepts** deterministically mapped to brain surface vertices  
3. **Camera controls** with stable 50fps performance

#### Acceptance Bars
- ✓ Brain mesh loads from .obj file (≤2s)
- ✓ 100 concepts placed without overlaps
- ✓ Hash(concept.id) produces identical positions across reloads
- ✓ Collision resolution handles dense regions
- ✓ Camera orbit/zoom maintains ≥50fps
- ✓ No position recalculation on any interaction

#### Explicitly Out of Scope
- Lens switching (deferred to M1)
- Edge rendering (deferred to M1)
- Real enrichment service (using fixtures)
- Timeline/filters (deferred to M2)
- Memory provenance UI (deferred to M1)

---

## Section E — Workflow Sessions (30–45 min each)

### Session 1: Brain Mesh Acquisition (30 min)
**Goal:** Obtain and prepare brain.obj file  
**Steps:**
1. Download brain mesh from referenced repo
2. Analyze vertex count and topology
3. Optimize if >50k vertices
4. Place in public/models/
5. Create fallback sphere mesh

**Verification:** File loads in Three.js editor  
**Error Correction:** Generate procedural brain if download fails  
**Meta-Audit:** Verify vertex count ≤50k

### Session 2: OBJ Loader Integration (45 min)
**Goal:** Load mesh in React Three Fiber  
**Steps:**
1. Install three-obj-loader
2. Create BrainMesh.tsx component
3. Implement useLoader hook
4. Extract geometry.vertices
5. Render as wireframe

**Verification:** Brain outline visible  
**Error Correction:** Fallback to GLTF if OBJ fails  
**Meta-Audit:** Check draw call count

### Session 3: Vertex Analysis & Bucketing (45 min)
**Goal:** Partition vertices into brain regions  
**Steps:**
1. Analyze vertex distribution
2. Define region boundaries (Y-axis based)
3. Create getRegionVertices() function
4. Validate 30/25/25/20% distribution
5. Color-code regions for testing

**Verification:** Region percentages within 5% of target  
**Error Correction:** Adjust boundaries iteratively  
**Meta-Audit:** Ensure deterministic bucketing

### Session 4: Concept Hashing Algorithm (45 min)
**Goal:** Deterministic concept→vertex mapping  
**Steps:**
1. Implement djb2 hash function
2. Create conceptToVertex() mapper
3. Add occupancy Set tracking
4. Test with 100 concepts
5. Visualize distribution

**Verification:** No collisions in first 100  
**Error Correction:** Switch to SHA if collisions >10%  
**Meta-Audit:** Profile hashing performance

### Session 5: Collision Resolution (30 min)
**Goal:** Handle vertex conflicts  
**Steps:**
1. Implement spiral search
2. Define search radius (5 vertices)
3. Track failed placements
4. Test with 200 concepts
5. Log collision statistics

**Verification:** <5% require collision resolution  
**Error Correction:** Increase search radius  
**Meta-Audit:** Document collision patterns

### Session 6: Overflow Shell System (30 min)
**Goal:** Handle >vertices concepts  
**Steps:**
1. Detect full occupancy
2. Generate 1.01x shell
3. Add ±0.001 jitter
4. Test with 15k concepts
5. Verify silhouette preservation

**Verification:** Brain shape maintained  
**Error Correction:** Adjust shell distance  
**Meta-Audit:** Measure performance impact

### Session 7: Particle System (45 min)
**Goal:** Instanced concept rendering  
**Steps:**
1. Create ConceptParticles.tsx
2. Setup InstancedMesh(100)
3. Apply positions from mapping
4. Set size=5px, color by category
5. Add hover state (size*1.5)

**Verification:** 100 particles at 60fps  
**Error Correction:** Reduce particle complexity  
**Meta-Audit:** Check GPU memory usage

### Session 8: Camera Controls (30 min)
**Goal:** Smooth navigation  
**Steps:**
1. Add OrbitControls
2. Set minDistance=5, maxDistance=50
3. Limit polar angle (no upside-down)
4. Add damping=0.05
5. Test with particles

**Verification:** Smooth movement, no jank  
**Error Correction:** Adjust damping factor  
**Meta-Audit:** Check input latency

### Session 9: Test Fixture Generation (30 min)
**Goal:** Create realistic test data  
**Steps:**
1. Generate 100 ConceptNodes
2. Use 8 categories
3. Distribute dates over 2 years
4. Add 1-5 memories per concept
5. Save as concepts-100.json

**Verification:** Schema validation passes  
**Error Correction:** Fix schema violations  
**Meta-Audit:** Ensure realistic distribution

### Session 10: State Management (45 min)
**Goal:** Mindmap store slice  
**Steps:**
1. Create mindmapSlice.ts
2. Add concepts, selection, hover
3. Create selectors
4. Wire to components
5. Test state updates

**Verification:** UI reflects state changes  
**Error Correction:** Fix reactivity issues  
**Meta-Audit:** Profile re-renders

### Session 11: Performance Baseline (45 min)
**Goal:** Establish metrics  
**Steps:**
1. Add stats.js overlay
2. Create performance marks
3. Test 100, 500, 1000 concepts
4. Document fps, memory, draw calls
5. Identify bottlenecks

**Verification:** ≥50fps with 500 concepts  
**Error Correction:** Optimize hot paths  
**Meta-Audit:** Plan future optimizations

### Session 12: Integration Testing (45 min)
**Goal:** End-to-end validation  
**Steps:**
1. Load brain mesh
2. Load 100 concepts fixture
3. Map to vertices
4. Render particles
5. Test all interactions

**Verification:** All acceptance bars pass  
**Error Correction:** Debug integration issues  
**Meta-Audit:** Document edge cases

### Session 13: Demo & Documentation (30 min)
**Goal:** Stakeholder readiness  
**Steps:**
1. Polish loading states
2. Add error boundaries
3. Write README.md
4. Record demo video
5. Prepare M1 backlog

**Verification:** Demo runs smoothly  
**Error Correction:** Fix demo-breaking bugs  
**Meta-Audit:** Gather feedback priorities

---

## Section F — Minimal Infra

### Package Dependencies
```json
{
  "@react-three/drei": "^9.0.0",  // OrbitControls
  "@react-three/fiber": "^9.1.2", // Already present
  "three-obj-loader": "^1.1.3",   // Brain mesh loading
  "three": "0.176.0"               // Pinned version
}
```

### File Structure
```
packages/canvas-r3f/src/
├── BrainMesh.tsx           # Mesh loader and wireframe
├── ConceptParticles.tsx    # Instanced particles
├── VertexMapper.ts         # Concept→vertex algorithm
└── hooks/
    └── useBrainVertices.ts # Vertex extraction hook

packages/store/src/slices/
└── mindmapSlice.ts         # Concepts state

public/models/
└── brain.obj               # Brain mesh file

fixtures/
└── concepts-100.json       # Test data
```

### Core Implementation
```typescript
// VertexMapper.ts
export function mapConceptToVertex(
  conceptId: string,
  vertices: Vector3[],
  occupied: Set<number>
): number {
  const hash = djb2Hash(conceptId);
  const region = hash % 4;
  const regionVerts = getRegionVertices(vertices, region);
  
  let idx = hash % regionVerts.length;
  while (occupied.has(regionVerts[idx])) {
    idx = spiralNext(idx, regionVerts.length);
  }
  
  occupied.add(regionVerts[idx]);
  return regionVerts[idx];
}
```

### Performance Monitoring
```typescript
// usePerformanceMonitor.ts
export function usePerformanceMonitor() {
  const mark = (name: string) => performance.mark(name);
  const measure = (name: string, start: string) => {
    performance.measure(name, start);
    const entry = performance.getEntriesByName(name)[0];
    if (entry.duration > 16.67) { // >1 frame
      console.warn(`Slow operation: ${name} took ${entry.duration}ms`);
    }
  };
  return { mark, measure };
}
```

### Environment Configuration
```bash
# .env.local
NEXT_PUBLIC_BRAIN_MESH_URL=/models/brain.obj
NEXT_PUBLIC_CONCEPT_LIMIT=10000
NEXT_PUBLIC_TARGET_FPS=50
NEXT_PUBLIC_ENABLE_STATS=true
```

### Test Commands
```bash
# Development
pnpm dev --filter cryptiq-mindmap-demo

# Performance test
pnpm test:perf --concepts=1000

# Build validation
pnpm build --filter @refinery/canvas-r3f
```

---

## Success Criteria

**M0.5 is complete when:**
1. Brain mesh renders as wireframe at ≥50fps
2. 100 concepts deterministically placed on vertices
3. Camera controls work smoothly
4. Performance baseline documented
5. Clear path to M1 (lens system) defined

**Next Steps (M1 Preview):**
- Implement three lens types (attribute-only)
- Add edge rendering (default OFF)
- Connect memory provenance
- Integrate enrichment service

---

## Section G — Extensibility & Reuse

### Extracting the Pattern

This 13-session workflow for Cryptiq Mindmap demonstrates a **universal pattern** applicable to any complex project:

#### The Pattern Discovered
- **Original:** 13 sequential sessions = 13 × 45min = ~10 hours
- **Optimized:** 4 parallel batches = 4 × 45min = ~3 hours  
- **Speedup:** 3.3x faster through parallelization

#### Parallel Batches Identified
```yaml
batch_1: [Session 1, 7, 9]     # Independent discovery/setup
batch_2: [Session 2, 3, 4]     # Parallel algorithm work  
batch_3: [Session 5, 6, 10]    # Component implementation
batch_4: [Session 11, 12, 13]  # Integration and polish
```

### Making This Workflow Extensible

#### 1. Parameterize the Domain
Replace Cryptiq-specific terms with parameters:
- `brain.obj` → `{BASE_MESH}`
- `concepts` → `{DATA_POINTS}`
- `vertices` → `{ATTACHMENT_POINTS}`
- `50fps` → `{PERFORMANCE_TARGET}`

#### 2. Abstract the Sessions
Each session type is reusable:
- **Sessions 1, 9:** Discovery pattern → `DISCOVERY` template
- **Sessions 2-4:** Algorithm pattern → `IMPLEMENTATION` template
- **Sessions 5-6:** System setup → `IMPLEMENTATION` template
- **Sessions 10-12:** Testing pattern → `VALIDATION` template
- **Session 13:** Documentation → `DOCUMENTATION` template

#### 3. Create Your Own 10-Hour Workflow
```yaml
your_workflow:
  domain: "Your Project"
  
  batch_1_discovery:
    - Analyze existing system
    - Gather requirements
    - Create test data
    
  batch_2_algorithms:
    - Core algorithm A
    - Core algorithm B
    - Data structures
    
  batch_3_implementation:
    - Component 1
    - Component 2
    - State management
    
  batch_4_integration:
    - Integration tests
    - Performance validation
    - Documentation
```

### Reusing for Other Domains

#### Example 1: Data Pipeline (10 hours → 3 hours)
```yaml
batch_1: [Data source analysis, Schema discovery, Sample generation]
batch_2: [Extractor, Transformer, Validator]
batch_3: [Loader, Error handler, Monitor]
batch_4: [Integration test, Performance test, Documentation]
```

#### Example 2: API Development (10 hours → 3 hours)
```yaml
batch_1: [Endpoint design, Database schema, Auth strategy]
batch_2: [CRUD endpoints, Auth implementation, Validation]
batch_3: [Business logic, External integrations, Caching]
batch_4: [API tests, Load tests, API documentation]
```

#### Example 3: UI Component Library (10 hours → 3 hours)
```yaml
batch_1: [Design audit, Component inventory, Theming strategy]
batch_2: [Atoms, Molecules, Organisms]
batch_3: [Compositions, Animations, Responsive layouts]
batch_4: [Storybook, Visual tests, Usage docs]
```

### Integration with Extensible Infrastructure

This workflow connects to the broader automation infrastructure:

1. **Use Session Templates** (`automation/EXTENSIBLE-SESSION-TEMPLATES.md`)
   - Each of our 13 sessions maps to a template type
   - Customize parameters for your domain

2. **Apply Orchestration Pattern** (`.clmem/workflows/PARALLEL-ORCHESTRATION-PATTERN.md`)
   - Identify your parallelizable work
   - Create batches using the pattern

3. **Follow the Playbook** (`automation/CLAUDE-CODE-ORCHESTRATION-PLAYBOOK.md`)
   - Execute batches with Task agents
   - Track with TodoWrite
   - Validate between batches

### Metrics for Reuse

Track these when applying to new domains:
- **Actual speedup:** Did you achieve 3x+ improvement?
- **Batch efficiency:** How many sessions per batch?
- **Error rate:** Which sessions needed retry?
- **Reusability:** Which parts transferred directly?

### Continuous Improvement

After each application:
1. Update session templates with new patterns
2. Add domain-specific optimizations to .clmem/
3. Share learnings back to this document
4. Improve the base pattern

**Key Insight:** The brain mesh → concepts mapping is just ONE instance of the pattern:
`Complex Serial Work → Parallel Batches → 3x+ Speedup`

This pattern works for ANY domain requiring multiple implementation sessions.

---

*This proposal prioritizes the foundational brain surface mapping system as the critical path to success. All other features build upon this spatial foundation. The workflow itself is designed for reuse across any complex 10-hour project.*