'use client'

import BackgroundBrain from '../components/BackgroundBrain'

export default function BrainPage() {
  // Screenshot mode: freeze any time-based animation globally
  if (process.env.NEXT_PUBLIC_SCREENSHOT_MODE === '1' && typeof document !== 'undefined') {
    const style = document.createElement('style')
    style.innerHTML = '*{animation:none !important; transition:none !important;}'
    document.head.appendChild(style)
  }
  return (
    <main
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        background: 'black',
        overflow: 'hidden',
      }}
    >
      <BackgroundBrain forceControls={true} />
    </main>
  )
}
