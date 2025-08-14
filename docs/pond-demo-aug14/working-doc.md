## **Last Updated:** Wednesday, 3:48 PM EST, 13-08-2025
## **Doc Sync VERIFIED:** 3:48 PM EST - All worktrees mirror base-of-truth docs exactly

# Executive Summary

ForceGraph baseline documented: rendering functional but interactions fail due to missing graphData propagation. State management logs correctly but visual feedback broken. Decision: Invest 90 minutes in comprehensive codebase analysis and parallel infrastructure setup before canvas-latent implementation. This front-loaded investment enables three Claude Code instances to work in parallel without conflicts, dramatically increasing velocity for the tight Thursday deadline.

**Current Phase:** Codebase Analysis and Infrastructure Setup (6:20 PM - 7:50 PM)  
**Next Phase:** Parallel Canvas-Latent Implementation (7:50 PM - 12:20 AM)

**Current Phase:** Integration & Behavioral Validation (now)  
**Next Phase:** Polish & Recording (Wednesday afternoon)

## W - Polished Demo Clip & SDK Status Update

The singular near-term objective is to submit a **Pond partner update by Thu Aug 14, 5:00 PM ET** containing a **new 30–45s Cryptiq Mindmap demo video** and a concise **SDK migration status note** that acknowledges the July slip while showing tangible progress. The execution plan is to **conduct thorough codebase analysis and scaffolding (90 min)**, then **execute parallel canvas-latent implementation (4.5 hrs)**, then **polish/record Wednesday**, and **QA + submit Thursday**.

## Sprint Status Tracker

### Active Phase: Infrastructure Setup

- **Started:** 6:20 PM
- **Target Completion:** 7:50 PM
- **Progress:** Documentation templates initiated, codebase analysis pending

### Parallel Work Streams (Not Yet Active)

- **Stream 1 (Core Renderer):** Awaiting infrastructure completion
- **Stream 2 (Animation/Interaction):** Awaiting infrastructure completion
- **Stream 3 (Integration/Verification):** Awaiting infrastructure completion

### Critical Path Items

1. ✅ Git worktree setup for parallel development
2. ⏳ Current codebase interface documentation
3. ⏳ Behavioral baseline from smoke tests
4. ⏳ Technical decision research (InstancedMesh, animation, hit detection)
   s

---

# PLAN

## Sub-W — Codebase Analysis and Infrastructure Setup (90 minutes)

Conduct comprehensive analysis of current ForceGraph implementation, document all integration interfaces, establish parallel development infrastructure with three git worktrees, and create coordination scaffolding to enable conflict-free parallel development.

### Infrastructure Setup Checklist

- [x] **Document Current State** - Complete analysis of CrypticAnimusScene/ForceGraphAdapter interfaces
- [ ] **Extract Behavioral Contract** - Transform checklist into formal specification file
- [ ] **Create Worktree Structure** - Set up three parallel development branches
- [ ] **Research Critical Decisions** - InstancedMesh attributes, animation approach, hit detection
- [ ] **Scaffold Coordination Docs** - Templates for status updates, blocking issues, integration
- [ ] **Define Instance Boundaries** - Clear ownership and interface definitions
- [ ] **Establish Integration Protocol** - Merge windows, conflict resolution, validation

### Parallel Implementation Plan (7:50 PM - 12:20 AM)

Following infrastructure setup, three Claude Code instances will execute in parallel:

- **Instance 1:** Core InstancedMesh renderer with attribute management
- **Instance 2:** Animation system and interaction handling
- **Instance 3:** Continuous integration and documentation updates

---

## Blocking Issues

### Current Blockers

- None (infrastructure phase just beginning)

### Anticipated Risks

- **Integration Surfaces:** Need to document exact props/methods expected by HUD components
- **Data Structure Compatibility:** Must understand current node format for InstancedMesh transformation
- **Performance Unknowns:** Hit detection strategy requires research before implementation

---

## Integration Points

### Discovered Interfaces

- **CrypticAnimusScene Props:**
  - `graphData`: Core data structure (currently not reaching ForceGraphAdapter)
  - `mouseSelectedNodeId`: Selection state from store
  - `activeCategories`/`activeTags`: Filter state
  - Timeline range for visibility calculations

- **ForceGraphAdapter Methods:**
  - `highlightNode()`: Called but returns early due to missing graphData
  - `selectNode()`: Same issue as highlight
  - `refresh()`: Currently called but may be causing remount issues

### Canvas-Latent Integration Requirements

- Must accept same prop structure as ForceGraphAdapter
- Must trigger same store actions for selection/hover
- Must respect timeline/filter visibility calculations
- Must provide smooth drop-in replacement

---

## Real-Time Decision Log

### 3:30 PM - Infrastructure Investment Decision

**Decision:** Spend 90 minutes on setup before implementation  
**Rationale:** Parallel development without proper coordination = integration nightmare. Front-loaded investment enables 3x velocity during implementation phase.  
**Evidence:** Anthropic teams report 2-4x speedup with proper Claude Code orchestration

### 2:25 PM - Branch Strategy Decision

**Decision:** Create new branch instead of continuing on feat/repro-fg-remount  
**Rationale:** 146 commits ahead of main = too much technical debt. Clean slate reduces cognitive load.  
**Result:** Created feat/canvas-latent-demo branch

### 1:25 PM - Architecture Pivot Decision

**Decision:** Abandon ForceGraph debugging, go straight to canvas-latent  
**Rationale:** ForceGraph shows fundamental issues (graphData not propagating). Time investment in debugging > building new.  
**Evidence:** Smoke tests show state changes work but visual feedback completely broken

---

## Intended Behaviour — Reference Specification

**Note:** This checklist serves as the behavioral contract all parallel instances must satisfy:

- [ ] **Initial load**
  - [ ] HUD appears immediately on first render
  - [ ] All nodes spawn at (0, 0, 0) and perform **one** outward burst
  - [ ] Nodes settle and stay static until a lens change occurs
- [ ] **Hover**
  - [ ] Hovering any node leaves all node positions unchanged
  - [ ] Visual feedback through color/opacity only
- [ ] **Click / Selection**
  - [ ] Clicking a node highlights it **and** its directly related edges/nodes
  - [ ] Clicking a different node transfers the highlight accordingly
  - [ ] Clicking empty space clears all highlights
  - [ ] No node positions change during selection
- [ ] **Timeline Scrub**
  - [ ] Dragging the timeline slider shows or hides nodes based on time
  - [ ] Node positions remain fixed during scrubbing
  - [ ] Only alpha channel changes for visibility
- [ ] **Category / Filter Toggle**
  - [ ] Toggling a filter hides or reveals matching nodes
  - [ ] Node positions stay unchanged while filtering
- [ ] **Lens Change (Causal ↔ Affinity ↔ Temporal)**
  - [ ] Switching triggers **one** burst animation
  - [ ] Nodes morph to new positions over 300-600ms
  - [ ] After settling, all interaction rules apply until next lens change

---

## ROADMAP (Revised Timeline)

### Milestone 0: Types initialized & syncs VERIFIED
- **Status:** COMPLETE
- **Verified by:** KERNIGHAN-A
- **Time:** 2:29 PM EST, Aug 13, 2025
- **Evidence:** Package structure created, type definitions complete, branch syncs verified

### Milestone 1: Core & Interaction scaffolds + audits
- **Status:** COMPLETE
- **Published by:** KERNIGHAN-A
- **Time:** 3:20 PM EST, Aug 13, 2025
- **Evidence:** All scaffolds implemented and audited across branches
- **Current SHAs:**
  - A1 (integration): 87c238d9
  - B1 (core scaffold): 42fbea3d
  - B2 (core audit): 1429f0cc
  - C1 (interaction scaffold): 7f1775cb
  - C2 (interaction audit): c25810ce

### Phase 1: Infrastructure (6:20 PM - 7:50 PM) ✅ COMPLETE

- Document existing interfaces and data flow
- Set up git worktrees for parallel development
- Create coordination scaffolding
- Research technical decisions
- Define clear boundaries between instances

### Phase 2: Parallel Implementation (ACTIVE)

#### Branch SHA Status (Updated 3:20 PM EST)
- **feat-pond-demo-aug14:** Current branch (base-of-truth for docs)
- **canvas-latent-integration:** 87c238d9 (A1 - types initialized)
- **canvas-latent-core:** 42fbea3d (B1), 1429f0cc (B2) - scaffold + audit complete
- **canvas-latent-interaction:** 7f1775cb (C1), c25810ce (C2) - scaffold + audit complete
- **SYNC STATUS:** Phase 2 ACTIVE

#### Stream Progress
- **Stream 1 (Core):** ~60% - InstancedMesh scaffolded, needs integration
- **Stream 2 (Interaction):** ~60% - Animation FSM scaffolded, needs refinement
- **Stream 3 (Integration):** ~40% - Types complete, awaiting stream merges
- **Next sync:** 4:00 PM EST

### Phase 3: Recording (11:50 PM - 12:20 AM)

- Integrate all streams
- Record rough demo showing all behaviors
- Package for Wednesday polish

---

## RUNNING NOTES

### Current Understanding

1. **ForceGraph Issues:** `graphData` not reaching adapter, causing all interactions to fail
2. **State Management Works:** Store updates fire correctly, just no visual feedback
3. **Timeline Works:** Visibility calculation logic is sound, can reuse

### Technical Decisions Pending Research

1. **InstancedMesh Attributes:** How to pack position, color, alpha, selected state efficiently?
2. **Animation Architecture:** Three.js AnimationMixer vs custom tweening vs shader-based?
3. **Hit Detection:** Raycasting vs GPU picking vs precomputed hit map?
4. **Edge Rendering:** Skip for demo or implement with LineSegments2?

### Technical Decisions (LOCKED — 9:38 AM EST, 13-08-2025)
- InstancedMesh: Separate Float32Array buffers (position, color, alpha, selected)
- Animation System: Custom tweening with simple easing
- Hit Detection: Three.js Raycaster

### Coordination Protocol

- Each instance updates their scratchpad every 30 minutes
- Integration instance checks for conflicts every hour
- Blocking issues immediately added to this document
- Merge window every 2 hours (9:50 PM, 11:50 PM)
- **Next Audit:** 3:00 PM EST (30 min from now)

### Performance Constraints

- Target: 300-1000 nodes at 60fps on M1 Pro
- Memory budget: Keep under 200MB for smooth recording
- Interaction latency: <16ms for hover feedback

### M3 Status (2025-08-14T06:43:34Z)
- Dev redirect active; harness route verified
- Core attributes + Interaction timeline fade present (S1/S2)
- Harness smoke runbook published; user ping recorded
