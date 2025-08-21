'use client'

import { BrainIntegrationTest } from '@refinery/canvas-r3f'

export default function BrainPage() {
  // Screenshot mode: freeze any time-based animation globally
  if (process.env.NEXT_PUBLIC_SCREENSHOT_MODE === '1') {
    if (typeof document !== 'undefined') {
      const style = document.createElement('style')
      style.innerHTML = '*{animation:none !important; transition:none !important;}'
      document.head.appendChild(style)
    }
  }
  return (
    <main className="w-screen h-screen">
      <BrainIntegrationTest showPerformance={false} debug={false} />
    </main>
  )
}
