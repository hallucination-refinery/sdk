export type DoodlePrediction = {
  label: string
  confidence: number
}

export type DoodleClassifier = {
  classify(input: HTMLCanvasElement, k?: number): Promise<DoodlePrediction[]>
}

let doodlePromise: Promise<DoodleClassifier> | null = null
let ml5Promise: Promise<any> | null = null

function loadMl5(): Promise<any> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('ml5 requires a browser environment'))
  }
  if (ml5Promise) return ml5Promise
  ml5Promise = new Promise((resolve, reject) => {
    if ((window as any).ml5) {
      resolve((window as any).ml5)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/ml5@0.12.2/dist/ml5.min.js'
    script.async = true
    script.onload = () => resolve((window as any).ml5)
    script.onerror = () => reject(new Error('Failed to load ml5'))
    document.head.appendChild(script)
  })
  return ml5Promise
}

export async function loadDoodleNet(): Promise<DoodleClassifier> {
  if (!doodlePromise) {
    doodlePromise = loadMl5().then((ml5) => {
      const originalWarn = console.warn
      console.warn = (msg?: any, ...rest: any[]) => {
        if (
          typeof msg === 'string' &&
          msg.includes('The shape of the input tensor') &&
          msg.includes('conv2d_1')
        ) {
          return
        }
        originalWarn(msg, ...rest)
      }
      return ml5.imageClassifier('DoodleNet').finally(() => {
        console.warn = originalWarn
      })
    })
  }
  return doodlePromise
}

export async function classify(canvas: HTMLCanvasElement, k = 5) {
  const classifier = await loadDoodleNet()
  return classifier.classify(canvas, k)
}
