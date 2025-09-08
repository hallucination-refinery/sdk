export interface HUDProps {
  ready: boolean
  loadMs: number
  inferMs: number
  fps: number
  instances: number
  onClassify?(): void
  onClear?(): void
  onUndo?(): void
  autoEnabled?: boolean
  onToggleAuto?(next: boolean): void
  busy?: boolean
}

export default function HUD({
  ready,
  loadMs,
  inferMs,
  fps,
  instances,
  onClassify,
  onClear,
  onUndo,
  autoEnabled,
  onToggleAuto,
  busy,
}: HUDProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 8,
        left: 8,
        color: '#0f0',
        background: 'rgba(0,0,0,0.5)',
        padding: 8,
        font: '12px/1.2 monospace',
        borderRadius: 4,
        zIndex: 2,
      }}
    >
      <div>ready: {String(ready)}</div>
      <div>load: {loadMs}ms</div>
      <div>infer: {inferMs}ms</div>
      <div>fps: {fps}</div>
      <div>instances: {instances}</div>
      <div style={{ marginTop: 4 }}>
        <button
          style={{ marginRight: 4, fontSize: 10 }}
          onClick={onClassify}
          disabled={!onClassify || !!busy}
        >
          Classify
        </button>
        <button
          style={{ marginRight: 4, fontSize: 10 }}
          onClick={onClear}
          disabled={!onClear || !!busy}
        >
          Clear
        </button>
        <button
          style={{ marginRight: 4, fontSize: 10 }}
          onClick={onUndo}
          disabled={!onUndo || !!busy}
        >
          Undo
        </button>
        <button
          style={{ marginRight: 4, fontSize: 10 }}
          onClick={() => onToggleAuto?.(!autoEnabled)}
          disabled={!onToggleAuto || !!busy}
        >
          Auto {autoEnabled ? 'On' : 'Off'}
        </button>
        {busy && <span style={{ marginLeft: 4 }}>inference…</span>}
      </div>
    </div>
  )
}
