export interface HUDProps {
  ready: boolean
  loadMs: number
  inferMs: number
  fps: number
  instances: number
}

export default function HUD({ ready, loadMs, inferMs, fps, instances }: HUDProps) {
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
    </div>
  )
}
