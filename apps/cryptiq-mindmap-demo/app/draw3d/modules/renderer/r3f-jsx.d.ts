import '@react-three/fiber'

declare global {
  namespace JSX {
    // Relax typing for specific R3F intrinsics used here
    interface IntrinsicElements {
      instancedMesh: unknown
      sphereGeometry: unknown
    }
  }
}
