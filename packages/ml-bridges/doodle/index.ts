// Type definitions for DoodleNet classifier bridge
export type DoodlePrediction = {
  label: string
  confidence: number
}

export interface DoodleClassifier {
  classify(input: HTMLCanvasElement, k?: number): Promise<DoodlePrediction[]>
}

