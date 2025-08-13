import * as THREE from 'three';
import { NodeAttributeManager } from './NodeAttributeManager';

export interface RaycastResult {
  nodeId: string;
  point: THREE.Vector3;
}

export class RaycastHandler {
  private raycaster: THREE.Raycaster;
  private nodeAttributeManager: NodeAttributeManager;
  private mesh: THREE.InstancedMesh;
  
  constructor(mesh: THREE.InstancedMesh, nodeAttributeManager: NodeAttributeManager) {
    this.raycaster = new THREE.Raycaster();
    this.mesh = mesh;
    this.nodeAttributeManager = nodeAttributeManager;
  }
  
  raycast(
    camera: THREE.Camera,
    mousePosition: THREE.Vector2
  ): RaycastResult | null {
    this.raycaster.setFromCamera(mousePosition, camera);
    
    const intersects = this.raycaster.intersectObject(this.mesh, false);
    
    if (intersects.length === 0) {
      return null;
    }
    
    const intersection = intersects[0];
    const instanceId = intersection.instanceId;
    
    if (instanceId === undefined) {
      return null;
    }
    
    const nodeId = this.nodeAttributeManager.idAt(instanceId);
    
    if (!nodeId) {
      return null;
    }
    
    return {
      nodeId,
      point: intersection.point
    };
  }
  
  dispose(): void {
    this.raycaster = null as any;
    this.mesh = null as any;
    this.nodeAttributeManager = null as any;
  }
}