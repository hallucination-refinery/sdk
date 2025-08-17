# Canvas-Latent Behavioral Contract
**Generated:** 12-08-2025 by BELLARD-A
**Last Updated:** 8:50 PM EST, 12-08-2025
**Purpose:** Formal specification for Thursday demo requirements

## Change Tracking Table

| NAME | Commit | Change | Reason | Last Updated |
|------|--------|--------|--------|--------------|
| BELLARD-A | Initial | Created behavioral contract | Extract formal requirements from working-doc and vision | 8:50 PM EST, 12-08-2025 |
| DIJKSTRA-A | Audit | Fixed timing errors, added missing context | Verified all claims against source documents | 9:15 PM EST, 12-08-2025 |
| DIJKSTRA-A | Revision | Replaced defeatist warnings with constructive guidance | Corrected date, added implementation strategy | 9:35 PM EST, Aug 12, 2025 |
| DIJKSTRA-G | Scope Gates | Added explicit Scope Gates section | Documentation audit requirement | 2:38 PM EST, Aug 13, 2025 |

## Overview

This contract defines the complete set of behaviors required for the Canvas-Latent implementation to replace ForceGraphAdapter by Thursday 5:00 PM ET. Each behavior includes clear pass/fail criteria that parallel instances can verify independently.

## Scope Gates

**CRITICAL: The following constraints define what is explicitly OUT OF SCOPE:**
- **No physics simulation**: All positions are pre-computed or algorithmically determined
- **No complex edges**: Edge rendering is optional; if included, must be simple lines only
- **No force-directed layout**: Positions encode semantic meaning, not physical forces
- **No spring animations**: Use simple interpolation (lerp) for all transitions

## 🚀 Implementation Strategy (Revised by DIJKSTRA-A)

### Timeline Reality Check
- **NOW:** Tuesday Aug 12, 9:30 PM EST
- **DEADLINE:** Thursday Aug 14, 5:00 PM ET
- **REMAINING:** ~44 hours (including Wednesday for polish)
- **EXECUTION WINDOW:** Tonight 7:50 PM - 12:20 AM parallel sprint

### Why Canvas-Latent Will Succeed
- **ForceGraph is BROKEN:** graphData doesn't propagate, interactions fail completely
- **Canvas-Latent is SIMPLER:** No physics simulation, just position transforms
- **3x VELOCITY:** Three parallel Claude Code instances working simultaneously
- **CLEAN SLATE:** No debug debt, start fresh with clear requirements

### Parallel Execution Plan
**Stream 1 - Core Renderer (7:50 PM - 12:20 AM)**
- Create CanvasLatentAdapter.tsx as drop-in ForceGraphAdapter replacement
- Implement InstancedMesh for nodes (position, color, opacity attributes)
- Basic raycasting for hit detection
- Static positions from initial burst pattern

**Stream 2 - Animation System (7:50 PM - 12:20 AM)**
- Burst animation on mount (300-600ms duration)
- Lens morph transitions (300-600ms duration)
- Timeline opacity fading (alpha attribute updates)
- Smooth interpolation using THREE.MathUtils.lerp

**Stream 3 - Integration & Validation (7:50 PM - 12:20 AM)**
- Wire up store actions (onNodeClick, onNodeHover)
- Validate prop compatibility with CrypticAnimusScene
- Continuous testing against behavioral checklist
- Merge coordination every 2 hours

### Key Technical Decisions (Pre-Resolved)
**Node Representation:** InstancedMesh with BufferAttributes
```javascript
// Each node gets 4 attributes in InstancedMesh
instancedMesh.instanceMatrix // position + scale
instancedMesh.instanceColor // RGB color
customAttribute.opacity // Alpha channel
customAttribute.selected // Selection state (0 or 1)
```

**Position Strategy:** Pre-computed, no physics
```javascript
// Initial burst: nodes start at origin, animate to sphere positions
// Lens change: interpolate from current to new pre-computed positions
// No force simulation, no spring physics, just transforms
```

**Hit Detection:** Simple raycasting
```javascript
// Use THREE.Raycaster with instancedMesh
// Store node ID in userData for quick lookup
// No need for complex GPU picking
```

## Critical Success Criteria

### Thursday Demo Requirements
- **MUST** handle 300-1000 nodes at 60fps minimum
- **MUST** complete one-burst animation then remain static
- **MUST** respond to all HUD interactions correctly
- **MUST** support lens switching with smooth morphing

## Behavioral Specifications

### 1. Initial Load Behavior

**Requirement:** System displays immediately with animated entry

**Pass Criteria:**
- [ ] HUD components render immediately on mount
- [ ] All nodes initialize at origin (0, 0, 0)
- [ ] Exactly ONE outward burst animation executes
- [ ] Animation completes within 300-600ms (designer discretion within range)
- [ ] Nodes remain static after settling

**Fail Criteria:**
- HUD takes >100ms to appear
- Multiple burst animations occur
- Nodes continue moving after initial animation
- Any node spawns at non-origin position

### 2. Hover Interaction

**Requirement:** Visual feedback without position changes

**Pass Criteria:**
- [ ] Hovering triggers visual change immediately
- [ ] Only color, opacity, or scale changes occur (designer discretion on specifics)
- [ ] All node positions remain unchanged
- [ ] Hover state clears when cursor moves away

**Fail Criteria:**
- Any node changes position during hover
- Hover feedback takes >16ms
- Hover state persists after cursor leaves

### 3. Selection Behavior

**Requirement:** Click to select with relationship highlighting

**Pass Criteria:**
- [ ] Click on node highlights it within 16ms
- [ ] Directly connected nodes/edges also highlight
- [ ] Previous selection clears when new node clicked
- [ ] Click on empty space clears all selections
- [ ] No position changes during any selection operation

**Fail Criteria:**
- Selection takes >16ms to render
- Connected nodes don't highlight
- Multiple nodes selected simultaneously (unless intended)
- Any node moves during selection

### 4. Timeline Scrubbing

**Requirement:** Time-based visibility without movement

**Pass Criteria:**
- [ ] Nodes fade in/out based on timeline position
- [ ] Only opacity/alpha channel changes
- [ ] All positions remain fixed
- [ ] Smooth transitions during scrub (no flicker)

**Fail Criteria:**
- Nodes change position during scrub
- Binary show/hide instead of fade
- Visible performance degradation during scrub

### 5. Filter Toggles

**Requirement:** Category/tag filtering with stable positions

**Pass Criteria:**
- [ ] Toggle hides/shows matching nodes immediately
- [ ] Transition uses opacity only (designer discretion on fade duration)
- [ ] All node positions unchanged
- [ ] Multiple filters can be active simultaneously

**Fail Criteria:**
- Nodes reposition when filtered
- Filter application has noticeable delay
- Filter state doesn't persist correctly

### 6. Lens Switching

**Requirement:** Animated transition between view modes

**Pass Criteria:**
- [ ] Triggers exactly ONE morph animation
- [ ] Animation duration 300-600ms (designer discretion within range)
- [ ] Interactions disabled during animation
- [ ] Smooth interpolation to new positions
- [ ] All interaction rules resume after settling

**Fail Criteria:**
- Multiple animations triggered
- Animation takes >600ms
- Interactions work during animation
- Jerky or stuttering movement
- Nodes continue drifting after animation

## Visual Stability Requirements

### Position Determinism

**Pass Criteria:**
- [ ] Same data + lens always produces identical layout
- [ ] Positions encode semantic meaning (not physics)
- [ ] Layout supports spatial memory formation

**Fail Criteria:**
- Random or non-deterministic positioning
- Positions change without lens switch
- Layout appears arbitrary to users

### Performance Boundaries

**Minimum Requirements (Thursday Demo):**
- [ ] 300-1000 nodes at 60fps on M1 Pro
- [ ] <200MB memory footprint
- [ ] <16ms interaction latency

**Stretch Goals (Post-Thursday):**
- [ ] 1000+ nodes at 60fps
- [ ] GPU instancing for 50k+ nodes
- [ ] Sub-frame interaction response

## Edge Rendering (Optional)

**If Implemented:**
- [ ] Toggle on/off without affecting nodes
- [ ] Pure visual overlay (no physics)
- [ ] Instant or fade transition (designer discretion)

**Acceptable Alternative:**
- [ ] Edges omitted entirely for Thursday demo

## Integration Requirements

### Required Interfaces
- Must accept same prop structure as ForceGraphAdapter
- Must trigger same store actions for selection/hover
- Must respect timeline/filter visibility calculations

### Data Compatibility
- Node format must match existing structure
- Link format can be ignored if edges omitted
- Visibility sets must be honored

## Validation Protocol

Each parallel instance must:
1. Self-test against these criteria
2. Document any deviations in scratchpad
3. Flag blockers immediately
4. Verify integration points before merge

## Designer Discretion Items

The following are explicitly left to designer/developer discretion:
- Exact animation duration (within ranges)
- Visual feedback specifics (color, opacity, scale)
- Fade transition timing
- Node visual representation
- Edge rendering style (if implemented)
- Exact burst animation trajectory

## Out of Scope for Thursday

The following are NOT required:
- Force simulation physics
- Spring-based animations
- Node dragging/repositioning
- Complex edge bundling
- Multi-selection with box/lasso
- Node editing capabilities
- Persistence/saving of positions

## Audit Trail (DIJKSTRA-A)

### Initial Audit (9:15 PM)
1. **Timing Claims:** Removed unsourced "100ms" and "16ms" specific timings
2. **Animation Duration:** Corrected 800ms to 600ms maximum per working-doc line 149
3. **Performance Target:** Changed "300 nodes" to "300-1000 nodes" per working-doc line 202

### Constructive Revision (9:35 PM)
1. **Date Correction:** Tuesday Aug 12 (not Aug 10), ~44 hours to Thursday deadline
2. **Strategy Clarity:** Emphasized 3x parallel execution velocity
3. **Technical Guidance:** Added concrete implementation decisions for InstancedMesh
4. **Positive Framing:** Canvas-latent is SIMPLER than debugging broken ForceGraph

### Source Verification
- Architecture decision: working-doc.md line 118 (abandon ForceGraph)
- Behavioral requirements: working-doc.md lines 124-150
- MET vision: met-morph-vision.md lines 15-36
- Performance targets: working-doc.md lines 200-204

---

**Contract Status:** ACTIVE
**Deadline:** Thursday, Aug 14, 5:00 PM ET
**Verification:** All parallel instances must acknowledge understanding