'use client'

import { useEffect, useState } from 'react'

export interface RoundCountdownProps {
  seconds?: number
  title?: string
  hint?: string
  onDone: () => void
}

export default function RoundCountdown({
  seconds = 3,
  title = 'Draw the first thing you see',
  hint = '(House)',
  onDone,
}: RoundCountdownProps) {
  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState(seconds)

  // avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // countdown logic
  useEffect(() => {
    if (!mounted) return
    if (time <= 0) {
      onDone()
      return
    }
    const id = window.setTimeout(() => setTime((t) => t - 1), 1000)
    return () => clearTimeout(id)
  }, [time, mounted, onDone])

  if (!mounted) return null

  const radius = 54
  const circumference = 2 * Math.PI * radius
  const progress = time / seconds
  const dashOffset = circumference * (1 - progress)

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#FFFFFF',
        zIndex: 100,
        pointerEvents: 'auto',
      }}
    >
      <div style={{ position: 'relative', width: 120, height: 120 }}>
        <svg width={120} height={120} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={60}
            cy={60}
            r={radius}
            stroke="#444"
            strokeWidth={6}
            fill="none"
          />
          <circle
            cx={60}
            cy={60}
            r={radius}
            stroke="#fff"
            strokeWidth={6}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
            fontWeight: 600,
            lineHeight: '32px',
            userSelect: 'none',
          }}
        >
          {time}
        </div>
      </div>
      <div
        style={{
          marginTop: 24,
          textAlign: 'center',
          fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
        }}
      >
        <div style={{ fontSize: 20, lineHeight: '24px', marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 16, lineHeight: '20px', opacity: 0.7 }}>{hint}</div>
      </div>
    </div>
  )
}
