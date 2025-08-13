# Canvas-Latent Behavioral Contract
**Generated:** 12-08-2025 by BELLARD-A
**Last Updated:** 8:50 PM EST, 12-08-2025
**Purpose:** Formal specification for Thursday demo requirements

## Change Tracking Table

| NAME | Commit | Change | Reason | Last Updated |
|------|--------|--------|--------|--------------|
| BELLARD-A | Initial | Created behavioral contract | Extract formal requirements from working-doc and vision | 8:50 PM EST, 12-08-2025 |
| DIJKSTRA-A | Audit | Fixed timing errors, added missing context | Verified all claims against source documents | 9:15 PM EST, 12-08-2025 |

## Overview

This contract defines the complete set of behaviors required for the Canvas-Latent implementation to replace ForceGraphAdapter by Thursday 5:00 PM ET. Each behavior includes clear pass/fail criteria that parallel instances can verify independently.

## ⚠️ Critical Context (Added by DIJKSTRA-A Audit)

### Current Implementation Reality
- **CURRENT STATE:** CrypticAnimusScene.tsx uses ForceGraphAdapter with physics simulation
- **MIGRATION SCOPE:** Complete rewrite from force-directed to canvas-latent positioning
- **CODE DEBT:** Extensive debug instrumentation shows unresolved ForceGraph issues
- **TIMELINE RISK:** 4 days to completely replace core rendering approach

### Thursday Feasibility Assessment
- **HIGH RISK:** No existing canvas-latent code, only ForceGraph with physics
- **BLOCKING ISSUES:** ForceGraph has graphData propagation problems (see working-doc lines 80-87)
- **RECOMMENDATION:** Consider fixing ForceGraph issues OR reducing scope to MVP behaviors only

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

### Corrections Made
1. **Timing Claims:** Removed unsourced "100ms" and "16ms" specific timings
2. **Animation Duration:** Corrected 800ms to 600ms maximum per working-doc line 149
3. **Performance Target:** Changed "300 nodes" to "300-1000 nodes" per working-doc line 202
4. **Added Context:** Current implementation uses ForceGraph, not canvas-latent

### Source Verification
- All behavioral requirements traced to working-doc.md lines 124-150
- MET vision requirements traced to met-morph-vision.md lines 15-36
- Performance constraints traced to working-doc.md lines 200-204
- Current implementation verified in CrypticAnimusScene.tsx

---

**Contract Status:** ACTIVE
**Deadline:** Thursday, Aug 14, 5:00 PM ET
**Verification:** All parallel instances must acknowledge understanding