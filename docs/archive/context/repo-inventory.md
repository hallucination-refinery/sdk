# Repository Inventory

## Languages Summary

| Language | File Count | Primary Use |
|----------|------------|-------------|
| TypeScript/JavaScript | ~516 | Main application code |
| Markdown | ~166 | Documentation |
| Python | ~12 | Meta-workflow tools & archaeology scripts |
| JSON/YAML | Multiple | Configuration & data |

## Modules

| Path | Purpose | Language |
|------|---------|----------|
| **Root** | Monorepo management | TypeScript |
| **Apps** | | |
| `apps/cryptiq-mindmap-demo` | Mindmap demo application | TypeScript/Next.js |
| `apps/legacy-import/cryptic-vault-demo` | Legacy vault demo application | TypeScript/Next.js |
| **Core Packages** | | |
| `packages/canvas-latent` | Canvas latent space functionality | TypeScript |
| `packages/canvas-r3f` | React Three Fiber canvas components | TypeScript |
| `packages/gesture-hands` | Hand gesture recognition | TypeScript |
| `packages/graph-forge` | Graph algorithms and operations | TypeScript |
| `packages/ideanode` | Idea node management | TypeScript |
| `packages/input-hub` | Input handling hub | TypeScript |
| `packages/interaction` | User interaction layer | TypeScript |
| `packages/ops` | Graph algorithms and functional operations | TypeScript |
| `packages/schema` | Data schemas and types | TypeScript |
| `packages/sdk-core` | Core SDK functionality | TypeScript |
| `packages/shared` | Shared utilities and components | TypeScript |
| `packages/store` | State management | TypeScript |
| `packages/thinkable` | Thinking/reasoning components | TypeScript |
| `packages/view-three` | Three.js view components | TypeScript |
| `packages/widget-aperture` | Aperture widget components | TypeScript |
| `packages/widget-hud` | HUD widget components | TypeScript |
| **Tools** | | |
| `tools/meta-workflow` | Meta-workflow automation | Python |

## Entry Points & Binaries

### JavaScript/TypeScript Entry Points
- All packages expose `src/index.ts` as main entry
- Apps use Next.js conventions (`pages/` or `app/` directories)

### Binaries
- `packages/graph-forge/bin/graph-forge.ts` - Graph forge CLI tool

### Python Scripts
- `run_git_archaeology.py` - Git archaeology runner
- `git_archaeology.py` - Main archaeology implementation
- `validate_learning.py` - Learning validation
- `test_persistence.py` - Persistence testing
- `tools/meta-workflow/src/runner.py` - Meta-workflow runner (executable)
- `tools/meta-workflow/src/run_local_loop.py` - Local loop runner

## Build Configuration
- **Package Manager**: pnpm (workspace)
- **Build Tool**: Turbo
- **Test Runner**: Vitest
- **Type Checking**: TypeScript
- **Linting**: ESLint
