import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  eslint: {
    // Sub-W: Temporarily ignore ESLint during Next.js production build
    ignoreDuringBuilds: false,
  },
  typescript: {
    // TypeScript errors will now fail the build
    ignoreBuildErrors: false,
  },
  distDir: '.next',
  generateBuildId: async () => {
    // You can use any logic here to generate a build ID
    return 'build-' + Date.now()
  },
  webpack: (config, { isServer: _isServer, defaultLoaders: _defaultLoaders }) => {
    // Ensure symlinks are resolved, which is important for monorepos
    config.resolve.symlinks = true

    // Add an alias for 'three' to ensure only one instance is used
    config.resolve.alias = {
      ...config.resolve.alias,
      three: path.resolve('../../../../node_modules/three'),
      '@': path.resolve(__dirname),
    }

    // Important: return the modified config
    return config
  },
}

export default nextConfig
