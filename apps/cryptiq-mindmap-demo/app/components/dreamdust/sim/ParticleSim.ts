import * as THREE from 'three'
import type { WebGLRenderer } from 'three'

const QUAD = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
const VERT = `#version 300 es
in vec2 position;
void main(){gl_Position=vec4(position,0.0,1.0);}
`

const INIT_SHADER = /* glsl */ String.raw`#version 300 es
precision highp float;
uniform float uSeed,uCount; uniform vec2 uTexSize; uniform sampler2D uSpawnPos; uniform sampler2D uSpawnColor; uniform float uSpawnHasColor; uniform float uSpawnMode;
layout(location=0) out vec4 oPos; layout(location=1) out vec4 oVel; layout(location=2) out vec4 oColor;
float hash(float h){return fract(sin(h)*43758.5453123);} vec3 rand3(float h){return vec3(hash(h),hash(h+1.7),hash(h+3.4));}
vec4 fallbackColor(){return vec4(0.85,0.88,1.0,1.0);}
void main(){
  vec2 coord=gl_FragCoord.xy-0.5; float id=coord.y*uTexSize.x+coord.x;
  if(id>=uCount){oPos=oVel=oColor=vec4(0.0);return;}
  vec2 uv=(coord+0.5)/uTexSize;
  vec4 posSample=texture(uSpawnPos,uv);
  float a=hash(id+uSeed)*6.28318; float r=sqrt(hash(id+uSeed+0.5))*0.5; vec2 disk=vec2(cos(a),sin(a))*r;
  vec3 vel=normalize(vec3(disk.x,0.2,disk.y)+vec3(0.0,0.5,0.0))*mix(0.1,0.35,hash(id+uSeed+2.3));
  vel+=(rand3(id+uSeed+9.9)-0.5)*0.03;
  if(uSpawnMode>0.5){
    float depth01=clamp(posSample.w,0.0,1.0);
    vec4 color= fallbackColor();
    if(uSpawnHasColor>0.5){color=texture(uSpawnColor,uv); color.a=1.0;}
    oPos=vec4(posSample.xyz,depth01);
    oVel=vec4(vel,0.0);
    oColor=color;
  }else{
    vec3 pos=vec3(disk.x,hash(id+uSeed+1.1)*0.12,disk.y);
    oPos=vec4(pos,1.0);
    oVel=vec4(vel,0.0);
    oColor=fallbackColor();
  }
}`

const UPDATE_SHADER = /* glsl */ String.raw`#version 300 es
precision highp float;
uniform sampler2D uPrevPos,uPrevVel; uniform vec2 uTexSize; uniform float uCount,uDt,uDamping,uFloorY,uTimeLow; uniform vec3 uGravity,uBoundsMin,uBoundsMax;
layout(location=0) out vec4 oPos; layout(location=1) out vec4 oVel;
float hash(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453);} vec3 curl(vec3 p,float t){vec3 a=vec3(hash(p+vec3(t,0.0,4.0)),hash(p+vec3(2.0,t,1.0)),hash(p+vec3(5.0,3.0,t)));vec3 b=vec3(hash(p+vec3(1.3,2.7,t+3.1)),hash(p+vec3(t+4.2,1.9,2.5)),hash(p+vec3(3.7,t+2.2,5.4)));return vec3(a.y-b.z,a.z-b.x,a.x-b.y);}
void main(){ vec2 coord=gl_FragCoord.xy-0.5; float id=coord.y*uTexSize.x+coord.x; if(id>=uCount){oPos=oVel=vec4(0.0);return;}
  vec2 uv=(coord+0.5)/uTexSize; vec3 pos=texture(uPrevPos,uv).xyz; vec3 vel=texture(uPrevVel,uv).xyz;
  vec3 force=uGravity+curl(pos,uTimeLow); vel=vel*(1.0-uDamping)+force*uDt; pos+=vel*uDt;
  if(pos.y<uFloorY){pos.y=uFloorY; if(vel.y<0.0) vel.y=-vel.y*(1.0-uDamping);} pos=clamp(pos,uBoundsMin,uBoundsMax);
  oPos=vec4(pos,1.0); oVel=vec4(vel,0.0); }`

type Vec3 = [number, number, number]
type SimOptions = {
  count: number
  seed: number
  floorY?: number
  gravity: Vec3
  damping: number
  texSize?: { width: number; height: number }
}

type SpawnPayload = {
  positions: Float32Array
  depths: Float32Array
  colors?: ArrayLike<number> | null
}

type TexturePackage = {
  texture: THREE.DataTexture
  handle: WebGLTexture
}

function initDataTexture(renderer: WebGLRenderer, texture: THREE.DataTexture) {
  const internal = renderer as unknown as {
    initTexture?: (tex: THREE.Texture) => void
    properties?: { get: (tex: THREE.Texture) => Record<string, unknown> }
  }
  texture.needsUpdate = true
  texture.generateMipmaps = false
  ;(texture as unknown as { flipY?: boolean }).flipY = false
  texture.magFilter = (THREE as any).NearestFilter
  texture.minFilter = (THREE as any).NearestFilter
  texture.wrapS = (THREE as any).ClampToEdgeWrapping
  texture.wrapT = (THREE as any).ClampToEdgeWrapping
  internal.initTexture?.(texture)
  const props = internal.properties?.get(texture) as { __webglTexture?: WebGLTexture } | undefined
  if (!props || !(props.__webglTexture instanceof WebGLTexture)) {
    throw new Error('texture init failed')
  }
  return props.__webglTexture
}

function floatTexture(renderer: WebGLRenderer, w: number, h: number, data?: Float32Array): TexturePackage {
  const tex = new (THREE as any).DataTexture(
    data ?? new Float32Array(Math.max(1, w * h * 4)),
    w,
    h,
    (THREE as any).RGBAFormat,
    (THREE as any).FloatType,
  )
  const handle = initDataTexture(renderer, tex)
  return { texture: tex, handle }
}

function byteTexture(
  renderer: WebGLRenderer,
  w: number,
  h: number,
  data?: Uint8Array,
): TexturePackage {
  const tex = new (THREE as any).DataTexture(
    data ?? new Uint8Array(Math.max(1, w * h * 4)),
    w,
    h,
    (THREE as any).RGBAFormat,
    (THREE as any).UnsignedByteType,
  )
  const handle = initDataTexture(renderer, tex)
  return { texture: tex, handle }
}

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

export class ParticleSim {
  private readonly renderer: WebGLRenderer
  private readonly gl: WebGL2RenderingContext
  private readonly vao: WebGLVertexArrayObject
  private readonly vbo: WebGLBuffer
  private readonly initProgram: WebGLProgram
  private readonly updateProgram: WebGLProgram
  private readonly u: Record<string, WebGLUniformLocation | null>
  private pos: TexturePackage[] = []
  private vel: TexturePackage[] = []
  private color: TexturePackage | null = null
  private fbos: WebGLFramebuffer[] = []
  private initFbo: WebGLFramebuffer | null = null
  private width = 0
  private height = 0
  private boundsMin: Vec3 = [-1, 0, -1]
  private boundsMax: Vec3 = [1, 1, 1]
  private gravity: Vec3 = [0, -1, 0]
  private floorY = 0
  private damping = 0
  private count = 0
  private current = 0
  private time = 0
  private ready = false
  private uvs: Float32Array = new Float32Array(0)

  constructor(renderer: WebGLRenderer) {
    this.renderer = renderer
    const raw = renderer.getContext()
    if (!(raw instanceof WebGL2RenderingContext)) throw new Error('ParticleSim requires WebGL2')
    this.gl = raw
    this.initProgram = link(raw, INIT_SHADER)
    this.updateProgram = link(raw, UPDATE_SHADER)
    this.u = {
      iSeed: raw.getUniformLocation(this.initProgram, 'uSeed'),
      iSize: raw.getUniformLocation(this.initProgram, 'uTexSize'),
      iCount: raw.getUniformLocation(this.initProgram, 'uCount'),
      iSpawnPos: raw.getUniformLocation(this.initProgram, 'uSpawnPos'),
      iSpawnColor: raw.getUniformLocation(this.initProgram, 'uSpawnColor'),
      iSpawnHasColor: raw.getUniformLocation(this.initProgram, 'uSpawnHasColor'),
      iSpawnMode: raw.getUniformLocation(this.initProgram, 'uSpawnMode'),
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
    const vao = raw.createVertexArray(); const vbo = raw.createBuffer()
    if (!vao || !vbo) throw new Error('buffer alloc failed')
    this.vao = vao; this.vbo = vbo
    raw.bindVertexArray(vao); raw.bindBuffer(raw.ARRAY_BUFFER, vbo)
    raw.bufferData(raw.ARRAY_BUFFER, QUAD, raw.STATIC_DRAW)
    raw.enableVertexAttribArray(0); raw.vertexAttribPointer(0, 2, raw.FLOAT, false, 0, 0)
    raw.bindVertexArray(null); raw.bindBuffer(raw.ARRAY_BUFFER, null)
  }

  private release() {
    const gl = this.gl
    for (const fb of this.fbos) gl.deleteFramebuffer(fb)
    if (this.initFbo) gl.deleteFramebuffer(this.initFbo)
    for (const tex of this.pos) tex.texture.dispose()
    for (const tex of this.vel) tex.texture.dispose()
    if (this.color) this.color.texture.dispose()
    this.fbos = []
    this.pos = []
    this.vel = []
    this.color = null
    this.initFbo = null
    this.ready = false
    this.uvs = new Float32Array(0)
  }

  createSim(opts: SimOptions, spawn?: SpawnPayload) {
    const { count, seed, gravity, damping, texSize } = opts
    const safeCount = Math.max(0, Math.floor(count))
    const w = texSize?.width ?? Math.max(1, Math.ceil(Math.sqrt(Math.max(1, safeCount))))
    const h = texSize?.height ?? Math.max(1, Math.ceil(Math.max(1, safeCount) / w))
    if (w * h < Math.max(1, safeCount)) throw new Error('texSize too small for particle count')
    this.release()
    const gl = this.gl
    const renderer = this.renderer
    this.pos = [floatTexture(renderer, w, h), floatTexture(renderer, w, h)]
    this.vel = [floatTexture(renderer, w, h), floatTexture(renderer, w, h)]
    this.color = byteTexture(renderer, w, h)
    this.fbos = [gl.createFramebuffer()!, gl.createFramebuffer()!]
    this.initFbo = gl.createFramebuffer()!
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.initFbo)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.pos[0].handle, 0)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, this.vel[0].handle, 0)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT2, gl.TEXTURE_2D, this.color.handle, 0)
    for (let i = 0; i < 2; i += 1) {
      const fb = this.fbos[i]
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.pos[i].handle, 0)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT1, gl.TEXTURE_2D, this.vel[i].handle, 0)
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    const spawnCount = safeCount
    const posData = spawnCount > 0 ? new Float32Array(w * h * 4) : new Float32Array(Math.max(1, w * h * 4))
    const colorData = spawnCount > 0 ? new Uint8Array(w * h * 4) : new Uint8Array(Math.max(1, w * h * 4))
    if (colorData.length > 0) colorData.fill(255)
    let spawnMode = 0
    let spawnHasColor = false
    let minX = Infinity
    let minY = Infinity
    let minZ = Infinity
    let maxX = -Infinity
    let maxY = -Infinity
    let maxZ = -Infinity

    if (spawn && spawnCount > 0 && spawn.positions.length >= spawnCount * 3 && spawn.depths.length >= spawnCount) {
      spawnMode = 1
      const colors = spawn.colors
      const colorIsByte = colors instanceof Uint8Array || colors instanceof Uint8ClampedArray
      const colorCountOk = colors ? colors.length >= spawnCount * 3 : false
      spawnHasColor = !!colors && colorCountOk
      for (let i = 0; i < spawnCount; i += 1) {
        const px = spawn.positions[i * 3 + 0] ?? 0
        const py = spawn.positions[i * 3 + 1] ?? 0
        const pz = spawn.positions[i * 3 + 2] ?? 0
        const depth01 = Math.min(1, Math.max(0, spawn.depths[i] ?? 0.5))
        if (px < minX) minX = px
        if (py < minY) minY = py
        if (pz < minZ) minZ = pz
        if (px > maxX) maxX = px
        if (py > maxY) maxY = py
        if (pz > maxZ) maxZ = pz
        const j = i * 4
        posData[j + 0] = px
        posData[j + 1] = py
        posData[j + 2] = pz
        posData[j + 3] = depth01
        const cj = i * 3
        if (spawnHasColor && colors) {
          if (colorIsByte) {
            colorData[j + 0] = (colors as Uint8Array | Uint8ClampedArray)[cj + 0] ?? 0
            colorData[j + 1] = (colors as Uint8Array | Uint8ClampedArray)[cj + 1] ?? 0
            colorData[j + 2] = (colors as Uint8Array | Uint8ClampedArray)[cj + 2] ?? 0
          } else {
            const r = Number((colors as ArrayLike<number>)[cj + 0] ?? 0)
            const g = Number((colors as ArrayLike<number>)[cj + 1] ?? 0)
            const b = Number((colors as ArrayLike<number>)[cj + 2] ?? 0)
            colorData[j + 0] = Math.max(0, Math.min(255, Math.round(r * 255)))
            colorData[j + 1] = Math.max(0, Math.min(255, Math.round(g * 255)))
            colorData[j + 2] = Math.max(0, Math.min(255, Math.round(b * 255)))
          }
        } else {
          colorData[j + 0] = 217
          colorData[j + 1] = 224
          colorData[j + 2] = 255
        }
        colorData[j + 3] = 255
      }
      if (!(spawnHasColor && spawn.colors)) {
        spawnHasColor = false
      }
    }

    if (!Number.isFinite(minX)) {
      this.boundsMin = [-1, -1, -1]
      this.boundsMax = [1, 1, 1]
    } else {
      const expand = (value: number) => (Number.isFinite(value) ? value : 0)
      let minXp = expand(minX)
      let minYp = expand(minY)
      let minZp = expand(minZ)
      let maxXp = expand(maxX)
      let maxYp = expand(maxY)
      let maxZp = expand(maxZ)
      if (maxXp - minXp < 1e-3) {
        minXp -= 0.5
        maxXp += 0.5
      }
      if (maxYp - minYp < 1e-3) {
        minYp -= 0.5
        maxYp += 0.5
      }
      if (maxZp - minZp < 1e-3) {
        minZp -= 0.5
        maxZp += 0.5
      }
      this.boundsMin = [minXp, minYp, minZp]
      this.boundsMax = [maxXp, maxYp, maxZp]
    }

    this.width = w
    this.height = h
    this.count = spawnCount
    this.damping = damping
    this.gravity = gravity
    const boundsFloor = Number.isFinite(this.boundsMin[1]) ? this.boundsMin[1] : -1
    this.floorY = typeof opts.floorY === 'number' ? opts.floorY : boundsFloor
    this.time = 0
    this.current = 0
    const simUvs = new Float32Array(spawnCount > 0 ? spawnCount * 2 : 0)
    for (let i = 0, j = 0; i < spawnCount; i += 1, j += 2) {
      const x = i % w
      const y = Math.floor(i / w)
      simUvs[j + 0] = (x + 0.5) / w
      simUvs[j + 1] = (y + 0.5) / h
    }
    this.uvs = simUvs

    const spawnPosTex = floatTexture(renderer, w, h, posData)
    const spawnColorTex = spawnHasColor ? byteTexture(renderer, w, h, colorData) : null
    this.runInit(seed, {
      position: spawnPosTex,
      color: spawnColorTex,
      hasColor: spawnHasColor,
      mode: spawnMode,
    })
    spawnPosTex.texture.dispose()
    spawnColorTex?.texture.dispose()
    this.ready = true
    console.log(`[engine] sim on { count:${spawnCount}, texSize:[${w},${h}] }`)
  }

  private runInit(
    seed: number,
    spawn: { position: TexturePackage; color: TexturePackage | null; hasColor: boolean; mode: number },
  ) {
    const gl = this.gl
    const prevFb = gl.getParameter(gl.FRAMEBUFFER_BINDING) as WebGLFramebuffer | null
    const vp = gl.getParameter(gl.VIEWPORT) as Int32Array
    gl.bindVertexArray(this.vao)
    gl.useProgram(this.initProgram)
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.initFbo)
    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1, gl.COLOR_ATTACHMENT2])
    gl.viewport(0, 0, this.width, this.height)
    gl.uniform1f(this.u.iSeed, seed)
    gl.uniform2f(this.u.iSize, this.width, this.height)
    gl.uniform1f(this.u.iCount, this.count)
    if (this.u.iSpawnHasColor) gl.uniform1f(this.u.iSpawnHasColor, spawn.hasColor ? 1 : 0)
    if (this.u.iSpawnMode) gl.uniform1f(this.u.iSpawnMode, spawn.mode > 0 ? 1 : 0)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, spawn.position.handle)
    if (this.u.iSpawnPos) gl.uniform1i(this.u.iSpawnPos, 0)
    gl.activeTexture(gl.TEXTURE1)
    if (spawn.color) {
      gl.bindTexture(gl.TEXTURE_2D, spawn.color.handle)
      if (this.u.iSpawnColor) gl.uniform1i(this.u.iSpawnColor, 1)
    } else {
      gl.bindTexture(gl.TEXTURE_2D, null)
      if (this.u.iSpawnColor) gl.uniform1i(this.u.iSpawnColor, 1)
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.initFbo)
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.fbos[1])
    gl.readBuffer(gl.COLOR_ATTACHMENT0)
    gl.blitFramebuffer(0, 0, this.width, this.height, 0, 0, this.width, this.height, gl.COLOR_BUFFER_BIT, gl.NEAREST)
    gl.readBuffer(gl.COLOR_ATTACHMENT1)
    gl.blitFramebuffer(0, 0, this.width, this.height, 0, 0, this.width, this.height, gl.COLOR_BUFFER_BIT, gl.NEAREST)
    gl.bindFramebuffer(gl.FRAMEBUFFER, prevFb)
    gl.viewport(vp[0], vp[1], vp[2], vp[3])
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, null)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, null)
    gl.bindVertexArray(null)
  }

  update(dt: number) {
    if (!this.ready || dt <= 0) return
    if (this.count <= 0) return
    const gl = this.gl
    const prevFb = gl.getParameter(gl.FRAMEBUFFER_BINDING) as WebGLFramebuffer | null
    const vp = gl.getParameter(gl.VIEWPORT) as Int32Array
    const src = this.current
    const dst = 1 - src
    this.time += dt
    gl.bindVertexArray(this.vao)
    gl.useProgram(this.updateProgram)
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbos[dst])
    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1])
    gl.viewport(0, 0, this.width, this.height)
    gl.uniform2f(this.u.uSize, this.width, this.height)
    gl.uniform1f(this.u.uCount, this.count)
    gl.uniform1f(this.u.uDt, dt)
    gl.uniform1f(this.u.uDamp, this.damping)
    gl.uniform3f(this.u.uGrav, this.gravity[0], this.gravity[1], this.gravity[2])
    gl.uniform1f(this.u.uFloor, this.floorY)
    gl.uniform3f(this.u.uMin, this.boundsMin[0], this.boundsMin[1], this.boundsMin[2])
    gl.uniform3f(this.u.uMax, this.boundsMax[0], this.boundsMax[1], this.boundsMax[2])
    gl.uniform1f(this.u.uTime, this.time * 0.1)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.pos[src].handle)
    gl.uniform1i(this.u.uPos, 0)
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, this.vel[src].handle)
    gl.uniform1i(this.u.uVel, 1)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    gl.bindFramebuffer(gl.FRAMEBUFFER, prevFb)
    gl.viewport(vp[0], vp[1], vp[2], vp[3])
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, null)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, null)
    gl.bindVertexArray(null)
    this.current = dst
  }

  getPositionTexture() {
    return this.ready ? this.pos[this.current].texture : null
  }

  getColorTexture() {
    return this.ready && this.color ? this.color.texture : null
  }

  getSimUvs() {
    return this.uvs
  }

  getTexSize(): [number, number] {
    return [this.width, this.height]
  }

  getBounds(): { center: Vec3; radius: number } {
    const min = this.boundsMin
    const max = this.boundsMax
    const center: Vec3 = [
      (min[0] + max[0]) * 0.5,
      (min[1] + max[1]) * 0.5,
      (min[2] + max[2]) * 0.5,
    ]
    const extentX = max[0] - min[0]
    const extentY = max[1] - min[1]
    const extentZ = max[2] - min[2]
    const maxExtent = Math.max(extentX, extentY, extentZ)
    const radius = maxExtent > 0 ? maxExtent * 0.5 : 1
    return { center, radius }
  }

  setDynamics(opts: { gravity: Vec3; damping: number; floorY?: number }) {
    this.gravity = [opts.gravity[0], opts.gravity[1], opts.gravity[2]]
    this.damping = opts.damping
    if (typeof opts.floorY === 'number') this.floorY = opts.floorY
  }

  dispose() {
    this.release()
  }
}
