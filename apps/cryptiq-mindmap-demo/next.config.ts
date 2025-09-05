import type { NextConfig } from 'next'
import './env' // Validate env at config load (safe defaults)

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: [
    '@refinery/sdk-core',
    '@refinery/canvas-r3f',
    '@refinery/graph-forge',
    '@refinery/schema',
    '@refinery/store',
    '@refinery/ops',
    '@refinery/input-hub',
    '@refinery/widget-aperture',
    '@refinery/widget-hud',
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
