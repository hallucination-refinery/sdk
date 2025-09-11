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

export interface Draw3DResult {
  label: string
  confidence: number
  topK: Array<{ label: string; confidence: number }>
  formation: Float32Array
  fitScale: number
  counts: { cloud: number; target: number }
  timings: { pre: number; load: number; infer: number }
}
