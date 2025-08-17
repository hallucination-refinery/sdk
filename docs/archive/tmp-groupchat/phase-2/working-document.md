## **Last Updated:** Tuesday, 1:25 PM EST, 12-08-2025

# Executive Summary

Environment is clean and building. ForceGraph rendering works with timeline scrubbing functional for node visibility, but hover/click interactions produce only state logs without visual feedback due to missing graphData references. Lens switching triggers only clearSelection with no position changes. Given the original intention to transition to canvas-latent architecture and the limited time remaining, the decision is to bypass ForceGraph salvage entirely and proceed directly with canvas-latent InstancedMesh implementation.
**Sub-W:** Build canvas-latent InstancedMesh renderer achieving behavioral parity with legacy demo by 9:00 PM tonight, implementing only the essential features needed for the 30-45 second video demonstration required for Thursday's Pond update submission.

## W - Polished Demo Clip & SDK Status Update

The singular near-term objective is to submit a **Pond partner update by Thu Aug 14, 5:00 PM ET** containing a **new 30–45s Cryptiq Mindmap demo video** and a concise **SDK migration status note** that acknowledges the July slip while showing tangible progress. The execution plan is to **bypass ForceGraph salvage entirely** and **build canvas-latent InstancedMesh implementation directly**, then **polish/record Wednesday**, and **QA + submit Thursday**. This preserves goodwill and optionality with Pond, clearing the runway for the hiring-track build immediately after.

## Intended Behaviour — User-Experience Checklist

**Note:** This checklist tracks **only** behavior parity between the legacy repo demo and the mid-migration demo in the new repo. It does **not describe** or evaluate the intended behavior of the future canvas-latent InstancedMesh implementation:

- [ ] **Initial load**
  - [ ] HUD appears immediately on first render
  - [ ] All nodes spawn at (0, 0, 0) and perform **one** outward burst
  - [ ] Nodes settle and stay static until a lens change occurs
- [ ] **Hover**
  - [ ] Hovering any node leaves all node positions unchanged
  - [ ] Physics engine remains idle (no forces applied)
- [ ] **Click / Selection**
  - [ ] Clicking a node highlights it **and** its directly related edges/nodes
  - [ ] Clicking a different node transfers the highlight accordingly
  - [ ] Clicking empty space clears all highlights
  - [ ] No node positions change; physics stays idle throughout
- [ ] **Timeline Scrub**
  - [ ] Dragging the timeline slider shows or hides nodes and links based on time
  - [ ] Node positions remain fixed during and after scrubbing
  - [ ] Physics engine remains idle
- [ ] **Category / Filter Toggle**
  - [ ] Toggling a filter hides or reveals matching nodes and links
  - [ ] Node positions stay unchanged while filtering
  - [ ] Physics engine remains idle
- [ ] **Lens Change (Causal ↔ Affinity ↔ Temporal)**
  - [ ] Switching the lens triggers **exactly one** fresh burst from the origin
  - [ ] Nodes resettle after the burst and stay static
  - [ ] After resettling, behaviour reverts to the Hover, Click/Selection, Timeline Scrub, and Filter rules until the next lens switch

---

# PLAN

## Sub-W — Canvas-Latent Implementation + Behavior-Parity Stub

Build canvas-latent InstancedMesh renderer from scratch, implementing only the essential features required for behavioral parity: load with burst animation, hover/selection highlighting, timeline-based visibility control, and lens switching with position morphing. Complete implementation and record rough demonstration video by 9:00 PM tonight.

### Sub-W Checklist - Canvas-Latent Implementation

- [ ] **Create new @refinery/canvas-latent adapter package** with minimal dependencies on Three.js and React.
- [ ] **Implement single InstancedMesh** for all nodes with per-instance attributes: {position, baseColor, alpha, isHovered, isSelected}.
- [ ] **Pre-compute node positions** for affinity and temporal layouts only (skip causal to save time).
- [ ] **Initial burst animation** from origin on load using simple outward force simulation that settles after 1-2 seconds.
- [ ] **Lens morphing** with 300-600ms position tweening when switching between affinity/temporal views.
- [ ] **Timeline control** adjusting only alpha values for date-based visibility without position changes.
- [ ] **Selection/hover state** using color and alpha modifications without any position updates.
- [ ] **Stable ID-to-instance mapping** to prevent remounting issues during state changes.
- [ ] **Record rough 30-45s clip by 9:00 PM** demonstrating all behavioral requirements.

## ROADMAP

- **1) Canvas-latent core implementation (1:30-5:00 PM, ~85% confidence)**
  - Create new adapter package structure with Three.js InstancedMesh setup.
  - Implement burst animation logic for initial load and lens changes.
  - Build position tweening system for smooth morphing between layouts.
  - Risk: InstancedMesh attribute updates may have performance issues at scale.
- **2) Interaction layer (5:00-7:00 PM, ~80% confidence)**
  - Hover detection using raycasting or pre-computed hit map.
  - Selection state management with proper highlighting of connected nodes.
  - Timeline integration for alpha-based visibility control.
  - Risk: Hit detection accuracy with instanced rendering.
- **3) Integration and testing (7:00-8:00 PM, ~90% confidence)**
  - Connect to existing HUD and store infrastructure.
  - Verify all behavioral requirements from checklist.
  - Performance optimization for smooth 60fps operation.
- **4) Recording and documentation (8:00-9:00 PM, ~95% confidence)**
  - Capture 30-45 second demonstration video showing all required behaviors.
  - Draft concise SDK migration note explaining architectural pivot.
  - Package assets for Wednesday polish pass.

**Evidence & assumptions:**

- Canvas-latent approach eliminates dependency issues plaguing ForceGraph.
- InstancedMesh provides better performance control than force-graph simulation.
- Direct attribute manipulation avoids ref API complexity.
- Timeline visibility already proven to work in current implementation.

---

# RUNNING NOTES

1. **Immediate priority:** Skip all ForceGraph debugging and start canvas-latent package setup immediately.
2. **Performance target:** Must handle 300-1000 nodes at 60fps on M1 Pro for demo quality.
3. **Scope discipline:** Implement only checklist behaviors - no additional features regardless of how easy they seem.
4. **Burst animation:** Simple radial force from origin, not full physics simulation - just enough for visual impact.
5. **Position data:** Can reuse existing node data structure, just need to add pre-computed layout positions.
6. **Alpha blending:** May need careful ordering or depth testing configuration for proper transparency.
7. **Recording setup:** Test screen capture settings early to ensure 1080p/60fps capability.
