export interface HUDProps {
  ready: boolean;
  loadMs: number;
  inferMs: number;
  fps: number;
  instances: number;
}

export default function HUD({ ready, loadMs, inferMs, fps, instances }: HUDProps) {
  return (
    <div>
      <div>ready: {String(ready)}</div>
      <div>load: {loadMs}ms</div>
      <div>infer: {inferMs}ms</div>
      <div>fps: {fps}</div>
      <div>instances: {instances}</div>
    </div>
  );
}
