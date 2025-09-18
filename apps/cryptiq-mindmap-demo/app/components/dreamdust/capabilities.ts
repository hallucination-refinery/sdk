export type DreamdustCaps = {
  aliasedPointSizeRange: Float32Array
  maxVertexAttribs: number
  maxTextureSize: number
  maxVertexTextureImageUnits: number
}

type GLContext = WebGLRenderingContext | WebGL2RenderingContext

export type DreamdustRuntimeCaps = {
  vertexInkOk: boolean
  floatOk: boolean
  aliasedPointSizeRange: Float32Array
  dpr: number
}

const DEFAULT_POINT_SIZE_RANGE: readonly [number, number] = [1, 1]

function safeGetParameter<T>(
  gl: GLContext,
  parameter: number,
  fallback: () => T,
): T {
  try {
    const value = gl.getParameter(parameter) as T | null | undefined
    if (value !== null && value !== undefined) {
      return value
    }
  } catch {
    // Ignore errors and use the fallback value below.
  }
  return fallback()
}

export function detectVertexTextureSupport(gl: GLContext): boolean {
  const units = safeGetParameter<number>(gl, gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS, () => 0)
  return units > 0
}

function detectFloatTextureSupport(gl: GLContext): boolean {
  if (typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext) {
    return true
  }

  if (typeof gl.getExtension !== 'function') {
    return false
  }

  const extensionNames: readonly string[] = [
    'OES_texture_float',
    'OES_texture_float_linear',
    'WEBGL_color_buffer_float',
    'EXT_color_buffer_float',
    'OES_texture_half_float',
    'OES_texture_half_float_linear',
    'EXT_color_buffer_half_float',
  ]

  for (const name of extensionNames) {
    try {
      if (gl.getExtension(name)) {
        return true
      }
    } catch {
      // Ignore extension query errors and continue.
    }
  }

  return false
}

export function readCaps(gl: GLContext): DreamdustCaps {
  const aliasedPointSizeRange = safeGetParameter<Float32Array>(
    gl,
    gl.ALIASED_POINT_SIZE_RANGE,
    () => new Float32Array([1, 1]),
  )
  const maxVertexAttribs = safeGetParameter<number>(gl, gl.MAX_VERTEX_ATTRIBS, () => 0)
  const maxTextureSize = safeGetParameter<number>(gl, gl.MAX_TEXTURE_SIZE, () => 0)
  const maxVertexTextureImageUnits = safeGetParameter<number>(
    gl,
    gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS,
    () => 0,
  )

  return {
    aliasedPointSizeRange,
    maxVertexAttribs,
    maxTextureSize,
    maxVertexTextureImageUnits,
  }
}

function createFallbackRuntimeCaps(dpr: number): DreamdustRuntimeCaps {
  return {
    vertexInkOk: false,
    floatOk: false,
    aliasedPointSizeRange: new Float32Array(DEFAULT_POINT_SIZE_RANGE),
    dpr,
  }
}

export function getDreamdustCaps(
  canvas: HTMLCanvasElement | null | undefined,
): DreamdustRuntimeCaps {
  const rawDpr =
    typeof window !== 'undefined' && typeof window.devicePixelRatio === 'number'
      ? window.devicePixelRatio
      : 1
  const dpr = Number.isFinite(rawDpr) && rawDpr > 0 ? rawDpr : 1

  if (!canvas || typeof canvas.getContext !== 'function') {
    return createFallbackRuntimeCaps(dpr)
  }

  let gl: GLContext | null = null

  try {
    gl =
      (canvas.getContext('webgl2') as WebGL2RenderingContext | null) ??
      (canvas.getContext('webgl') as WebGLRenderingContext | null)
  } catch {
    gl = null
  }

  if (!gl) {
    return createFallbackRuntimeCaps(dpr)
  }

  const { aliasedPointSizeRange } = readCaps(gl)
  const vertexInkOk = detectVertexTextureSupport(gl)
  const floatOk = detectFloatTextureSupport(gl)

  return {
    vertexInkOk,
    floatOk,
    aliasedPointSizeRange,
    dpr,
  }
}
