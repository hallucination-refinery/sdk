export type DoodleCanvasHandle = {
  clear(): void
  undo(): void
  toCanvas(): HTMLCanvasElement | null
  getInkMetrics(): { area: number; length: number; bbox: { width: number; height: number } }
}
