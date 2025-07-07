# Cryptiq Mind Map Demo

An interactive mind map visualization built with Next.js and the Refinery SDK, capable of rendering 1000+ nodes at 60+ FPS.

## Features

- **High Performance**: Renders 1014 nodes with optimized performance
- **Interactive Controls**: 
  - CategoryHUD for filtering nodes by category
  - ControlsHUD showing keyboard and mouse controls
- **Responsive Design**: Full-screen visualization with Tailwind CSS
- **Type-safe**: Built with TypeScript
- **Well-tested**: 85%+ test coverage with Vitest

## Getting Started

### Prerequisites
- Node.js >= 20.0.0
- pnpm >= 9.0.0

### Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Testing

```bash
# Run tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

### Building

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
cryptiq-mindmap-demo/
├── app/              # Next.js app directory
│   ├── page.tsx      # Main page with 1k node generation
│   └── layout.tsx    # Root layout
├── components/       # React components
│   ├── CategoryHUD.tsx    # Category filter controls
│   └── ControlsHUD.tsx    # Keyboard/mouse controls display
├── __tests__/        # Test files
└── public/           # Static assets
```

## Performance

- Initial bundle size: ~115KB
- Generates hierarchical graph with:
  - 1 central node
  - 8 main categories
  - 15 topics per category
  - ~8 items per topic
- Optimized edge rendering (70% of edges for performance)

## Deployment

### Vercel (Recommended)

The app is configured for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Set root directory to `apps/cryptiq-mindmap-demo`
3. Deploy (configuration is auto-detected from `/vercel.json`)

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Other Platforms

Build the app and serve the `.next` directory:

```bash
pnpm build
# Deploy the .next directory to your hosting platform
```

## Technologies

- **Next.js 15.3** - React framework
- **@refinery/widget-aperture** - Graph visualization widget
- **Tailwind CSS 4** - Styling
- **Vitest** - Testing framework
- **TypeScript 5** - Type safety