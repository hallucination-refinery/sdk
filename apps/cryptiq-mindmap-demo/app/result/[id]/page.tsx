'use client'

import { useMemo } from 'react'
import { useParams } from 'next/navigation'

function ResultComposite({ top }: { top: { key: string; score: number }[] }) {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {top.map((t) => (
        <div key={t.key} style={{ padding: 12, borderRadius: 8, border: '1px solid #2a3550', background: '#0b1630', color: '#cfe8ff' }}>
          <div style={{ fontWeight: 600 }}>{t.key}</div>
          <div style={{ opacity: 0.8 }}>{Math.round(t.score * 100)}%</div>
        </div>
      ))}
    </div>
  )
}

function ShareButtons() {
  const share = async () => {
    try {
      await navigator.share?.({ title: 'Cryptiq Mindmap', text: 'My composite archetypes', url: location.href })
    } catch {}
  }
  return (
    <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
      <button onClick={share} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #2bc7ff', background: '#0a1a30', color: '#2bc7ff' }}>Share</button>
      <a href={location.href} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #334', background: '#0b1222', color: '#9ab' }}>Copy Link</a>
    </div>
  )
}

export default function ResultPage() {
  const params = useParams<{ id: string }>()
  const top = useMemo(() => {
    const raw = decodeURIComponent(params.id || '')
    const parts = raw ? raw.split(',') : []
    return parts.map(p => {
      const [key, s] = p.split(':')
      return { key, score: parseFloat(s) || 0 }
    })
  }, [params.id])

  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh', background: '#010c2a', color: '#cfe8ff', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ padding: 24, maxWidth: 880, margin: '0 auto' }}>
        <h1 style={{ margin: '0 0 12px 0', fontSize: 24 }}>Your Composite Archetypes</h1>
        <ResultComposite top={top} />
        <ShareButtons />
      </div>
    </main>
  )
}


