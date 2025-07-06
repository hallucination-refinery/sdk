import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    test: {
      include: ['packages/*/src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
      exclude: ['**/node_modules/**', '**/dist/**'],
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],
      globals: true,
      coverage: {
        enabled: true,
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        reportsDirectory: './coverage',
        exclude: [
          'node_modules/**',
          'dist/**',
          '**/*.d.ts',
          '**/*.test.{js,ts,jsx,tsx}',
          '**/*.spec.{js,ts,jsx,tsx}',
          '**/test-setup.ts',
          '**/vitest.config.ts',
          '**/tsup.config.ts',
        ],
        thresholds: {
          branches: 0,
          functions: 0,
          lines: 0,
          statements: 0,
          // Package-specific thresholds
          './packages/schema/src/**': {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
          },
          './packages/ops/src/**': {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
          },
        },
      },
    },
  },
])
