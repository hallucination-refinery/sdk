# Refinery SDK

> A modular TypeScript SDK for building interactive 3D knowledge graphs with multimodal input support

## Overview

The Refinery SDK provides a comprehensive toolkit for creating, manipulating, and visualizing knowledge graphs in 3D space. Built with performance and accessibility in mind, it supports 1000+ node graphs at 60 FPS while maintaining WCAG 2.2 AA compliance.

## Features

- **🚀 High Performance**: Render 1000+ nodes at 60 FPS with GPU-optimized rendering
- **♿ Accessible**: Full keyboard navigation and screen reader support (WCAG 2.2 AA)
- **🎯 Type-Safe**: 100% TypeScript with Zod schema validation
- **🎨 Customizable**: Themeable UI components and configurable layouts
- **🤝 Multimodal**: Gesture and voice control via MediaPipe and Eleven Labs
- **📦 Modular**: Pick only the packages you need

## Quick Start

```bash
# Install core packages
pnpm add @refinery/schema @refinery/ops @refinery/store @refinery/canvas-r3f

# Optional: Add multimodal input support
pnpm add @refinery/input-hub

# Optional: Add UI widgets
pnpm add @refinery/widget-aperture @refinery/widget-hud
```

## Basic Example

```typescript
import { Graph, IdeaNode } from '@refinery/schema';
import { bfs, interwingle } from '@refinery/ops';
import { createGraphStore } from '@refinery/store';
import { Canvas } from '@refinery/canvas-r3f';

// Create a graph
const graph: Graph = {
  nodes: [
    { id: '1', label: 'Root Idea', metadata: { type: 'concept' } },
    { id: '2', label: 'Child Idea', metadata: { type: 'detail' } }
  ],
  edges: [
    { id: 'e1', source: '1', target: '2', metadata: { relationship: 'contains' } }
  ]
};

// Analyze connections
const connections = interwingle(graph, '1');
console.log('Connection strength:', connections);

// Render in 3D
function App() {
  const store = createGraphStore(graph);

  return (
    <Canvas
      store={store}
      width="100%"
      height="600px"
      options={{ targetFPS: 60 }}
    />
  );
}
```

## Package Structure

### Core Packages

- **[@refinery/schema](./packages/schema)** - Core type definitions and validation
- **[@refinery/ops](./packages/ops)** - Graph algorithms and operations
- **[@refinery/store](./packages/store)** - State management with Zustand

### UI Packages

- **[@refinery/canvas-r3f](./packages/canvas-r3f)** - 3D graph rendering with React Three Fiber
- **[@refinery/widget-aperture](./packages/widget-aperture)** - Idea browser widget
- **[@refinery/widget-hud](./packages/widget-hud)** - Heads-up display controls

### Input Package

- **[@refinery/input-hub](./packages/input-hub)** - Multimodal input coordination

## Development

```bash
# Clone the repository
git clone https://github.com/your-org/refinery-sdk.git
cd refinery-sdk

# Install dependencies (exact versions)
pnpm i --frozen-lockfile

# Build & type-check the entire workspace
pnpm run build

# Run tests with coverage
pnpm test:coverage

# Start development mode
pnpm dev
```

## Architecture

The SDK follows a layered architecture:

```
┌─────────────────────────────────────────┐
│            Applications                 │
├─────────────────────────────────────────┤
│     Widgets    │    Canvas    │  Input  │
├─────────────────────────────────────────┤
│              Store (Zustand)            │
├─────────────────────────────────────────┤
│            Ops (Algorithms)             │
├─────────────────────────────────────────┤
│           Schema (Core Types)           │
└─────────────────────────────────────────┘
```

## Performance

The SDK is optimized for rendering large graphs:

- **Target**: 1000+ nodes at 60 FPS
- **Techniques**: GPU instancing, LOD rendering, frustum culling
- **Fallback**: Automatic degradation to 30 FPS on low-end hardware

## Accessibility

All UI components follow WCAG 2.2 AA guidelines:

- Full keyboard navigation support
- Screen reader compatibility
- High contrast mode
- Reduced motion preferences
- Focus management

## API Documentation

Full API documentation is available at [https://your-org.github.io/refinery-sdk](https://your-org.github.io/refinery-sdk)

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
