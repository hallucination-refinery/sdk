declare module 'three' {
  export class Vector3 {
    constructor(x?: number, y?: number, z?: number)
    x: number
    y: number
    z: number
    add(v: Vector3): Vector3
    clone(): Vector3
    distanceTo(v: Vector3): number
  }
  export class Group {}
  export class Object3D {}
  export class Mesh {}
  export class Material {}
  export class MeshBasicMaterial {}
  export class TubeGeometry {}
  export class BufferGeometry {
    getAttribute(name: string): any
  }
  export class BufferAttribute {}
  export class ShaderMaterial {}
  export class CanvasTexture {}
  export class Sprite {}
  export class PerspectiveCamera {
    fov: number
    isPerspectiveCamera: boolean
    updateProjectionMatrix(): void
  }
  export type Camera = PerspectiveCamera
}

declare module 'three/examples/jsm/*'

declare module '@refinery/store'
declare module '@refinery/sdk-core'
declare module '@refinery/canvas-r3f'
declare module '@refinery/graph-forge'
declare module '@refinery/schema'
declare module '@refinery/ops'
declare module '@refinery/input-hub'
declare module '@refinery/widget-aperture'
declare module '@refinery/widget-hud'
