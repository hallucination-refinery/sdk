'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useRefineryStore } from '@refinery/store'

function AnalysisBar({ value }: { value: number }) {
  return (
    <div style={{ position: 'absolute', top: 12, left: 12, right: 12, height: 8, background: '#0b1630', borderRadius: 4 }}>
      <div style={{ width: `${value}%`, height: '100%', background: '#2bc7ff', borderRadius: 4 }} />
    </div>
  )
}

export default function QuizPage() {
  const router = useRouter()
  const params = useParams<{ slug: string }>()
  const state = useRefineryStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch('/packs/archetype-01.json')
        const pack = await res.json()
        state.loadPack(pack)
      } finally {
        setLoading(false)
        console.log('[Quiz] start')
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const questions = state.activePack?.questions || []
  const analysis = state.analysis
  const answeredIds = useMemo(() => new Set(Object.keys(state.responses)), [state.responses])

  useEffect(() => {
    if (analysis === 100) {
      const top = state.computeResult().payload.top
      const rid = encodeURIComponent(top.map(t => `${t.key}:${t.score.toFixed(2)}`).join(','))
      console.log('[Quiz] complete')
      router.push(`/result/${rid}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysis])

  if (loading) return <div style={{ padding: 24, color: '#9ab' }}>Loading…</div>

  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh', background: '#010c2a', color: '#cfe8ff', fontFamily: 'system-ui,sans-serif' }}>
      <AnalysisBar value={analysis} />
      <div style={{ paddingTop: 40, maxWidth: 880, margin: '0 auto' }}>
        {questions.map((q) => (
          <div key={q.id} style={{ margin: '16px 0', opacity: answeredIds.has(q.id) ? 0.6 : 1 }}>
            <div style={{ marginBottom: 8 }}>{q.prompt}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
              {q.options.map((o) => (
                <button
                  key={o.id}
                  onClick={() => state.answer(q.id, o.id)}
                  style={{
                    textAlign: 'left', padding: 12, borderRadius: 8, border: '1px solid #2a3550', background: '#0b1630', color: '#cfe8ff'
                  }}
                >
                  {o.image ? <img src={o.image} alt="" style={{ width: '100%', borderRadius: 6, marginBottom: 8 }} /> : null}
                  <div>{o.label || 'Choose'}</div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}


