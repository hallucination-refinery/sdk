import type { WebGLRenderer } from 'three'
// @ts-expect-error raw shader import
import initSource from './init.glsl?raw'
// @ts-expect-error raw shader import
import updateSource from './update.glsl?raw'

const QUAD = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
const VERT = `#version 300 es
in vec2 position;
void main(){gl_Position=vec4(position,0.0,1.0);}
`

type Vec3 = [number, number, number]
type SimOptions = { count: number; seed: number; floorY: number; gravity: Vec3; damping: number; texSize?: { width: number; height: number } }

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)
  if (!sh) throw new Error('shader alloc failed')
  gl.shaderSource(sh, src); gl.compileShader(sh)
  if (gl.getShaderParameter(sh, gl.COMPILE_STATUS)) return sh
  const info = gl.getShaderInfoLog(sh) ?? 'compile error'
  gl.deleteShader(sh); throw new Error(info)
}

function link(gl: WebGL2RenderingContext, frag: string) {
  const vs = compile(gl, gl.VERTEX_SHADER, VERT)
  const fs = compile(gl, gl.FRAGMENT_SHADER, frag)
  const program = gl.createProgram()
  if (!program) throw new Error('program alloc failed')
  gl.attachShader(program, vs); gl.attachShader(program, fs)
  gl.bindAttribLocation(program, 0, 'position'); gl.linkProgram(program)
  gl.deleteShader(vs); gl.deleteShader(fs)
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program
  const info = gl.getProgramInfoLog(program) ?? 'link error'
  gl.deleteProgram(program); throw new Error(info)
}

function floatTex(gl: WebGL2RenderingContext, w: number, h: number, data?: Float32Array) {
  const tex = gl.createTexture()
  if (!tex) throw new Error('texture alloc failed')
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  for (const wrap of [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T]) gl.texParameteri(gl.TEXTURE_2D, wrap, gl.CLAMP_TO_EDGE)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, w, h, 0, gl.RGBA, gl.FLOAT, data ?? null)
  gl.bindTexture(gl.TEXTURE_2D, null)
  return tex
}

export class ParticleSim {
  private readonly gl: WebGL2RenderingContext; private readonly vao: WebGLVertexArrayObject; private readonly vbo: WebGLBuffer
  private readonly initProgram: WebGLProgram; private readonly updateProgram: WebGLProgram; private readonly u: Record<string, WebGLUniformLocation | null>
  private readonly scene: WebGLTexture
  private pos: WebGLTexture[] = []; private vel: WebGLTexture[] = []; private color: WebGLTexture | null = null
  private fbos: WebGLFramebuffer[] = []; private initFbo: WebGLFramebuffer | null = null
  private width = 0; private height = 0; private boundsMin: Vec3 = [-1, 0, -1]; private boundsMax: Vec3 = [1, 1, 1]
  private gravity: Vec3 = [0, -1, 0]; private floorY = 0; private damping = 0; private count = 0
  private current = 0; private time = 0; private ready = false

  constructor(renderer: WebGLRenderer) {
    const raw = renderer.getContext()
    if (!(raw instanceof WebGL2RenderingContext)) throw new Error('ParticleSim requires WebGL2')
    this.gl = raw
    this.initProgram = link(raw, initSource as string); this.updateProgram = link(raw, updateSource as string)
    this.u = {
      iSeed: raw.getUniformLocation(this.initProgram, 'uSeed'),
      iSize: raw.getUniformLocation(this.initProgram, 'uTexSize'),
      iCount: raw.getUniformLocation(this.initProgram, 'uCount'),
      iScene: raw.getUniformLocation(this.initProgram, 'uSceneColor'),
      uSize: raw.getUniformLocation(this.updateProgram, 'uTexSize'),
      uCount: raw.getUniformLocation(this.updateProgram, 'uCount'),
      uDt: raw.getUniformLocation(this.updateProgram, 'uDt'),
      uDamp: raw.getUniformLocation(this.updateProgram, 'uDamping'),
      uGrav: raw.getUniformLocation(this.updateProgram, 'uGravity'),
      uFloor: raw.getUniformLocation(this.updateProgram, 'uFloorY'),
      uMin: raw.getUniformLocation(this.updateProgram, 'uBoundsMin'),
      uMax: raw.getUniformLocation(this.updateProgram, 'uBoundsMax'),
      uTime: raw.getUniformLocation(this.updateProgram, 'uTimeLow'),
      uPos: raw.getUniformLocation(this.updateProgram, 'uPrevPos'),
      uVel: raw.getUniformLocation(this.updateProgram, 'uPrevVel'),
    }
    this.scene = floatTex(raw, 1, 1, new Float32Array([0.85, 0.88, 1, 1]))
    const vao = raw.createVertexArray(); const vbo = raw.createBuffer()
    if (!vao || !vbo) throw new Error('buffer alloc failed')
    this.vao = vao; this.vbo = vbo
    raw.bindVertexArray(vao); raw.bindBuffer(raw.ARRAY_BUFFER, vbo)
    raw.bufferData(raw.ARRAY_BUFFER, QUAD, raw.STATIC_DRAW)
    raw.enableVertexAttribArray(0); raw.vertexAttribPointer(0, 2, raw.FLOAT, false, 0, 0)
    raw.bindVertexArray(null); raw.bindBuffer(raw.ARRAY_BUFFER, null)
  }

  private release() {
    if (!this.ready) return
    const gl = this.gl
    for (const fb of this.fbos) gl.deleteFramebuffer(fb)
    if (this.initFbo) gl.deleteFramebuffer(this.initFbo)
    for (const tex of [...this.pos, ...this.vel]) gl.deleteTexture(tex)
    if (this.color) gl.deleteTexture(this.color)
    this.fbos = []; this.pos = []; this.vel = []; this.color = null; this.ready = false
  }

  createSim(opts: SimOptions) {
    const { count, seed, floorY, gravity, damping, texSize } = opts
    const w = texSize?.width ?? Math.ceil(Math.sqrt(count)); const h = texSize?.height ?? Math.ceil(count / w)
    if (w * h < count) throw new Error('texSize too small for particle count')
    this.release()
    const gl = this.gl
    Object.assign(this, { width: w, height: h, count, damping, gravity, floorY, boundsMin: [-1, floorY, -1] as Vec3, boundsMax: [1, floorY + 2, 1] as Vec3, time: 0, current: 0 })
    this.pos = [floatTex(gl, w, h), floatTex(gl, w, h)]; this.vel = [floatTex(gl, w, h), floatTex(gl, w, h)]
    this.color = floatTex(gl, w, h)
    this.fbos = [gl.createFramebuffer()!, gl.createFramebuffer()!]; this.initFbo = gl.createFramebuffer()!
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.initFbo)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.pos[0], 0)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, this.vel[0], 0)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT2, gl.TEXTURE_2D, this.color, 0)
    for (let i = 0; i < 2; i += 1) {
      const fb = this.fbos[i]
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.pos[i], 0)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, this.vel[i], 0)
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    this.runInit(seed)
    this.ready = true
    console.log(`[sim] init { texSize: ${w}x${h}, count: ${count} }`)
  }

  private runInit(seed: number) {
    const gl = this.gl
    const prevFb = gl.getParameter(gl.FRAMEBUFFER_BINDING) as WebGLFramebuffer | null, vp = gl.getParameter(gl.VIEWPORT) as Int32Array
    gl.bindVertexArray(this.vao); gl.useProgram(this.initProgram)
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.initFbo)
    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1, gl.COLOR_ATTACHMENT2])
    gl.viewport(0, 0, this.width, this.height)
    gl.uniform1f(this.u.iSeed, seed); gl.uniform2f(this.u.iSize, this.width, this.height); gl.uniform1f(this.u.iCount, this.count)
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.scene); gl.uniform1i(this.u.iScene, 0)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.initFbo); gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.fbos[1])
    gl.readBuffer(gl.COLOR_ATTACHMENT0); gl.blitFramebuffer(0, 0, this.width, this.height, 0, 0, this.width, this.height, gl.COLOR_BUFFER_BIT, gl.NEAREST)
    gl.readBuffer(gl.COLOR_ATTACHMENT1); gl.blitFramebuffer(0, 0, this.width, this.height, 0, 0, this.width, this.height, gl.COLOR_BUFFER_BIT, gl.NEAREST)
    gl.bindFramebuffer(gl.FRAMEBUFFER, prevFb)
    gl.viewport(vp[0], vp[1], vp[2], vp[3]); gl.bindVertexArray(null)
  }

  update(dt: number) {
    if (!this.ready || dt <= 0) return
    const gl = this.gl
    const prevFb = gl.getParameter(gl.FRAMEBUFFER_BINDING) as WebGLFramebuffer | null, vp = gl.getParameter(gl.VIEWPORT) as Int32Array
    const src = this.current; const dst = 1 - src; this.time += dt
    gl.bindVertexArray(this.vao); gl.useProgram(this.updateProgram)
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbos[dst])
    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1])
    gl.viewport(0, 0, this.width, this.height)
    gl.uniform2f(this.u.uSize, this.width, this.height); gl.uniform1f(this.u.uCount, this.count); gl.uniform1f(this.u.uDt, dt)
    gl.uniform1f(this.u.uDamp, this.damping); gl.uniform3f(this.u.uGrav, this.gravity[0], this.gravity[1], this.gravity[2])
    gl.uniform1f(this.u.uFloor, this.floorY); gl.uniform3f(this.u.uMin, this.boundsMin[0], this.boundsMin[1], this.boundsMin[2])
    gl.uniform3f(this.u.uMax, this.boundsMax[0], this.boundsMax[1], this.boundsMax[2]); gl.uniform1f(this.u.uTime, this.time * 0.1)
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.pos[src]); gl.uniform1i(this.u.uPos, 0)
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.vel[src]); gl.uniform1i(this.u.uVel, 1)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    gl.bindFramebuffer(gl.FRAMEBUFFER, prevFb)
    gl.viewport(vp[0], vp[1], vp[2], vp[3]); gl.bindVertexArray(null)
    this.current = dst
  }

  getPositionTexture() {
    return this.ready ? this.pos[this.current] : null
  }

  getColorTexture() {
    return this.color
  }
}
