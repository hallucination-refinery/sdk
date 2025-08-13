import * as THREE from 'three';

export class NodeAttributeManager {
  private nodeToIndex: Map<string, number> = new Map();
  private indexToNode: Map<number, string> = new Map();
  
  private instanceColor: Float32Array;
  private aOpacity: Float32Array;
  private selected: Uint8Array;
  
  private dirtyRangeColor: { min: number; max: number } = { min: Infinity, max: -Infinity };
  private dirtyRangeOpacity: { min: number; max: number } = { min: Infinity, max: -Infinity };
  private dirtyRangeSelected: { min: number; max: number } = { min: Infinity, max: -Infinity };
  private dirtyRangeMatrix: { min: number; max: number } = { min: Infinity, max: -Infinity };
  
  constructor(capacity: number) {
    this.instanceColor = new Float32Array(capacity * 3);
    this.aOpacity = new Float32Array(capacity);
    this.selected = new Uint8Array(capacity);
  }
  
  setPosition(nodeId: string, v: THREE.Vector3): void {
    const index = this.indexOf(nodeId);
    if (index === -1) return;
    
    // TODO: Implement matrix write-path
    this.dirtyRangeMatrix.min = Math.min(this.dirtyRangeMatrix.min, index);
    this.dirtyRangeMatrix.max = Math.max(this.dirtyRangeMatrix.max, index);
  }
  
  setOpacity(nodeId: string, a: number): void {
    const index = this.indexOf(nodeId);
    if (index === -1) return;
    
    this.aOpacity[index] = a;
    this.dirtyRangeOpacity.min = Math.min(this.dirtyRangeOpacity.min, index);
    this.dirtyRangeOpacity.max = Math.max(this.dirtyRangeOpacity.max, index);
  }
  
  setColor(nodeId: string, c: THREE.Color): void {
    const index = this.indexOf(nodeId);
    if (index === -1) return;
    
    const offset = index * 3;
    this.instanceColor[offset] = c.r;
    this.instanceColor[offset + 1] = c.g;
    this.instanceColor[offset + 2] = c.b;
    
    this.dirtyRangeColor.min = Math.min(this.dirtyRangeColor.min, index);
    this.dirtyRangeColor.max = Math.max(this.dirtyRangeColor.max, index);
  }
  
  setSelected(nodeId: string, sel: boolean): void {
    const index = this.indexOf(nodeId);
    if (index === -1) return;
    
    this.selected[index] = sel ? 1 : 0;
    this.dirtyRangeSelected.min = Math.min(this.dirtyRangeSelected.min, index);
    this.dirtyRangeSelected.max = Math.max(this.dirtyRangeSelected.max, index);
  }
  
  flush(): void {
    // TODO: Apply dirty ranges to GPU buffers
    this.dirtyRangeColor = { min: Infinity, max: -Infinity };
    this.dirtyRangeOpacity = { min: Infinity, max: -Infinity };
    this.dirtyRangeSelected = { min: Infinity, max: -Infinity };
    this.dirtyRangeMatrix = { min: Infinity, max: -Infinity };
  }
  
  dispose(): void {
    this.nodeToIndex.clear();
    this.indexToNode.clear();
  }
  
  indexOf(nodeId: string): number {
    return this.nodeToIndex.get(nodeId) ?? -1;
  }
  
  idAt(idx: number): string {
    return this.indexToNode.get(idx) ?? '';
  }
}