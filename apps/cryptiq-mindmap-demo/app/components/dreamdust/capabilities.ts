export type DreamdustCaps = {
  aliasedPointSizeRange: Float32Array
  maxVertexAttribs: number
  maxTextureSize: number
  maxVertexTextureImageUnits: number
}

type GLContext = WebGLRenderingContext | WebGL2RenderingContext

function safeGetParameter<T>(gl: GLContext, parameter: number, fallback: T): T {
  try {
    const value = gl.getParameter(parameter) as T | null | undefined
    if (value !== null && value !== undefined) {
      return value
    }
  } catch {
    // Ignore errors and use the fallback value below.
  }
  return fallback
}

export function detectVertexTextureSupport(gl: GLContext): boolean {
  const units = safeGetParameter<number>(gl, gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS, 0)
  return units > 0
}

export function readCaps(gl: GLContext): DreamdustCaps {
  const aliasedPointSizeRange = safeGetParameter<Float32Array>(
    gl,
    gl.ALIASED_POINT_SIZE_RANGE,
    new Float32Array([1, 1]),
  )
  const maxVertexAttribs = safeGetParameter<number>(gl, gl.MAX_VERTEX_ATTRIBS, 0)
  const maxTextureSize = safeGetParameter<number>(gl, gl.MAX_TEXTURE_SIZE, 0)
  const maxVertexTextureImageUnits = safeGetParameter<number>(
    gl,
    gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS,
    0,
  )

  return {
    aliasedPointSizeRange,
    maxVertexAttribs,
    maxTextureSize,
    maxVertexTextureImageUnits,
  }
}
