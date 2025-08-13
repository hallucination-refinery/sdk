# LOVELACE-01 Scratchpad
**Date:** 2025-08-13 15:05 EST  
**Branch:** canvas-latent-interaction  
**Task ID:** INTERACTION / EXEC (Re-run)

## 1. DECOMPOSE

### Prompt (Verbatim)
> [INTERACTION / EXEC] Create animation & interaction skeletons. Add `animations/TweenRegistry.ts`, `animations/BurstAnimation.ts` (interfaces only), `interactions/StateMachine.ts` with states (Idle, Highlighting, Selected, Morphing, Fading) and transition map; **no logic yet**.

### Core Premise
- Create skeleton/interface files for animation and interaction systems
- No implementation logic, only type definitions and interfaces
- Establish foundation for tween animations, burst effects, and state management

### Implicit Assumptions
- These files will be in packages/canvas-latent/src/
- Must integrate with existing NodeData/AnimationConfig from Integration layer
- Must reference Core NodeAttributeManager types (signatures only)
- Need to handle time-based animations with easing

## 2. PLAN

### Subtasks
1. Create TweenRegistry interface with required methods
2. Create BurstAnimation interface with config structure
3. Create StateMachine with state enum and transition map
4. Ensure proper imports from Integration and Core layers
5. Verify TypeScript compilation
6. Commit with specific message format

## 3. PROBE

### TweenRegistry Perspectives
- **Purpose**: Central registry for managing active tweens
- **Requirements**: add(), tick(), cancel() methods
- **Time handling**: Accept now:()=>number for time source
- **Easing**: Optional easing function parameter
- **Completion**: onComplete callback support

### BurstAnimation Perspectives  
- **Purpose**: Interface for burst animation configuration
- **Inputs**: nodes, getTarget, manager, registry, now, duration
- **No mutation**: Never mutate Core arrays directly
- **Manager API**: Route all updates through manager

### StateMachine Perspectives
- **States**: Idle, Highlighting, Selected, Morphing, Fading
- **Transitions**: Map of valid state transitions
- **Guard**: "interactions disabled during Morphing"
- **No implementation**: Just type definitions

## 4. SEQUENCE

1. Create animations directory structure
2. Implement TweenRegistry.ts with interface
3. Implement BurstAnimation.ts with interface
4. Create interactions directory
5. Implement StateMachine.ts with states and transitions
6. Run TypeScript check
7. Commit changes
8. Log SHA to working-doc

## 5. PARALLELIZE

All files can be created in parallel as they're interfaces only.

## 6. VERIFY ×3

- ✓ Check all required method signatures present
- ✓ Verify import paths follow parallel-protocol
- ✓ Ensure no implementation logic included

## 7. CROSS-CHECK

- Review behavioral-contract.md for burst/morph/fade specs
- Review parallel-protocol.md for import hierarchy
- Check ForceGraphAdapter.tsx for event names

## 8. STRESS-TEST

- What if TypeScript compilation fails?
  → Stop immediately per warning
- What if import paths are wrong?
  → Follow parallel-protocol strictly
- What if state transitions conflict?
  → Document guard conditions clearly

## 9. REFLECT

Final review:
- Creating skeleton files only (no logic)
- Three main components: TweenRegistry, BurstAnimation, StateMachine
- Must pass TypeScript compilation
- Single commit with specific message format
- Log SHA to working document

## Execution Log

### Step 1: Creating TweenRegistry.ts
- Location: packages/canvas-latent/src/animations/TweenRegistry.ts
- Methods: add(), tick(), cancel()
- Removed runBurst method (not part of spec)

### Step 2: Creating BurstAnimation.ts  
- Location: packages/canvas-latent/src/animations/BurstAnimation.ts
- Interface only with runBurst function signature
- Updated NodeAttributeManager interface to match expected Core API

### Step 3: Creating StateMachine.ts
- Location: packages/canvas-latent/src/interactions/StateMachine.ts
- States enum and transition map
- Guard condition: interactions disabled during Morphing

### Step 4: TypeScript Verification
- Command: pnpm -w -s tsc -p packages/canvas-latent
- Result: ✅ PASSED

### Step 5: Commit
- Message: feat(anim): add TweenRegistry/Burst interfaces and FSM skeleton
- SHA: 7f1775cb
- Logged to working-doc: ✅ COMPLETED (15:05 EST)