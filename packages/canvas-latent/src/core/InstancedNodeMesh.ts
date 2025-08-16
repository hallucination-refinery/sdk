import * as THREE from 'three'
import type { NodeData } from '../types'

export class InstancedNodeMesh {
  static build(count: number): {
    mesh: THREE.InstancedMesh
    aOpacity: THREE.InstancedBufferAttribute
  } {
    // [PERF] Geometry creation - balance detail vs performance
    const geometry = new THREE.SphereGeometry(1, 16, 16)
    const material = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: false,
    })
    // Ensure no base tint so instance colors are visible
    material.color.set(0xffffff)

    material.onBeforeCompile = (shader) => {
      shader.vertexShader = `
        attribute float aOpacity;
        varying float vOpacity;
        ${shader.vertexShader}
      `.replace(
        '#include <color_vertex>',
        `
        #include <color_vertex>
        vOpacity = aOpacity;
        `
      )

      shader.fragmentShader = `
        varying float vOpacity;
        ${shader.fragmentShader}
      `.replace(
        '#include <color_fragment>',
        `
        #include <color_fragment>
        diffuseColor.a *= vOpacity;
        `
      )
    }

    const mesh = new THREE.InstancedMesh(geometry, material, count)
    // Ensure raycasting has valid bounds
    geometry.computeBoundingSphere()
    try { geometry.computeBoundingBox() } catch {}

    const aOpacity = new THREE.InstancedBufferAttribute(new Float32Array(count), 1)

    geometry.setAttribute('aOpacity', aOpacity)

    return {
      mesh,
      aOpacity,
    }
  }

  static cameraPosition(
    positions: THREE.Vector3[],
    camera: THREE.Camera,
    padding: number = 1.2,
    filter?: (pos: THREE.Vector3) => boolean
  ): THREE.Vector3 {
    const filteredPositions = filter ? positions.filter(filter) : positions

    if (filteredPositions.length === 0) {
      return camera.position.clone()
    }

    const boundingSphere = new THREE.Sphere()
    const points = filteredPositions.map((p) => p.clone())
    boundingSphere.setFromPoints(points)

    const center = boundingSphere.center
    const radius = boundingSphere.radius * padding

    const direction = camera.position.clone().sub(center).normalize()

    if (direction.length() === 0) {
      direction.set(0, 0, 1)
    }

    const distance =
      radius / Math.tan(((camera as THREE.PerspectiveCamera).fov * 0.5 * Math.PI) / 180)

    return center.clone().add(direction.multiplyScalar(distance))
  }

  static zoomToFit(
    positions: THREE.Vector3[],
    camera: THREE.Camera,
    controls: any,
    padding: number = 1.2,
    filter?: (pos: THREE.Vector3) => boolean
  ): void {
    const targetPosition = this.cameraPosition(positions, camera, padding, filter)

    if (controls && controls.target) {
      const filteredPositions = filter ? positions.filter(filter) : positions

      if (filteredPositions.length > 0) {
        const boundingSphere = new THREE.Sphere()
        boundingSphere.setFromPoints(filteredPositions)

        controls.target.copy(boundingSphere.center)
        camera.position.copy(targetPosition)

        if (controls.update) {
          controls.update()
        }
      }
    } else {
      camera.position.copy(targetPosition)
    }

    camera.updateProjectionMatrix()
  }
}
