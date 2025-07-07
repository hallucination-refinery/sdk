# Cryptic Vault 3D Visualization Demo

A privacy-first 3D visualization of encrypted memory constellation using React Three Fiber.

## Features

- 53 memory nodes visualized as colored spheres in 3D space
- Cluster-based coloring system for different memory types
- Interactive camera controls (WASD/QE/Mouse)
- Connection lines between related memories
- Hover labels showing memory details
- Privacy badge indicating local processing

## Quick Start

```bash
# From the monorepo root
pnpm install
cd apps/cryptic-vault-demo
pnpm dev
```

Visit http://localhost:3000

## Controls

- **WASD/Arrow Keys** - Pan camera
- **Q/E or Mouse Wheel** - Zoom in/out
- **Space** - Auto-zoom to brain view (z=3500)
- **R** - Reset camera to default position
- **H** - Hippocampus easter egg (coming soon)
- **Mouse Drag** - Orbit camera

## Project Structure

```
cryptic-vault-demo/
├── app/                  # Next.js app directory
├── components/           # React components
│   ├── CrypticVaultScene.tsx
│   ├── MemoryNodes.tsx
│   ├── KeyboardControls.tsx
│   ├── PrivacyBadge.tsx
│   └── ControlsHUD.tsx
├── data/                 # Test data
│   └── memories.json
└── lib/                  # Types and utilities
    └── types.ts
```

## Data Generation

To regenerate test data:

```bash
pnpm generate-data
```

This creates 53 memory records with:

- Pre-computed 3D positions
- Cluster-based categorization
- Inter-memory connections
- Sample metadata

## Next Steps

- [ ] LOD system for distance-based rendering
- [ ] Brain mesh visualization at far distances
- [ ] Particle morph animations
- [ ] Hippocampus easter egg
- [ ] Performance optimizations
