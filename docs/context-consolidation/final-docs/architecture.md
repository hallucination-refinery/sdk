# Architecture

## Overview
Monorepo with 18 packages focused on canvas rendering, graph visualization, and interactive widgets. Built on TypeScript with React and Three.js for 3D rendering.

## Core Components

### Visualization Layer
- **canvas-r3f**: React Three Fiber canvas implementation (packages/canvas-r3f/src/index.ts)
- **canvas-latent**: Latent space canvas (packages/canvas-latent/)
- **view-three**: Three.js view layer (packages/view-three/)

### Data & State
- **store**: Central state management (packages/store/)
- **schema**: Data models and types (packages/schema/)
- **graph-forge**: Graph data structures (packages/graph-forge/)

### Input & Interaction
- **input-hub**: Input handling (packages/input-hub/)
- **interaction**: User interaction layer (packages/interaction/)
- **gesture-hands**: Hand gesture support (packages/gesture-hands/src/index.ts:1)

### Widgets
- **widget-aperture**: Aperture widget component (packages/widget-aperture/)
- **widget-hud**: HUD overlay widget (packages/widget-hud/)

### Infrastructure
- **sdk-core**: Core SDK functionality (packages/sdk-core/)
- **ops**: Operations utilities (packages/ops/)
- **shared**: Shared utilities (packages/shared/)

## Dependencies & Relationships
- canvas-r3f imports from @refinery/store (packages/canvas-r3f/src/index.ts:20)
- canvas-r3f imports from @refinery/schema (packages/canvas-r3f/dist/CanvasProvider.d.ts:11)
- Components use React and Three.js for rendering
- TypeScript throughout with per-package tsconfig

## Key Flows
- Canvas rendering: CanvasProvider → Canvas → NodeSprite/ForceGraphAdapter
- State management: store → RendererCommand → canvas components
- Data modeling: schema (IdeaNode, Edge) → visualization components

## Entry Points
- Package exports: packages/*/src/index.ts
- Canvas component: packages/canvas-r3f/dist/Canvas.d.ts:1
- Archive docs: docs/archive/index.html, docs/archive/index.md

## Source References
- Canvas exports: packages/canvas-r3f/src/index.ts:5-9
- ForceGraphAdapter: packages/canvas-r3f/dist/adapters/ForceGraphAdapter.d.ts:1-4
- NodeSprite: packages/canvas-r3f/dist/components/NodeSprite.d.ts:7
- Performance monitoring: packages/canvas-r3f/dist/perf-probe.d.ts:2

## Open Questions
- [TBD: Main application entry point - no main.* files found outside archives]
- [TBD: Runtime configuration loading from .env]
- [TBD: Build output structure and deployment targets]