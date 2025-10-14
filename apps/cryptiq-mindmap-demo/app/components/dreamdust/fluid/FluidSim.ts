import * as THREE from 'three'

/**
 * Minimal CPU fluid stub for screen-space velocity.
 * - Grid: size x size, velocity in XY (packed into RG of a Float32 DataTexture)
 * - addForce: Gaussian splat impulse at UV with radius (0..1 of grid), strength (0..1)
 * - step: simple decay + diffusion blur (cheap, stable); good enough for MVP under-finger motion
 */
export class FluidSim {
  private readonly size: number
  private readonly field: Float32Array // [vx, vy] per cell
  private readonly next: Float32Array
  private readonly texData: Float32Array // RGBA float32
  private readonly texture: THREE.DataTexture
  private decay = 0.94
  private diffusion = 0.08

  constructor(size = 256) {
    this.size = Math.max(8, Math.floor(size))
    const cellCount = this.size * this.size
    this.field = new Float32Array(cellCount * 2)
    this.next = new Float32Array(cellCount * 2)
    this.texData = new Float32Array(cellCount * 4)
    this.texture = new (THREE as any).DataTexture(
      this.texData,
      this.size,
      this.size,
      (THREE as any).RGBAFormat,
      (THREE as any).FloatType,
    )
    this.texture.needsUpdate = true
    ;(this.texture as any).flipY = false
    this.texture.magFilter = (THREE as any).LinearFilter
    this.texture.minFilter = (THREE as any).LinearFilter
    this.texture.wrapS = (THREE as any).ClampToEdgeWrapping
    this.texture.wrapT = (THREE as any).ClampToEdgeWrapping
  }

  getTexture() {
    return this.texture
  }

  getInvSize(): [number, number] {
    const inv = 1 / this.size
    return [inv, inv]
  }

  /**
   * Add a radial force at normalized UV (0..1). Radius is normalized (0..1 of the grid extent).
   * Strength is ~[0..1] and scaled internally.
   */
  addForce(uv: [number, number], radius: number, strength: number) {
    const [u, v] = uv
    if (!Number.isFinite(u) || !Number.isFinite(v)) return
    const rNorm = Math.max(1e-3, Math.min(0.5, radius))
    const sNorm = Math.max(0, Math.min(1, strength))
    const cx = Math.floor(u * (this.size - 1))
    const cy = Math.floor(v * (this.size - 1))
    const rp = Math.max(1, Math.floor(rNorm * this.size))
    const sigma = rp * 0.6
    const twoSigma2 = 2 * sigma * sigma
    const gain = 6.0 * sNorm // tuned for visible impact within 1-2 frames

    for (let dy = -rp; dy <= rp; dy += 1) {
      const y = cy + dy
      if (y < 0 || y >= this.size) continue
      for (let dx = -rp; dx <= rp; dx += 1) {
        const x = cx + dx
        if (x < 0 || x >= this.size) continue
        const dist2 = dx * dx + dy * dy
        const w = Math.exp(-dist2 / Math.max(1, twoSigma2))
        const idx = (y * this.size + x) * 2
        // Direction: radial outward from center
        const dirX = dx === 0 && dy === 0 ? 0 : dx / Math.max(1, Math.hypot(dx, dy))
        const dirY = dx === 0 && dy === 0 ? 0 : dy / Math.max(1, Math.hypot(dx, dy))
        this.field[idx + 0] += dirX * gain * w
        this.field[idx + 1] += dirY * gain * w
      }
    }
  }

  /**
   * Semi-implicit cheap diffusion + decay. Bilinear blur on velocity followed by decay.
   */
  step(dt: number) {
    if (!(dt > 0)) dt = 1 / 60
    const s = this.size
    const a = this.field
    const b = this.next
    const diffW = Math.max(0, Math.min(1, this.diffusion))
    const decay = Math.pow(this.decay, dt * 60)

    // 3x3 blur (separable approximation)
    for (let y = 0; y < s; y += 1) {
      const y0 = y > 0 ? y - 1 : y
      const y1 = y
      const y2 = y < s - 1 ? y + 1 : y
      for (let x = 0; x < s; x += 1) {
        const x0 = x > 0 ? x - 1 : x
        const x1 = x
        const x2 = x < s - 1 ? x + 1 : x
        const i = (y1 * s + x1) * 2
        // Sample 3x3 neighborhood
        let sumX = 0, sumY = 0
        for (const yy of [y0, y1, y2]) {
          for (const xx of [x0, x1, x2]) {
            const j = (yy * s + xx) * 2
            sumX += a[j + 0]
            sumY += a[j + 1]
          }
        }
        const avgX = sumX / 9
        const avgY = sumY / 9
        const vx = a[i + 0] * (1 - diffW) + avgX * diffW
        const vy = a[i + 1] * (1 - diffW) + avgY * diffW
        b[i + 0] = vx * decay
        b[i + 1] = vy * decay
      }
    }

    // swap
    this.field.set(b)

    // pack into texture RG
    const out = this.texData
    let k = 0
    for (let i = 0; i < s * s; i += 1) {
      out[k + 0] = this.field[i * 2 + 0]
      out[k + 1] = this.field[i * 2 + 1]
      out[k + 2] = 0
      out[k + 3] = 1
      k += 4
    }
    this.texture.needsUpdate = true
  }

  dispose() {
    this.texture.dispose()
  }
}


