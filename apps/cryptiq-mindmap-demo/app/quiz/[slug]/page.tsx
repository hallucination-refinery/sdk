'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import MaskStage from '../../components/MaskStage'
import dynamic from 'next/dynamic'
import RoundCountdown from '../../components/overlays/RoundCountdown'
// import AppHost from '../../draw3d/modules/AppHost'
import ProgressPill from '../../components/ui/ProgressPill'
import { DreamdustProvider } from '../../components/dreamdust/context'
import { InkFieldHost } from '../../components/dreamdust/InkFieldHost'
const PointCloudStage = dynamic(() => import('../../components/PointCloudStage'), { ssr: false })

type MaskOption = { id: string; label: string; vector?: Record<string, number> }
type MaskItem = {
  id: string
  title: string
  model?: string
  durationMs?: number
  alt?: string
  options: MaskOption[]
}
type ArchetypePack = {
  id: string
  packVersion?: number
  archetypes: string[]
  masks: MaskItem[]
}

export default function QuizPage() {
  useRouter()
  const [loading, setLoading] = useState(true)
  const [pack, setPack] = useState<ArchetypePack | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  // const [focusedOption, setFocusedOption] = useState(-1) // retained for future rounds UI
  const [sceneId, setSceneId] = useState<string | null>(null)
  const [showCountdown, setShowCountdown] = useState(true)
  const [autoOn] = useState(true) // placeholder toggle for now
  const [showProgress] = useState(false)
  const mainRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch('/packs/archetype-01.json')
        const data = await res.json()
        setPack(data)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  // Optional: render a point cloud instead of mask via ?pc
  useEffect(() => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    const pc = url.searchParams.get('pc')
    setSceneId(pc)
  }, [])

  const masks = useMemo<MaskItem[]>(() => (Array.isArray(pack?.masks) ? pack!.masks : []), [pack])
  const total = masks.length || 8
  const currentIndex = Math.min(Math.max(activeIndex, 0), Math.max(total - 1, 0))
  const current = masks[currentIndex]

  // Keyboard: Enter/Space → next; simple focus up/down retained
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (loading || !pack) return
      if (
        e.code === 'ArrowUp' ||
        e.code === 'ArrowDown' ||
        e.code === 'Enter' ||
        e.code === 'Space'
      ) {
        e.preventDefault()
      }
      if (e.code === 'ArrowUp') {
        // focus nav disabled during point-cloud prototyping
      } else if (e.code === 'ArrowDown') {
        // focus nav disabled during point-cloud prototyping
      } else if (e.code === 'Enter' || e.code === 'Space') {
        setActiveIndex((i) => Math.min(i + 1, Math.max(total - 1, 0)))
        // focus nav disabled during point-cloud prototyping
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [loading, pack, current, total])

  // Drawing filters disabled for point-cloud prototyping

  // When a result arrives, briefly show progress then advance to next mask
  // const handleResult = () => {
  //   setMorphing(true)
  //   setShowProgress(true)
  //   setTimeout(() => {
  //     setShowProgress(false)
  //     setMorphing(false)
  //     setActiveIndex((i) => Math.min(i + 1, Math.max(total - 1, 0)))
  //   }, 1200)
  // }

  const content = loading ? (
    <div style={{ padding: 24, color: '#9ab' }}>Loading…</div>
  ) : (
    <main
      ref={mainRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: '#00041A',
        overflow: 'hidden',
      }}
    >
      {/* Stage fills viewport */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          // All pointer-driven visual filters disabled to allow clean interaction
          filter: 'none',
        }}
      >
        {sceneId ? (
          <PointCloudStage
            sceneId={sceneId}
            zScale={2.6}
            pointSize={2.4}
            stride={2}
            perspective={true}
          />
        ) : (
          current && (
            <MaskStage model={current.model || '/models/mask-placeholder.glb'} opacity={1} />
          )
        )}
      </div>

      {/* Draw-to-3D overlay (disabled for point-cloud prototyping)
      <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        <AppHost onResult={handleResult} />
      </div>
      */}

      <InkFieldHost />

      {/* Top overlay: progress + prompt */}
      <div
        style={{
          position: 'absolute',
          top: 24,
          left: 24,
          right: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          pointerEvents: 'none',
          zIndex: 3,
        }}
      >
        <div
          style={{
            color: '#F5F5F5',
            fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
            fontSize: 14,
            letterSpacing: 0.24,
          }}
        >
          {`MASK ${currentIndex + 1}/${total}`}
        </div>
        <div
          style={{
            color: '#FFFFFF',
            fontFamily: 'var(--font-display), Anton, sans-serif',
            fontSize: 48,
            lineHeight: '1',
            textAlign: 'center',
          }}
        >
          DRAW THE FIRST THING YOU SEE
        </div>
        <div
          style={{ color: '#FAFAFA', fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace' }}
        >
          (House)
        </div>
      </div>

      {/* Bottom overlay: minimal controls (placeholders) */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: 24,
          right: 24,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 16,
          zIndex: 3,
        }}
      >
        <button style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }} disabled>
          Clear
        </button>
        <button style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }} disabled>
          Undo
        </button>
        <span style={{ color: '#9ab', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
          Auto: {autoOn ? 'On' : 'Off'}
        </span>
      </div>

      {/* Progress after morph */}
      <ProgressPill show={showProgress} />

      {/* Countdown overlay */}
      {showCountdown && <RoundCountdown seconds={3} onDone={() => setShowCountdown(false)} />}
    </main>
  )

  return <DreamdustProvider>{content}</DreamdustProvider>
}
