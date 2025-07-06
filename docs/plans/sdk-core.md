# Plan: sdk-core Extraction

## Goal

Isolate the shared runtime—Three.js scene, intent bus, selection hooks—into `packages/sdk-core`, decoupling demos from canvas-r3f internals.

## Public Exports (v0.0.1-alpha)

- `<IdeaCanvas />`
- `CanvasProvider`
- `useIdeaDispatch`, `useIdeaSelector`
- Types: `IdeaNode`, `IdeaEdge`, `Intent`

## Dependency Graph

`sdk-core` → `react` · `three` · `zustand` · `@refinery/schema` · `@refinery/ops`

## Migration Steps

1. Copy files from `canvas-r3f` and `interaction` unchanged.
2. Adjust internal imports to relative paths.
3. Re-export public API via `index.ts`.
4. Add peerDependencies in `package.json`.
5. Ensure `pnpm build` passes TS project references.

## Acceptance Criteria

- Build passes `tsc -b` with zero `TS6305` errors.
- Demo consumes sdk-core without local hacks.
- Public API documented via TypeDoc.
