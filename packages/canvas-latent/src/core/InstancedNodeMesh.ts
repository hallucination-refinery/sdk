import * as THREE from 'three';

export class InstancedNodeMesh {
  static build(count: number): {
    mesh: THREE.InstancedMesh;
    aOpacity: THREE.InstancedBufferAttribute;
  } {
    // [PERF] Geometry creation - balance detail vs performance
    const geometry = new THREE.SphereGeometry(1, 16, 16);
    const material = new THREE.MeshBasicMaterial({
      vertexColors: true,
    });
    
    // TODO: Patch shader with onBeforeCompile for opacity support
    material.onBeforeCompile = (shader) => {
      // TODO: Inject aOpacity attribute and modify fragment shader
    };
    
    const mesh = new THREE.InstancedMesh(geometry, material, count);
    
    const aOpacity = new THREE.InstancedBufferAttribute(
      new Float32Array(count),
      1
    );
    
    geometry.setAttribute('aOpacity', aOpacity);
    
    return {
      mesh,
      aOpacity,
    };
  }
}