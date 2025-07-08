# @refinery/sdk-core

Core SDK components for building spatial idea-graph interfaces with React Three Fiber.

## Features

- `<Animus />` - Main 3D canvas component for rendering graph visualizations
- `<CanvasProvider />` - State management and command processing for canvas interactions
- `useCanvas` - Hook for accessing canvas state and dispatching commands
- Intent bus for declarative state updates

## Installation

```bash
pnpm add @refinery/sdk-core
```

## Usage

```tsx
import { Animus, CanvasProvider } from '@refinery/sdk-core'

function App() {
  return (
    <CanvasProvider>
      <Animus
        nodes={nodes}
        edges={edges}
        // ... other props
      />
    </CanvasProvider>
  )
}
```

## API

### Animus Component

The main canvas component that renders the 3D graph visualization.

### CanvasProvider

Context provider that manages canvas state and processes renderer commands.

### useCanvas Hook

Access canvas state and dispatch commands from child components.

```tsx
const { state, enqueueCommand } = useCanvas()
```