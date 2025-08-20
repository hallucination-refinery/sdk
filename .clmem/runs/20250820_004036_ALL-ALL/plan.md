# Plan - Run ID: 20250820_004036_ALL-ALL

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
5. Add hover state (size\*1.5)

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