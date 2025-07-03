import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false, // Use tsc for type generation
  splitting: false,
  sourcemap: true,
  clean: true,
})