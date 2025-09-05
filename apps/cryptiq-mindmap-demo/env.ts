import { z } from 'zod'

// Minimal environment schema for the demo app
const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_GRAPH_SPAWN: z.enum(['sphere', 'origin']).optional(),
  NEXT_PUBLIC_DEBUG_GRAPH: z.enum(['true', 'false']).optional(),
  NEXT_PUBLIC_PIXELATE: z.enum(['0', '1']).default('0'),
  NEXT_PUBLIC_SCREENSHOT_MODE: z.enum(['0', '1']).default('0'),
  NEXT_PUBLIC_ENABLE_CONTROLS: z.enum(['0', '1']).default('0'),
})

export const env = EnvSchema.parse(process.env)
export type Env = z.infer<typeof EnvSchema>

