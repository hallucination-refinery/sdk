# Cryptiq Mind Map Demo - Deployment Guide

## Vercel Deployment

This app is configured for deployment on Vercel with the following settings:

### Configuration
- **Framework**: Next.js
- **Build Command**: `pnpm install && pnpm -w exec turbo run build --filter apps/cryptiq-mindmap-demo`
- **Output Directory**: `apps/cryptiq-mindmap-demo/.next`
- **Install Command**: `pnpm install`

### To Deploy

1. **Via Vercel CLI**:
   ```bash
   vercel --cwd apps/cryptiq-mindmap-demo
   ```

2. **Via GitHub Integration**:
   - Connect your repository to Vercel
   - Set the root directory to `apps/cryptiq-mindmap-demo`
   - Vercel will automatically detect the configuration from `/vercel.json`

### Environment Variables
No environment variables are required for this demo.

### Build Output
- Generates a static site with ~1014 nodes
- Bundle size: ~115KB First Load JS
- Includes CategoryHUD and ControlsHUD components
- Optimized for 60+ FPS performance

### Preview URL
After deployment, your app will be available at:
- Production: `https://your-project.vercel.app`
- Preview: `https://your-project-git-branch-name.vercel.app`

### Testing
Run tests before deployment:
```bash
pnpm test:coverage
```

Current coverage: >85% across all metrics