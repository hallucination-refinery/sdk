'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
// dynamic import not required here
import MaskStage from '../../components/MaskStage'
import dynamic from 'next/dynamic'
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

// AnalysisBar removed (unused in side-panel template)

export default function QuizPage() {
  useRouter() // keep navigation available if needed later
  const [loading, setLoading] = useState(true)
  const [pack, setPack] = useState<ArchetypePack | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [focusedOption, setFocusedOption] = useState(-1)
  const [sceneId, setSceneId] = useState<string | null>(null)
  // Brain background not used on quiz model stage for now

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch('/packs/archetype-01.json')
        const data = await res.json()
        setPack(data)
      } finally {
        setLoading(false)
        console.log('[Quiz] start')
      }
    }
    run()
  }, [])

  // Read ?pc=scene-xx to switch right-pane renderer to point cloud
  useEffect(() => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    const pc = url.searchParams.get('pc')
    setSceneId(pc)
  }, [])

  const masks = useMemo<MaskItem[]>(() => (Array.isArray(pack?.masks) ? pack!.masks : []), [pack])
  const total = masks.length || 10
  const currentIndex = Math.min(Math.max(activeIndex, 0), Math.max(total - 1, 0))
  const current = masks[currentIndex]
  const optionCount = current?.options?.length || 0
  // Derive a title with a hard cap of 19 characters (including spaces), trimming to last space
  const truncatedTitle = useMemo(() => {
    const source = current?.title || 'MASK TITLE'
    const raw = source.toString().toUpperCase()
    const max = 19
    if (raw.length <= max) return raw
    const slice = raw.slice(0, max)
    const lastSpace = slice.lastIndexOf(' ')
    return lastSpace > 0 ? slice.slice(0, lastSpace) : slice
  }, [current])

  // Keyboard controls: Up/Down move focus; Enter selects next; Space skips
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
        setFocusedOption((i) => {
          if (optionCount <= 0) return -1
          const base = i === -1 ? 0 : i
          return (base - 1 + optionCount) % optionCount
        })
      } else if (e.code === 'ArrowDown') {
        setFocusedOption((i) => {
          if (optionCount <= 0) return -1
          const base = i === -1 ? 0 : i
          return (base + 1) % optionCount
        })
      } else if (e.code === 'Enter' || e.code === 'Space') {
        setActiveIndex((i) => Math.min(i + 1, Math.max(total - 1, 0)))
        // reset focus for next mask
        setFocusedOption(-1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [loading, pack, optionCount, total])

  if (loading) return <div style={{ padding: 24, color: '#9ab' }}>Loading…</div>

  return (
    <main
      style={{
        width: '100%',
        height: '100%',
        background: 'black',
        overflow: 'hidden',
        justifyContent: 'flex-end',
        alignItems: 'stretch',
        display: 'inline-flex',
      }}
    >
      {/* Left side panel */}
      <div
        style={{
          width: 581,
          alignSelf: 'stretch',
          background: '#00041A',
          paddingTop: 0,
          paddingLeft: 24,
          paddingRight: 24,
          display: 'inline-flex',
          flexDirection: 'column',
          gap: 36,
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}
      >
        {/* Progress indicator */}
        <div style={{ display: 'flex', gap: 20, padding: '24px 0' }}>
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'relative',
                width: i === currentIndex ? 40 : 32,
                height: i === currentIndex ? 40 : 32,
              }}
            >
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  border:
                    i === currentIndex ? '4px solid #fff' : '1px solid rgba(245,245,245,0.96)',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          ))}
        </div>

        {/* Mask header and title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            alignItems: 'flex-start',
            width: '100%',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
              fontWeight: 500,
              fontSize: 24,
              color: '#F5F5F5',
              letterSpacing: 0.24,
            }}
          >
            {`[MASK ${currentIndex + 1}/${total}]`}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display), Anton, sans-serif',
              fontSize: 120,
              color: '#fff',
              letterSpacing: -2.4,
              lineHeight: '108px',
            }}
          >
            {truncatedTitle}
          </div>
        </div>

        {/* Hint box */}
        <div
          style={{
            position: 'relative',
            border: '1px solid #F5F5F5',
            borderRadius: 2,
            paddingTop: 18,
            paddingBottom: 12,
            paddingLeft: 16,
            paddingRight: 16,
            color: '#F5F5F5',
            fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
            fontSize: 14,
            lineHeight: '1.1',
            minHeight: 182,
            width: '100%',
          }}
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              top: -9,
              left: 12,
              background: '#00041A',
              paddingLeft: 8,
              paddingRight: 8,
              fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
              fontSize: 14,
              whiteSpace: 'nowrap',
              color: '#F5F5F5',
              lineHeight: 1,
            }}
          >
            <span style={{ fontWeight: 600, color: '#FAFAFA' }}>HINT</span>
            <span>{' — Cryptiq Mindmap v1.0.0 — 2025-08-30'}</span>
          </div>
          <pre
            style={{ margin: 0, whiteSpace: 'pre-wrap', letterSpacing: '-0.42px' }}
          >{`Archival backup of concept pack and UI assets. No executables
or user PII included.
Modified files (timestamps may differ):
 • packs/archetype-v1.json
 • public/models/brain-anchors-500.json
 • public/assets/maskpack-v1/*.png
Quick notes: 8 timed Rorschach masks; ~400 pre-seeded concepts;
hover-only neighbor edges; results saved as short signed IDs
(30d TTL).`}</pre>
        </div>

        {/* Options list (from mask options) */}
        <div
          style={{
            fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
            fontSize: 24,
            lineHeight: '28.8px',
            color: 'rgba(245,245,245,0.9)',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            padding: '16px 20px 24px 20px',
          }}
        >
          {(current?.options || [])
            .slice(0, 5)
            .map((o: { id?: string; label?: string }, idx: number) => (
              <div key={o.id || idx} style={{ textTransform: 'uppercase' }}>
                <span style={{ color: '#F5F5F5' }}>{idx + 1}. </span>
                <button
                  onClick={() => setActiveIndex((i) => Math.min(i + 1, total - 1))}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    margin: 0,
                    fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
                    fontSize: 24,
                    lineHeight: '28.8px',
                    fontWeight: 400,
                    textTransform: 'uppercase',
                    color: focusedOption === idx ? '#FFFFFF' : 'rgba(245,245,245,0.9)',
                    textDecoration: focusedOption === idx ? 'underline' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  {o.label || 'Option'}
                </button>
              </div>
            ))}
        </div>

        {/* Controls row (Figma Dev spec) */}
        <div
          style={{
            width: '100%',
            height: '100%',
            paddingTop: 24,
            paddingBottom: 24,
            justifyContent: 'center',
            alignItems: 'flex-end',
            gap: 24,
            display: 'inline-flex',
            fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
            fontSize: 20,
            lineHeight: '24px',
            color: '#F5F5F5',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              justifyContent: 'flex-end',
              display: 'flex',
              flexDirection: 'column',
              whiteSpace: 'pre',
              letterSpacing: '-0.8px',
            }}
          >
            {`UP / DOWN  [ARROW]`}
          </div>
          <div
            style={{
              width: 140,
              textAlign: 'center',
              justifyContent: 'flex-end',
              display: 'flex',
              flexDirection: 'column',
              whiteSpace: 'pre',
              letterSpacing: '-0.8px',
            }}
          >
            {`SKIP  [SPACE]`}
          </div>
          <div
            style={{
              width: 140,
              textAlign: 'center',
              justifyContent: 'flex-end',
              display: 'flex',
              flexDirection: 'column',
              whiteSpace: 'pre',
              letterSpacing: '-0.8px',
            }}
          >
            {`NEXT  [ENTER]`}
          </div>
        </div>
      </div>

      {/* Right pane - mask stage or point cloud stage */}
      <div
        style={{ flex: '1 1 0', alignSelf: 'stretch', position: 'relative', background: 'black' }}
      >
        {sceneId ? (
          <div style={{ position: 'absolute', inset: 0 }}>
            {/* Render point cloud for requested scene */}
            <PointCloudStage
              sceneId={sceneId}
              zScale={2.2}
              pointSize={2.2}
              stride={1}
              perspective={true}
            />
          </div>
        ) : (
          current && (
            <div style={{ position: 'absolute', inset: 0 }}>
              <MaskStage model={current.model || '/models/mask-placeholder.glb'} opacity={1} />
            </div>
          )
        )}
      </div>
    </main>
  )
}
