'use client'

import { useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

function IntroParticles() {
  // Reduced-motion check
  const reduce = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, #071222, #02060e)',
        overflow: 'hidden',
      }}
    >
      {!reduce && (
        <div
          style={{ position: 'absolute', inset: 0, animation: 'fadeIn 1200ms ease-out forwards' }}
        />
      )}
    </div>
  )
}

function HUDPrompt() {
  const router = useRouter()
  return (
    <div
      style={{
        position: 'absolute',
        right: 16,
        bottom: 16,
        padding: 16,
        borderRadius: 8,
        background: 'rgba(0,0,0,0.6)',
        color: '#fff',
        fontFamily: 'system-ui, sans-serif',
        display: 'flex',
        gap: 12,
        alignItems: 'center',
      }}
    >
      <button
        style={{
          padding: '8px 12px',
          borderRadius: 6,
          border: '1px solid #334',
          background: '#0b1222',
          color: '#9ab',
        }}
        aria-label="Import your Cryptiq memories (Coming Soon)"
        disabled
        title="Coming Soon"
      >
        Import (Coming Soon)
      </button>
      <button
        style={{
          padding: '8px 12px',
          borderRadius: 6,
          border: '1px solid #2bc7ff',
          background: '#0a1a30',
          color: '#2bc7ff',
        }}
        onClick={() => router.push('/quiz/mentor-energy')}
        aria-label="Start quick quiz"
      >
        Start
      </button>
    </div>
  )
}

export default function Home() {
  useEffect(() => {
    // telemetry stub
    console.log('[Landing] viewed')
  }, [])
  const BackgroundBrain = useMemo(() => dynamic(() => import('./components/BackgroundBrain'), { ssr: false }), [])
  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh', background: '#010c2a' }}>
      <BackgroundBrain />
      <IntroParticles />
      <HUDPrompt />
    </main>
  )
}
