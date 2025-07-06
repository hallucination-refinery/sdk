# Plan: graph-forge Loader

## Goal

Provide a minimal loader that converts raw memory JSON into graph data plus widget manifest consumed by sdk-core.

## API

```ts
export interface ForgeOptions {
  seed?: number
  cooldownTicks?: number // default 120
}

export function forgeGraph(
  raw: RawMemory[],
  opts?: ForgeOptions
): {
  nodes: IdeaNode[]
  edges: IdeaEdge[]
  widgetSpec: WidgetManifest
}
```

## CLI

`pnpm graph-forge raw.json --out graph.json`

– Executes 2-second r3f-forcegraph simulation, snapshots positions, attaches style hints.

## Acceptance Tests

1. Deterministic output when `seed` supplied.
2. ≤300 ms wall time on 2 000-node sample (Apple M1).
3. Invalid input triggers descriptive Zod validation error.
