# Store Package – Specification (Task 4)

Version: v0.1 Sprint-1

## Goal

Migrate from the legacy monolithic reducer to a slice-based **Zustand** global state store that powers graph operations and UI layers.

## Dependencies

- @refinery/schema – typed data models
- @refinery/ops – graph algorithms

## Requirements

1. **Zustand Slices**
   • Separate slices for graph data, UI state, and async jobs.
   • Compose with `createStore` → exported as `useStore` hook.
2. **Typed Actions**
   • Each action emits a `RendererCommand` object consumed by Canvas/UI.
   • No any-casts; rely on generics & `ReturnType` helpers.
3. **Selectors**
   • Provide memoised selectors (`createSelector`) for common queries: getNode(id), getEdge(id), selectedNodes, etc.
4. **Immutability**
   • All state updates must be immutable; use structural sharing helpers if needed.
5. **ForceGraphRef & eventMux Removal**
   • Eliminate global refs; communication flows through typed actions only.
6. **Persistence & Hydration**
   • Implement JSON serialise/deserialize helpers for graph state.
7. **Performance**
   • Must handle 1 k-node graph updates at ≥30 FPS benchmark in unit tests.

## Test Strategy

- Vitest covering ≥80 % lines/branches.
- Unit tests for:
  – Slice initialisation & default state.
  – Each action produces correct state & RendererCommand.
  – Selectors return memoised results.
  – Persistence round-trip maintains data integrity.

## Deliverables

- `packages/store/src/` with slices, actions, selectors.
- `packages/store/index.ts` exporting public API.
- `dist/` with type declarations via `tsc -b`.
- Passing `pnpm -r exec vitest run`.

---

_Adapted from .taskmaster/tasks/tasks.json (Task 4)._
