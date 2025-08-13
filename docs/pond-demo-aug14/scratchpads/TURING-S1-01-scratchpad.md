# TURING-S1-01 Scratchpad
**Date/Time:** 2:11 PM EST, 13-08-2025
**Branch:** canvas-latent-core
**Task:** Scaffold Core surfaces (NodeAttributeManager & InstancedNodeMesh)

## 1. DECOMPOSE

### Prompt (verbatim):
```
[CORE / EXEC] Scaffold Core surfaces. Create `@packages/canvas-latent/src/core/NodeAttributeManager.ts` and `@packages/canvas-latent/src/core/InstancedNodeMesh.ts` with compile-ready **signatures only** (no rendering logic). Implement id↔index map stubs, typed array fields, dirty-range trackers, and factory surface; do **not** touch `types/` or `constants.ts`.
```

### Core Premise:
- Create two TypeScript files with class signatures only
- NodeAttributeManager: manages node attributes via nodeId-based API
- InstancedNodeMesh: factory for creating instanced mesh with opacity attribute
- Must be compile-ready but no actual rendering implementation

### Implicit Assumptions:
- THREE.js types are available
- TypeScript compilation environment is set up
- These are scaffolding files for later implementation

## 2. PLAN

### Subtasks:
1. **Verify TypeScript compilation** - Run guard check first
2. **Create NodeAttributeManager.ts** with:
   - Required method signatures
   - Internal typed arrays and maps
   - Dirty-range tracking fields
3. **Create InstancedNodeMesh.ts** with:
   - Build factory method
   - TODO for shader patching
4. **Commit changes** in two separate commits

## 3. PROBE

### OODA Loop for TypeScript Guard:
- **Observe:** Check if `pnpm -w -s tsc -p packages/canvas-latent` works
- **Orient:** If fails, STOP (sync drift issue)
- **Decide:** Only proceed if compilation passes
- **Act:** Run the check

### OODA Loop for NodeAttributeManager:
- **Observe:** Need nodeId-based API, no per-frame allocations
- **Orient:** Use Map for id↔index, typed arrays for perf
- **Decide:** Stub methods with minimal logic
- **Act:** Create class with required signatures

### OODA Loop for InstancedNodeMesh:
- **Observe:** Need factory returning mesh + opacity attribute
- **Orient:** Use THREE.InstancedMesh, THREE.InstancedBufferAttribute
- **Decide:** Return object with TODO for shader patch
- **Act:** Create build method

## 4. SEQUENCE

1. Guard check (TypeScript compilation)
2. Create NodeAttributeManager.ts
3. Verify compilation
4. Create InstancedNodeMesh.ts
5. Verify compilation
6. Commit NodeAttributeManager
7. Commit InstancedNodeMesh
8. Log SHAs

## 5. PARALLELIZE
No parallelization needed - sequential operations required.

## 6. VERIFY ×3
- Check method signatures match requirements
- Verify TypeScript compilation after each file
- Confirm commit messages follow format

## 7. CROSS-CHECK
- Review against success criteria checklist
- Ensure no modifications to types/ or constants.ts
- Verify nodeId-based API pattern

## 8. STRESS-TEST
- What if THREE types aren't available? (import them)
- What if directory doesn't exist? (create it)
- What if compilation fails? (fix before committing)

## 9. REFLECT
Creating scaffold files with signatures only, ensuring compile-ready state without implementation details. Focus on API surface matching requirements.

---

## Execution Log

### Step 1: TypeScript Guard Check
✅ Passed - TypeScript compilation successful

### Step 2: Created NodeAttributeManager.ts
✅ Created with all required method signatures and internal fields

### Step 3: Created InstancedNodeMesh.ts  
✅ Created with build factory method and TODO for shader patching

### Step 4: Commits
✅ Commit 1: `feat(core): scaffold NodeAttributeManager (id-based)` - SHA: 32840f10
✅ Commit 2: `feat(core): scaffold InstancedNodeMesh` - SHA: 42fbea3d

### Success Criteria Verification:
✅ NodeAttributeManager exports all required methods
✅ Internal typed arrays and dirty-range tracking implemented
✅ InstancedNodeMesh.build() returns mesh and aOpacity attribute
✅ TODO note added for onBeforeCompile shader patching
✅ Two commits created with proper messages
✅ Compilation verified after each file creation