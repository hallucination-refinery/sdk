import type { NextConfig } from 'next'
import path from 'path'

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
  webpack: (config, { isServer, defaultLoaders }) => {
    // Ensure symlinks are resolved, which is important for monorepos
    config.resolve.symlinks = true;

    // Add an alias for 'three' to ensure only one instance is used
    // This points to the 'three' module installed in the monorepo root
    config.resolve.alias = {
      ...config.resolve.alias,
      three: path.resolve('../../node_modules/three'),
      '@': path.resolve(__dirname),
    };

    // Important: return the modified config
    return config;
  },
}

export default nextConfig
