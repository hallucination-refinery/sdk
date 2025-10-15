import * as THREE from 'three'
import type { WebGLRenderer, WebGLRenderTarget, ShaderMaterial } from 'three'

import { ADD_FORCE_SHADER } from './shaders/addForce'
import { ADVECT_SHADER } from './shaders/advect'
import { DIVERGENCE_SHADER } from './shaders/divergence'
import { JACOBI_SHADER } from './shaders/jacobi'
import { PROJECT_SHADER } from './shaders/project'

const FULLSCREEN_VERT = /* glsl */ String.raw`
precision highp float;

out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

type PingPong = {
  read: WebGLRenderTarget
  write: WebGLRenderTarget
}

type FluidSimOptions = {
  size?: number
  iterations?: number
  dissipation?: number
}

function supportsHalfFloat(renderer: WebGLRenderer) {
  const caps = (renderer.capabilities ?? {}) as { isWebGL2?: boolean }
  if (!caps.isWebGL2) {
    return false
  }
  return Boolean((THREE as any).HalfFloatType)
}

function makeTarget(renderer: WebGLRenderer, size: number, type: number) {
  const target = new (THREE as any).WebGLRenderTarget(size, size, {
    depthBuffer: false,
    stencilBuffer: false,
    type,
    format: (THREE as any).RGBAFormat,
    magFilter: (THREE as any).LinearFilter,
    minFilter: (THREE as any).LinearFilter,
    wrapS: (THREE as any).ClampToEdgeWrapping,
    wrapT: (THREE as any).ClampToEdgeWrapping,
  })
  target.texture.generateMipmaps = false
  return target as WebGLRenderTarget
}

function swap(targets: PingPong) {
  const tmp = targets.read
  targets.read = targets.write
  targets.write = tmp
}

export class FluidSim {
  private readonly renderer: WebGLRenderer
  private readonly size: number
  private readonly iterations: number
  private readonly quad: THREE.Mesh
  private readonly scene: THREE.Scene
  private readonly camera: THREE.OrthographicCamera
  private readonly velocity: PingPong
  private readonly pressure: PingPong
  private readonly divergence: WebGLRenderTarget
  private readonly invSizeVec: THREE.Vector2
  private readonly advectMaterial: ShaderMaterial
  private readonly addForceMaterial: ShaderMaterial
  private readonly divergenceMaterial: ShaderMaterial
  private readonly jacobiMaterial: ShaderMaterial
  private readonly projectMaterial: ShaderMaterial
  private readonly glslVersion: number
  private readonly dissipation: number
  private readonly dtClamp = 1 / 30
  private pendingInitLog = true

  constructor(renderer: WebGLRenderer, options?: FluidSimOptions) {
    if (!(renderer.getContext() instanceof WebGL2RenderingContext)) {
      throw new Error('FluidSim requires WebGL2')
    }
    this.renderer = renderer
    const safeSize = options?.size ?? 256
    this.size = Math.max(8, Math.floor(safeSize))
    this.iterations = Math.max(1, Math.floor(options?.iterations ?? 10))
    this.dissipation = options?.dissipation ?? 0.985

    this.glslVersion = (THREE as any).GLSL3 ?? 300
    this.scene = new THREE.Scene()
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    this.invSizeVec = new THREE.Vector2(1 / this.size, 1 / this.size)

    const type = supportsHalfFloat(renderer) ? (THREE as any).HalfFloatType : (THREE as any).FloatType
    this.velocity = {
      read: makeTarget(renderer, this.size, type),
      write: makeTarget(renderer, this.size, type),
    }
    this.pressure = {
      read: makeTarget(renderer, this.size, type),
      write: makeTarget(renderer, this.size, type),
    }
    this.divergence = makeTarget(renderer, this.size, type)

    this.advectMaterial = this.createMaterial(ADVECT_SHADER, {
      uVelocity: { value: this.velocity.read.texture },
      uTexelSize: { value: this.invSizeVec.clone() },
      uDt: { value: 0 },
      uDissipation: { value: this.dissipation },
    })

    this.addForceMaterial = this.createMaterial(ADD_FORCE_SHADER, {
      uVelocity: { value: this.velocity.read.texture },
      uPoint: { value: new THREE.Vector2(0.5, 0.5) },
      uRadius: { value: 0 },
      uStrength: { value: 0 },
    })

    this.divergenceMaterial = this.createMaterial(DIVERGENCE_SHADER, {
      uVelocity: { value: this.velocity.read.texture },
      uTexelSize: { value: this.invSizeVec.clone() },
    })

    this.jacobiMaterial = this.createMaterial(JACOBI_SHADER, {
      uPressure: { value: this.pressure.read.texture },
      uDivergence: { value: this.divergence.texture },
      uTexelSize: { value: this.invSizeVec.clone() },
    })

    this.projectMaterial = this.createMaterial(PROJECT_SHADER, {
      uVelocity: { value: this.velocity.read.texture },
      uPressure: { value: this.pressure.read.texture },
      uTexelSize: { value: this.invSizeVec.clone() },
    })

    const geometry = new THREE.PlaneGeometry(2, 2)
    this.quad = new THREE.Mesh(geometry, this.advectMaterial)
    this.quad.frustumCulled = false
    this.scene.add(this.quad)

    this.clearTarget(this.velocity.read)
    this.clearTarget(this.velocity.write)
    this.clearTarget(this.pressure.read)
    this.clearTarget(this.pressure.write)
    this.clearTarget(this.divergence)
  }

  private createMaterial(fragmentShader: string, uniforms: Record<string, { value: unknown }>) {
    const material = new (THREE as any).ShaderMaterial({
      uniforms,
      vertexShader: FULLSCREEN_VERT,
      fragmentShader,
      glslVersion: this.glslVersion,
      depthTest: false,
      depthWrite: false,
      blending: (THREE as any).NoBlending,
    })
    return material as ShaderMaterial
  }

  private renderPass(target: WebGLRenderTarget, material: ShaderMaterial) {
    const prevMaterial = this.quad.material
    this.quad.material = material
    const prevAutoClear = this.renderer.autoClear
    const prevTarget = this.renderer.getRenderTarget()
    this.renderer.autoClear = false
    this.renderer.setRenderTarget(target)
    this.renderer.render(this.scene, this.camera)
    this.renderer.setRenderTarget(prevTarget)
    this.renderer.autoClear = prevAutoClear
    this.quad.material = prevMaterial
  }

  private clearTarget(target: WebGLRenderTarget) {
    const prevAutoClear = this.renderer.autoClear
    this.renderer.autoClear = false
    const prevClearColor = this.renderer.getClearColor(new THREE.Color())
    const prevClearAlpha = this.renderer.getClearAlpha()
    const prevTarget = this.renderer.getRenderTarget()
    this.renderer.setRenderTarget(target)
    this.renderer.setClearColor(0x000000, 1)
    this.renderer.clear(true, false, false)
    this.renderer.setRenderTarget(prevTarget)
    this.renderer.setClearColor(prevClearColor, prevClearAlpha)
    this.renderer.autoClear = prevAutoClear
  }

  addForce(point: [number, number], radius: number, strength: number) {
    const [px, py] = point
    if (!Number.isFinite(px) || !Number.isFinite(py)) {
      return
    }
    const safeRadius = Math.max(1e-4, Math.min(0.5, radius))
    const safeStrength = Math.max(0, strength)
    this.addForceMaterial.uniforms.uVelocity.value = this.velocity.read.texture
    ;(this.addForceMaterial.uniforms.uPoint.value as THREE.Vector2).set(px, py)
    this.addForceMaterial.uniforms.uRadius.value = safeRadius
    this.addForceMaterial.uniforms.uStrength.value = safeStrength
    this.renderPass(this.velocity.write, this.addForceMaterial)
    swap(this.velocity)
  }

  step(dt: number) {
    if (!(dt > 0)) {
      dt = 1 / 60
    }
    const clampedDt = Math.min(dt, this.dtClamp)

    // Advect velocity into the write target, then flip read/write.
    const advectSrc = this.velocity.read
    const advectDst = this.velocity.write
    this.advectMaterial.uniforms.uVelocity.value = advectSrc.texture
    this.advectMaterial.uniforms.uDt.value = clampedDt
    this.renderPass(advectDst, this.advectMaterial)
    swap(this.velocity)

    // Divergence uses the newly-advected field but does not flip targets.
    const divergenceSrc = this.velocity.read
    this.divergenceMaterial.uniforms.uVelocity.value = divergenceSrc.texture
    this.renderPass(this.divergence, this.divergenceMaterial)

    this.clearTarget(this.pressure.read)
    this.clearTarget(this.pressure.write)

    for (let i = 0; i < this.iterations; i += 1) {
      // Jacobi relax into write target, then swap for the next iteration.
      const pressureSrc = this.pressure.read
      const pressureDst = this.pressure.write
      this.jacobiMaterial.uniforms.uPressure.value = pressureSrc.texture
      this.jacobiMaterial.uniforms.uDivergence.value = this.divergence.texture
      this.renderPass(pressureDst, this.jacobiMaterial)
      swap(this.pressure)
    }

    // Projection writes the divergence-free velocity and swaps once more.
    const projectVelocitySrc = this.velocity.read
    const projectVelocityDst = this.velocity.write
    const pressureField = this.pressure.read
    this.projectMaterial.uniforms.uVelocity.value = projectVelocitySrc.texture
    this.projectMaterial.uniforms.uPressure.value = pressureField.texture
    this.renderPass(projectVelocityDst, this.projectMaterial)
    swap(this.velocity)

    if (this.pendingInitLog) {
      try {
        console.info('[PC] fluid init', { size: this.size, iters: this.iterations })
      } catch {
        /* noop */
      }
      this.pendingInitLog = false
    }
  }

  getTexture() {
    return this.velocity.read.texture
  }

  getInvSize(): [number, number] {
    return [this.invSizeVec.x, this.invSizeVec.y]
  }

  dispose() {
    this.velocity.read.dispose()
    this.velocity.write.dispose()
    this.pressure.read.dispose()
    this.pressure.write.dispose()
    this.divergence.dispose()
    this.advectMaterial.dispose()
    this.addForceMaterial.dispose()
    this.divergenceMaterial.dispose()
    this.jacobiMaterial.dispose()
    this.projectMaterial.dispose()
    this.quad.geometry.dispose()
    this.scene.clear()
  }
}
