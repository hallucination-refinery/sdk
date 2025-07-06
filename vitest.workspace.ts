import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  // Use package-specific configs which include their own setup files
  'packages/*/vitest.config.ts'
])
