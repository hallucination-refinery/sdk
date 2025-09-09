export interface InkBBox {
  width: number
  height: number
}

export interface InkMetrics {
  area: number
  length: number
  bbox: InkBBox
}

export type DoodleCanvasHandle = {
  clear(): void
  undo(): void
  toCanvas(): HTMLCanvasElement | null
  getInkMetrics(): InkMetrics
}
