'use client'

import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import type { PerspectiveCamera } from 'three'
import type { RootState } from '@react-three/fiber'
import { tweenCamera } from './components/anim/camera'
import { getR3FStateOrNull } from './components/anim/r3fSafe'
import ProgressPill from './components/ui/ProgressPill'
import RoundCountdown from './components/overlays/RoundCountdown'
import useRoundOne from './rounds/useRoundOne'
import { applyResult } from './integration/mindmapAdapter'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [preloading, setPreloading] = useState(true)
  const round = useRoundOne()
  const { hyperdriveDone, startCountdown, result } = round
  const [showProgress] = useState(false)
  useEffect(() => {
    // telemetry stub
    console.log('[Landing] viewed')
    const t = setTimeout(() => setPreloading(false), 2200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!result) return
    const outcome = applyResult(result)
    console.log('[mindmap] applied', outcome)
  }, [result])

  const BackgroundBrain = useMemo(
    () => dynamic(() => import('./components/BackgroundBrain'), { ssr: false }),
    []
  )

  const router = useRouter()
  const cancelRef = useRef(false)
  // R3F readiness and camera reference
  const cameraRef = useRef<PerspectiveCamera | null>(null)
  const storeReadyRef = useRef(false)

  const onReady = useCallback((state: RootState) => {
    try {
      cameraRef.current = (state.camera as PerspectiveCamera) ?? null
      storeReadyRef.current = true
    } catch {
      // ignore
    }
  }, [])

  // Begin: immediately route to mask page on Space/Begin
  const begin = useCallback(() => {
    router.push('/quiz/archetype-v1')
  }, [router])

  useEffect(() => {
    cancelRef.current = false
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault()
        begin()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      cancelRef.current = true
      window.removeEventListener('keydown', onKey)
    }
  }, [begin])

  return (
    <main
      style={{
        width: '100%',
        height: '100%',
        background: '#00041A',
        overflow: 'hidden',
        position: 'relative',
        display: 'block',
      }}
    >
      {/* Brain fills entire viewport */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <BackgroundBrain onReady={onReady} />
      </div>

      {/* Foreground chrome: column with space-between, safe-area paddings */}
      {!preloading && (
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            height: '100%',
            paddingTop: 128,
            paddingBottom: 128,
            paddingLeft: 24,
            paddingRight: 24,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'stretch',
          }}
        >
          {/* Header stack (centered) */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 8,
              userSelect: 'none',
            }}
          >
            <div
              style={{
                width: '100%',
                textAlign: 'center',
                color: '#FAFAFA',
                fontSize: 24,
                fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
                fontWeight: 600,
                lineHeight: '28.8px',
                letterSpacing: 0.24,
              }}
            >
              CRYPTIQ x REFINERY (SDK) PRESENT
            </div>
            <div
              style={{
                width: '100%',
                textAlign: 'center',
                color: '#FFFFFF',
                fontSize: 150,
                fontFamily: 'var(--font-display), Anton, sans-serif',
                fontWeight: 400,
                lineHeight: '135px',
                letterSpacing: -3,
                whiteSpace: 'nowrap',
              }}
            >
              MINDMAP
            </div>
          </div>

          {/* CTA pinned to bottom safe area */}
          <div
            aria-hidden
            style={{
              width: '100%',
              height: 87,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              columnGap: 8,
              fontSize: 20,
              fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
              fontWeight: 500,
              lineHeight: '22px',
              userSelect: 'none',
            }}
          >
            <span style={{ color: '#FAFAFA' }}>PRESS</span>
            <span style={{ color: '#FFFFFF' }}>[SPACE]</span>
            <span style={{ color: '#FAFAFA' }}>TO BEGIN</span>
          </div>
        </div>
      )}

      {/* Preloader overlay (2.2s stub) */}
      {preloading && (
        <div
          aria-hidden
          style={{ position: 'absolute', inset: 0, background: '#00041A', zIndex: 20 }}
        />
      )}

      {/* Round 1 countdown overlay (not used when immediate routing) */}
      {false && round.state === 'countdown' && <RoundCountdown onDone={round.enableDrawing} />}

      <ProgressPill show={showProgress} />
    </main>
  )
}
