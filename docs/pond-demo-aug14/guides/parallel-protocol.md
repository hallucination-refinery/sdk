# Canvas-Latent Parallel Development Protocol
**Generated:** Aug 12, 2025 by HOPPER-B
**Last Updated:** 1:30 AM EST, Aug 13, 2025 by DIJKSTRA-C
**Purpose:** Define exact file ownership for 3 instances building canvas-latent package in parallel

## Change Tracking Table

| NAME | Commit | Change | Reason | Last Updated |
|------|--------|--------|--------|--------------|
| HOPPER-B | Initial | Created parallel protocol | Enable conflict-free parallel development | 10:47 PM EST, Aug 12, 2025 |
| DIJKSTRA-C | Audit Fix | Fixed date formats, updated timeline, added package creation | Critical issues found during audit | 1:30 AM EST, Aug 13, 2025 |
| KERNIGHAN-A | Branch Model | Added explicit branch names and pre-flight sync protocol | Standardize cross-branch state | 2:29 PM EST, Aug 13, 2025 |
| DIJKSTRA-G | SHA & Scope | Added published SHAs, behavioral-contract reference, scope gates | Documentation audit requirement | 2:38 PM EST, Aug 13, 2025 |

## Overview

This protocol defines exact file ownership and integration boundaries for three Claude Code instances working in parallel to build the canvas-latent package. Each instance has exclusive write access to their designated files, preventing merge conflicts while enabling maximum velocity.

### Three-Branch Worktree Model

Parallel development occurs across three synchronized branches:
- **canvas-latent-core**: Instance 1 (Renderer) - Core rendering layer implementation
- **canvas-latent-interaction**: Instance 2 (Animator) - Animation and interaction layer
- **canvas-latent-integration**: Instance 3 (Integrator) - Integration, types, and validation

## Pre-flight Sync Protocol

### Sync Points

Before each major integration milestone, all instances must:
1. **Commit** all local changes with descriptive message
2. **Push** to respective branch (canvas-latent-core, canvas-latent-interaction, canvas-latent-integration)
3. **Verify** no uncommitted changes with `git status`
4. **Document** sync completion in scratchpad with SHA

### Fallback Procedures

If merge conflicts arise:
1. **Fast-Forward (FF):** Attempt fast-forward merge first
2. **Cherry-Pick:** If FF fails, cherry-pick specific commits
3. **Directory Checkout:** Last resort - checkout entire directories from source branch
4. **Instance 3 Resolution:** Integration instance owns final conflict resolution

### Published Branch SHAs (from working-doc.md)
- **A1 (feat-pond-demo-aug14):** 87c238d9
- **canvas-latent-core:** a4f517e0
- **canvas-latent-interaction:** e7673963
- **SYNC STATUS:** VERIFIED

## Critical Constraints

- **Deadline:** Thursday Aug 14, 5:00 PM ET (~39.5 hours from NOW - 1:30 AM Wed)
- **Parallel Start:** IMMEDIATELY after this audit completes
- **Package Creation:** Instance 3 MUST create package structure FIRST
- **Integration Points:** Must be respected exactly as defined
- **File Paths:** Must be created exactly as specified (typos cause conflicts)
- **Behavioral Contract:** All implementations must satisfy requirements in `behavioral-contract.md`
- **Scope Gates:** No physics simulation, no complex edge rendering (see behavioral-contract.md)

## Instance Territories

### Instance 1: RENDERER (Core Rendering Layer)

**Exclusive Ownership:**
```
/workspace/packages/canvas-latent/
├── src/
│   ├── adapters/
│   │   └── CanvasLatentAdapter.tsx     # Main component, ForceGraphAdapter replacement
│   ├── core/
│   │   ├── InstancedNodeMesh.ts        # THREE.InstancedMesh setup and management
│   │   ├── NodeAttributeManager.ts     # Position, color, opacity, selected attributes
│   │   └── RaycastHandler.ts           # Hit detection and node picking
│   └── utils/
│       └── PositionCalculator.ts       # Initial burst positions, lens positions
```

**Responsibilities:**
- Create drop-in ForceGraphAdapter replacement
- Implement InstancedMesh with all required attributes
- Handle basic raycasting for node selection
- Calculate static positions for initial burst and lens modes
- Expose interfaces for animation system to modify attributes

**Integration Exports:**
```typescript
// Must export these for Instance 2
export interface NodeAttributeManager {
  setPosition(nodeId: string, position: Vector3): void
  setOpacity(nodeId: string, opacity: number): void
  setColor(nodeId: string, color: Color): void
  setSelected(nodeId: string, selected: boolean): void
}

export interface RaycastResult {
  nodeId: string | null
  point: Vector3
}
```

### Instance 2: ANIMATOR (Animation & Interaction Layer)

**Exclusive Ownership:**
```
/workspace/packages/canvas-latent/
├── src/
│   ├── animations/
│   │   ├── BurstAnimation.ts           # Initial spawn animation (0,0,0) -> positions
│   │   ├── LensMorphAnimation.ts       # Lens transition animations
│   │   └── TimelineAnimation.ts        # Opacity transitions for timeline scrub
│   ├── interactions/
│   │   ├── HoverHandler.ts             # Visual feedback for hover (no position change)
│   │   ├── SelectionHandler.ts         # Node + edge selection logic
│   │   └── FilterHandler.ts            # Category/tag filtering animations
│   └── utils/
│       └── Interpolation.ts            # Lerp utilities, easing functions
```

**Responsibilities:**
- Implement all animation sequences
- Handle hover/selection visual feedback
- Manage timeline-based opacity changes
- Coordinate filter visibility transitions
- Use Instance 1's attribute manager for all updates

**Integration Requirements:**
```typescript
// Must import from Instance 1
import { NodeAttributeManager } from '../core/NodeAttributeManager'

// Must import from Instance 3
import { AnimationConfig } from '../types'
```

### Instance 3: INTEGRATOR (Integration & Validation Layer)

**Exclusive Ownership:**
```
/workspace/packages/canvas-latent/
├── src/
│   ├── types/
│   │   └── index.ts                    # ALL shared TypeScript interfaces
│   ├── store/
│   │   └── StoreConnector.ts           # Store action dispatch, state subscription
│   ├── constants.ts                    # Shared constants (timing, limits, etc.)
│   └── index.ts                        # Package exports
├── tests/
│   ├── smoke/
│   │   └── behavioral-validation.test.ts
│   └── integration/
│       └── store-connection.test.ts
├── package.json
├── tsconfig.json
└── README.md                            # Only if needed for integration notes
```

**Responsibilities:**
- Define all shared TypeScript interfaces
- Wire up store connections for all instances
- Continuous validation against behavioral contract
- Coordinate merges and resolve any conflicts
- Document integration status in real-time

**Critical Type Definitions:**
```typescript
// src/types/index.ts - ALL instances import from here
export interface NodeData {
  id: string
  position: { x: number; y: number; z: number }
  category?: string
  tags?: string[]
  timestamp?: number
}

export interface AnimationConfig {
  burstDuration: number      // 300-600ms
  morphDuration: number      // 300-600ms
  fadeTransition: number     // Designer discretion
}

export interface CanvasLatentProps {
  // Must match ForceGraphAdapterProps exactly
  // Copy from integration-interfaces.md
}
```

## Shared Dependencies Protocol

### Read-Only Access
All instances can READ any file but can only WRITE to their designated files.

### Import Hierarchy
```
Instance 3 (types) → Instance 1 (core) → Instance 2 (animations)
                  ↘                     ↗
                    Instance 3 (store)
```

### Critical Shared Files
| File | Owner | Consumers | Update Protocol |
|------|-------|-----------|-----------------|
| src/types/index.ts | Instance 3 | All | Must define before others start |
| src/constants.ts | Instance 3 | All | Lock values by 11:30 PM |
| src/core/NodeAttributeManager.ts | Instance 1 | Instance 2 | Interface locked by 11:45 PM |

## Integration Points

### Milestone 0: Package Initialization (IMMEDIATE - 1:45 AM)
- [ ] Instance 3: Create canvas-latent package directory
- [ ] Instance 3: Initialize package.json and tsconfig.json
- [ ] Instance 3: Create src/types/index.ts with all interfaces
- [ ] Instance 3: Create basic directory structure for all instances

### Milestone 1: Structure (3:00 AM)
- [ ] Instance 3: All type definitions complete
- [ ] Instance 1: Core interfaces defined
- [ ] Instance 2: Animation contracts established
- [ ] All: Basic file structure created

### Milestone 2: Implementation (6:00 AM)
- [ ] Instance 1: Rendering functional
- [ ] Instance 2: Animations working
- [ ] Instance 3: Store connected
- [ ] Manual smoke test by user

### Milestone 3: Integration (9:00 AM)
- [ ] All behaviors from behavioral-contract.md passing
- [ ] No TypeScript errors
- [ ] Performance meets requirements
- [ ] Ready for polish Wednesday

## Merge Schedule (UPDATED)

### 2:30 AM - Initial Structure Merge
**Pre-merge Checklist:**
- [ ] Canvas-latent package created by Instance 3
- [ ] Basic file structure in place
- [ ] Type definitions complete

### 5:00 AM - Implementation Merge
**Pre-merge Checklist:**
- [ ] Core functionality complete
- [ ] All tests passing locally
- [ ] No unresolved imports

### 8:00 AM - Final Integration Merge
**Pre-merge Checklist:**
- [ ] All behavioral requirements met
- [ ] Performance validated
- [ ] Ready for Wednesday polish

## Conflict Prevention Rules

1. **NEVER** modify files outside your territory
2. **ALWAYS** import types from src/types/index.ts
3. **NEVER** create duplicate type definitions
4. **ALWAYS** use exact file paths as specified
5. **NEVER** refactor another instance's code
6. **ALWAYS** communicate blockers immediately

## Blocking Issue Protocol

If blocked:
1. Document issue in your scratchpad with timestamp
2. Add to working-doc.md "Blocking Issues" section
3. Tag the blocking instance in your commit message
4. Consider workaround while waiting for resolution

## Communication Requirements

### Every 30 Minutes
Update your scratchpad with:
- Current progress percentage
- Files created/modified
- Any deviations from plan
- Estimated completion time

### At Each Merge Window
Post status:
- Ready to merge: YES/NO
- Blocking issues: List or NONE
- Integration concerns: List or NONE

## Validation Checkpoints

### Instance Self-Validation
Each instance must validate their work against:
- [ ] TypeScript compiles without errors
- [ ] Relevant behavioral contract items pass
- [ ] No imports from wrong territories
- [ ] Performance requirements met

### Integration Validation (Instance 3)
- [ ] All behavioral contract items passing
- [ ] Store actions firing correctly
- [ ] No console errors
- [ ] Frame rate ≥ 60fps with 300 nodes

## Emergency Protocols

### If Merge Conflicts Occur
1. Instance 3 takes ownership of resolution
2. Other instances freeze commits
3. Resolution documented in scratchpad
4. Continue after "all clear" signal

### If Deadline at Risk
1. Cut edge rendering (optional per contract)
2. Simplify animations to basic lerp
3. Focus on core behavioral requirements
4. Document cuts in working-doc.md

## Success Criteria

The parallel development succeeds when:
- [ ] Canvas-latent replaces ForceGraphAdapter without errors
- [ ] All behaviors from behavioral-contract.md work
- [ ] 300-1000 nodes render at 60fps
- [ ] Demo can be recorded showing all interactions
- [ ] Thursday 5PM deadline is met

---

**Protocol Status:** ACTIVE (UPDATED BY AUDIT)
**Start Time:** IMMEDIATELY after audit completion (~1:45 AM EST)
**Critical:** Instance 3 MUST create package structure FIRST
**All instances must acknowledge understanding before starting**