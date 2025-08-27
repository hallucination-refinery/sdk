'use client'

import { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

// IntroParticles removed (unused)

function LeftPanel() {
  return (
    <div
      style={{
        alignSelf: 'stretch',
        width: 581,
        paddingTop: 69,
        paddingLeft: 24,
        paddingRight: 24,
        background: '#00041A',
        overflow: 'hidden',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 36,
        display: 'inline-flex',
      }}
    >
      {/* Title section */}
      <div
        style={{
          paddingTop: 24,
          paddingBottom: 24,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: 8,
          display: 'flex',
        }}
      >
        {/* Branding */}
        <div
          style={{
            alignSelf: 'stretch',
            paddingLeft: 4,
            paddingRight: 4,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            display: 'flex',
          }}
        >
          <div
            style={{
              alignSelf: 'stretch',
              textAlign: 'center',
              justifyContent: 'flex-start',
              display: 'flex',
              flexDirection: 'column',
              color: '#F5F5F5',
              fontSize: 24,
              fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
              fontWeight: '600',
              lineHeight: '28.8px',
              letterSpacing: 0.24,
              wordWrap: 'break-word',
            }}
          >
            CRYPTIQ x REFINERY (SDK) PRESENT
          </div>
        </div>
        {/* Title */}
        <div
          style={{
            alignSelf: 'stretch',
            textAlign: 'left',
            justifyContent: 'flex-start',
            display: 'flex',
            flexDirection: 'column',
            color: 'white',
            fontSize: 150,
            fontFamily: 'var(--font-display), Anton, sans-serif',
            fontWeight: '400',
            lineHeight: '135px',
            letterSpacing: -3,
            wordWrap: 'break-word',
          }}
        >
          MINDMAP
        </div>
      </div>
      {/* Release notes */}
      <div
        style={{
          alignSelf: 'stretch',
          height: 182,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          border: '1px solid #F5F5F5',
          borderRadius: 2,
          paddingTop: 18,
          paddingBottom: 12,
          paddingLeft: 16,
          paddingRight: 16,
          color: '#F5F5F5',
          fontSize: 14,
          fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
          fontWeight: '400',
          lineHeight: '1.1',
          background: 'transparent',
        }}
      >
        {/* Label tab overlapping the top border */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: -9,
            left: 12,
            background: '#00041A',
            paddingLeft: 8,
            paddingRight: 8,
            lineHeight: '1',
            color: '#F5F5F5',
            fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
            fontSize: 14,
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontWeight: 600, color: '#FAFAFA' }}>RELEASE NOTES</span>
          <span>{' — Cryptiq Mindmap v1.0.0 — 2025-08-30'}</span>
        </div>
        {/* Body */}
        <pre
          style={{
            margin: 0,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            letterSpacing: '-0.42px',
          }}
        >
          {`Archival backup of concept pack and UI assets. No executables
or user PII included.
Modified files (timestamps may differ):
 • packs/archetype-v1.json
 • public/models/brain-anchors-500.json
 • public/assets/maskpack-v1/*.png
Quick notes: 8 timed Rorschach masks; ~400 pre-seeded concepts;
hover-only neighbor edges; results saved as short signed IDs
(30d TTL).`}
        </pre>
      </div>
      {/* Prompt (plain text, not a button) */}
      <div
        style={{
          alignSelf: 'stretch',
          height: 87,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          columnGap: 8,
          fontSize: 20,
          fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
          fontWeight: '500',
          lineHeight: '22px',
          userSelect: 'none',
        }}
        aria-hidden
      >
        <span style={{ color: '#FAFAFA' }}>PRESS</span>
        <span style={{ color: 'white' }}>[SPACE]</span>
        <span style={{ color: '#FAFAFA' }}>TO BEGIN</span>
      </div>
    </div>
  )
}

export default function Home() {
  const [preloading, setPreloading] = useState(true)
  useEffect(() => {
    // telemetry stub
    console.log('[Landing] viewed')
    const t = setTimeout(() => setPreloading(false), 2200)
    return () => clearTimeout(t)
  }, [])
  const BackgroundBrain = useMemo(
    () => dynamic(() => import('./components/BackgroundBrain'), { ssr: false }),
    []
  )
  const router = useRouter()
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !preloading) {
        e.preventDefault()
        router.push('/quiz/archetype-v1')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [preloading, router])
  return (
    <main
      style={{
        width: '100%',
        height: '100%',
        background: 'black',
        overflow: 'hidden',
        justifyContent: 'flex-end',
        alignItems: 'center',
        display: 'inline-flex',
      }}
    >
      {/* Left panel - content-based width */}
      {!preloading && <LeftPanel />}
      {/* Right pane - brain fills remaining space */}
      <div
        style={{
          flex: '1 1 0',
          alignSelf: 'stretch',
          position: 'relative',
          background: 'black',
        }}
      >
        <BackgroundBrain />
      </div>
      {/* Preloader overlay (2.2s stub) */}
      {preloading && (
        <div
          aria-hidden
          style={{ position: 'absolute', inset: 0, background: '#00041A', zIndex: 20 }}
        />
      )}
    </main>
  )
}
