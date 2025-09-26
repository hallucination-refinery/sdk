'use client'

import type { InkTelemetrySnapshot, SimTelemetrySnapshot } from '../debug/useDebugControls'

type Severity = 'ok' | 'warn' | 'error'

type Props = {
  simEnabled: boolean
  simSnapshot: SimTelemetrySnapshot | null
  inkEnabled: boolean
  inkSnapshot: InkTelemetrySnapshot | null
}

const COLORS: Record<Severity, string> = { ok: '#2fdf84', warn: '#fbbf24', error: '#ff6b6b' }
const format = (value: number) => (Number.isFinite(value) ? value.toFixed(4) : '—')
const simSeverity = (snapshot: SimTelemetrySnapshot | null): Severity =>
  !snapshot ? 'warn' : snapshot.nanCount > 0 || snapshot.infCount > 0 ? 'error' : snapshot.avg <= 0 ? 'warn' : 'ok'
const inkSeverity = (snapshot: InkTelemetrySnapshot | null): Severity =>
  !snapshot ? 'warn' : snapshot.reveal <= 0.05 ? 'error' : snapshot.alpha <= 0.1 ? 'warn' : 'ok'

export default function DebugHud({ simEnabled, simSnapshot, inkEnabled, inkSnapshot }: Props) {
  if (process.env.NODE_ENV === 'production' || (!simEnabled && !inkEnabled)) return null
  return (
    <div
      style={{
        marginTop: 12,
        paddingTop: 12,
        borderTop: '1px solid rgba(255,255,255,0.15)',
        display: 'grid',
        rowGap: 10,
      }}
    >
      {simEnabled && (
        <section>
          <header style={{ fontWeight: 600, marginBottom: 4, color: COLORS[simSeverity(simSnapshot)] }}>
            Sim telemetry
          </header>
          <div style={{ fontSize: 11, lineHeight: 1.4 }}>
            {simSnapshot ? (
              <>
                <div>avg: {format(simSnapshot.avg)}</div>
                <div>min/max: {format(simSnapshot.min)} / {format(simSnapshot.max)}</div>
                <div>nan/inf: {simSnapshot.nanCount} / {simSnapshot.infCount}</div>
                <div>
                  tex: {simSnapshot.texSize[0]} × {simSnapshot.texSize[1]} · grid {simSnapshot.grid}
                </div>
              </>
            ) : (
              <div style={{ opacity: 0.7 }}>Waiting for samples…</div>
            )}
          </div>
        </section>
      )}
      {inkEnabled && (
        <section>
          <header style={{ fontWeight: 600, marginBottom: 4, color: COLORS[inkSeverity(inkSnapshot)] }}>
            Ink telemetry
          </header>
          <div style={{ fontSize: 11, lineHeight: 1.4 }}>
            {inkSnapshot ? (
              <>
                <div>size: {format(inkSnapshot.size)}</div>
                <div>alpha: {format(inkSnapshot.alpha)}</div>
                <div>reveal: {format(inkSnapshot.reveal)}</div>
              </>
            ) : (
              <div style={{ opacity: 0.7 }}>Waiting for samples…</div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
