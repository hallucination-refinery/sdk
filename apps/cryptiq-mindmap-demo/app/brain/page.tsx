'use client'

import { BrainIntegrationTest } from '@refinery/canvas-r3f'

export default function BrainPage() {
  return (
    <main className="w-screen h-screen">
      <BrainIntegrationTest showPerformance={false} debug={false} />
    </main>
  )
}
