# BELLARD-S3-01 Scratchpad
**Date:** 2025-08-13 11:46 AM EST
**Branch:** feat-pond-demo-aug14
**Task:** Create canvas-latent foundation

## ULTRATHINK MODE

### 1. DECOMPOSE

**Prompt (Verbatim):**
"Create @packages/canvas-latent foundation with types/index.ts defining NodeData, Lens, NodeAttributeManager interfaces per o3-pro specifications. Adhere to the formatting and rigor of .md files in @docs/pond-demo-aug14/. Document every action and thought in your scratchpad; make atomic commits."

**Core Premise:** Create type definitions for canvas-latent that are compatible with ForceGraphAdapter

**Claims:**
- NodeData must support posByLens optional positions
- Must include all passthrough fields for HUD
- No physics, no complex edges needed
- Blocking dependency for Streams 1 & 2

**Implicit Assumptions:**
- ForceGraphAdapter.tsx contains the pattern we must match
- integration-interfaces.md has the exact specifications
- Three.js r157 and React 18 are required dependencies

### 2. PLAN

**Subtasks:**
1. Analyze integration-interfaces.md for exact specifications
2. Review ForceGraphAdapter.tsx for existing patterns
3. Create types/index.ts with:
   - NodeData interface with posByLens support
   - Lens type = 'affinity' | 'causal' | 'temporal'
   - NodeAttributeManager interface per spec
4. Update package.json with correct dependencies
5. Verify all HUD passthrough fields
6. Commit and push by 12:00 PM

### 3. PROBE

**OODA Loop for Type Creation:**
- **Observe:** Check existing ForceGraphAdapter interface
- **Orient:** Match exact prop signatures
- **Decide:** Define types that maintain compatibility
- **Act:** Create types/index.ts

**Critical Questions:**
- What exact fields does NodeData need?
- How does posByLens work?
- What are the HUD passthrough requirements?

### 4. SEQUENCE

1. Read integration-interfaces.md → Extract exact signatures
2. Read ForceGraphAdapter.tsx → Understand patterns
3. Create types/index.ts → Implement interfaces
4. Update package.json → Add dependencies
5. Verify → Cross-check all requirements
6. Commit → Atomic commit with clear message

### 5. PARALLELIZE

Using sub-agents for parallel file reading where appropriate.

### 6. VERIFY ×3

Will triple-check:
- Interface compatibility with ForceGraphAdapter
- All required fields present
- Lens type values correct

### 7. CROSS-CHECK

Will verify against:
- integration-interfaces.md specifications
- ForceGraphAdapter.tsx patterns
- behavioral-contract.md requirements

### 8. STRESS-TEST

Will ensure:
- No missing optional fields
- TypeScript strict mode compliance
- No circular dependencies

### 9. REFLECT

[To be completed after implementation]

## Execution Log

**11:47 AM:** Starting task decomposition
**11:47 AM:** Creating todo list with 9 items
**11:47 AM:** Beginning file analysis
**11:48 AM:** Read integration-interfaces.md and ForceGraphAdapter.tsx
**11:49 AM:** Created types/index.ts with all required interfaces
**11:50 AM:** Updated package.json with Three.js r157 and React dependencies

## Verification Checklist

### Type Definitions Complete
☑ NodeData interface with:
  - posByLens optional positions (affinity, causal, temporal)
  - HUD passthrough fields (category, tags, metadata)
  - Physics properties (vx, vy, vz, fx, fy, fz)
  - Three.js object reference (__threeObj)
  - Selection/interaction state fields
  - Custom properties passthrough ([key: string]: any)

☑ Lens type = 'affinity' | 'causal' | 'temporal'

☑ NodeAttributeManager interface with:
  - updateNodeAttribute method
  - updateNodesAttributes batch method
  - highlightNode (yellow: 0xffff00)
  - selectNode (orange: 0xffa500)
  - Lens position management methods
  - Selection state getters

☑ ForceGraphAdapterProps and ForceGraphAdapterRef
  - Complete compatibility interfaces
  - All event handlers
  - All rendering props
  - onEngineStop handler
  - d3AlphaTarget and restart methods

### Package Dependencies
☑ Three.js r157 (^0.157.0)
☑ React 18 (^18.2.0)
☑ @react-three/fiber (^8.15.0)
☑ @react-three/drei (^9.88.0)
☑ TypeScript types for Three.js

### Files Created/Modified
- ✅ /packages/canvas-latent/types/index.ts (created)
- ✅ /packages/canvas-latent/package.json (updated)
- ✅ /docs/pond-demo-aug14/scratchpads/BELLARD-S3-01-scratchpad.md (created)

## REFLECT

Task completed successfully. All required interfaces defined with exact compatibility for ForceGraphAdapter drop-in replacement. NodeData supports posByLens for multi-lens positioning, all HUD passthrough fields included, and NodeAttributeManager provides complete attribute management interface. Package.json updated with exact Three.js r157 and React 18 dependencies as specified.

**Completion Time:** 11:51 AM EST
**Status:** Ready for atomic commit

---