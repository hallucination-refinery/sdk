'use client'

import { useEffect, useState } from 'react'

export default function ProgressPill({ show }: { show: boolean }) {
  const [visible, setVisible] = useState(show)
  useEffect(() => {
    if (show) setVisible(true)
  }, [show])

  const handleEnd = () => {
    if (!show) setVisible(false)
  }

  return (
    <div
      onTransitionEnd={handleEnd}
      style={{
        position: 'absolute',
        top: 24,
        right: 24,
        padding: '6px 12px',
        borderRadius: 9999,
        background: 'rgba(0,0,0,0.6)',
        color: '#fff',
        fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
        fontSize: 14,
        lineHeight: '16px',
        opacity: show ? 1 : 0,
        transform: `scale(${show ? 1 : 0.9})`,
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        display: visible ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5,
      }}
    >
      1/8
    </div>
  )
}

