import * as THREE from 'three';
import type { NodeData } from '../types';

export class NodeAttributeManager {
  private nodeToIndex: Map<string, number> = new Map();
  private indexToNode: Map<number, string> = new Map();
  
  private instanceColor: Float32Array;
  private aOpacity: Float32Array;
  private selected: Uint8Array;
  private instanceMatrix: Float32Array;
  
  private baseColorCache: Float32Array;
  private nodeMetadata: Map<string, { category?: string; tags?: string[] }> = new Map();
  
  private colorPriorities: Map<string, { color: THREE.Color; priority: number }> = new Map();
  private mesh?: THREE.InstancedMesh;
  
  /**
   * Dirty range tracking for color attribute updates.
   * Tracks min/max indices that have been modified since last flush.
   */
  private dirtyRangeColor: { min: number; max: number } = { min: Infinity, max: -Infinity };
  
  /**
   * Dirty range tracking for opacity attribute updates.
   * Tracks min/max indices that have been modified since last flush.
   */
  private dirtyRangeOpacity: { min: number; max: number } = { min: Infinity, max: -Infinity };
  
  /**
   * Dirty range tracking for selected attribute updates.
   * Tracks min/max indices that have been modified since last flush.
   */
  private dirtyRangeSelected: { min: number; max: number } = { min: Infinity, max: -Infinity };
  
  /**
   * Dirty range tracking for matrix (position) updates.
   * Tracks min/max indices that have been modified since last flush.
   */
  private dirtyRangeMatrix: { min: number; max: number } = { min: Infinity, max: -Infinity };
  
  constructor(capacity: number) {
    this.instanceColor = new Float32Array(capacity * 3);
    this.aOpacity = new Float32Array(capacity);
    this.selected = new Uint8Array(capacity);
    this.instanceMatrix = new Float32Array(capacity * 16);
    this.baseColorCache = new Float32Array(capacity * 3);
    
    this.initializeColorPriorities();
  }
  
  private initializeColorPriorities(): void {
    this.colorPriorities.set('default', { color: new THREE.Color(0x888888), priority: 0 });
    this.colorPriorities.set('category:primary', { color: new THREE.Color(0x2196f3), priority: 1 });
    this.colorPriorities.set('category:secondary', { color: new THREE.Color(0x4caf50), priority: 1 });
    this.colorPriorities.set('category:tertiary', { color: new THREE.Color(0xff9800), priority: 1 });
    this.colorPriorities.set('tag:important', { color: new THREE.Color(0xf44336), priority: 2 });
    this.colorPriorities.set('tag:highlighted', { color: new THREE.Color(0xffeb3b), priority: 2 });
    this.colorPriorities.set('selected', { color: new THREE.Color(0x00ff00), priority: 10 });
    this.colorPriorities.set('hover', { color: new THREE.Color(0xff00ff), priority: 9 });
  }
  
  setMesh(mesh: THREE.InstancedMesh): void {
    this.mesh = mesh;
  }
  
  registerNode(nodeId: string, index: number, nodeData?: NodeData): void {
    this.nodeToIndex.set(nodeId, index);
    this.indexToNode.set(index, nodeId);
    
    if (nodeData) {
      this.nodeMetadata.set(nodeId, { 
        category: nodeData.category, 
        tags: nodeData.tags 
      });
      
      const baseColor = this.resolveBaseColor(nodeData.category, nodeData.tags);
      const offset = index * 3;
      this.baseColorCache[offset] = baseColor.r;
      this.baseColorCache[offset + 1] = baseColor.g;
      this.baseColorCache[offset + 2] = baseColor.b;
      
      this.instanceColor[offset] = baseColor.r;
      this.instanceColor[offset + 1] = baseColor.g;
      this.instanceColor[offset + 2] = baseColor.b;
    }
  }
  
  private resolveBaseColor(category?: string, tags?: string[]): THREE.Color {
    let highestPriority = -1;
    let selectedColor = this.colorPriorities.get('default')!.color;
    
    if (category) {
      const categoryKey = `category:${category}`;
      const categoryEntry = this.colorPriorities.get(categoryKey);
      if (categoryEntry && categoryEntry.priority > highestPriority) {
        highestPriority = categoryEntry.priority;
        selectedColor = categoryEntry.color;
      }
    }
    
    if (tags) {
      for (const tag of tags) {
        const tagKey = `tag:${tag}`;
        const tagEntry = this.colorPriorities.get(tagKey);
        if (tagEntry && tagEntry.priority > highestPriority) {
          highestPriority = tagEntry.priority;
          selectedColor = tagEntry.color;
        }
      }
    }
    
    return selectedColor;
  }
  
  restoreBaseColor(nodeId: string): void {
    const index = this.indexOf(nodeId);
    if (index === -1) return;
    
    const offset = index * 3;
    this.instanceColor[offset] = this.baseColorCache[offset];
    this.instanceColor[offset + 1] = this.baseColorCache[offset + 1];
    this.instanceColor[offset + 2] = this.baseColorCache[offset + 2];
    
    this.dirtyRangeColor.min = Math.min(this.dirtyRangeColor.min, index);
    this.dirtyRangeColor.max = Math.max(this.dirtyRangeColor.max, index);
  }
  
  unregisterNode(nodeId: string): void {
    const index = this.nodeToIndex.get(nodeId);
    if (index !== undefined) {
      this.nodeToIndex.delete(nodeId);
      this.indexToNode.delete(index);
      this.nodeMetadata.delete(nodeId);
    }
  }
  
  setPosition(nodeId: string, v: THREE.Vector3): void {
    // [PERF] Hot path - called frequently during animations
    const index = this.indexOf(nodeId);
    if (index === -1) return;
    
    const offset = index * 16;
    const matrix = new THREE.Matrix4();
    matrix.setPosition(v.x, v.y, v.z);
    
    const elements = matrix.elements;
    for (let i = 0; i < 16; i++) {
      this.instanceMatrix[offset + i] = elements[i];
    }
    
    this.dirtyRangeMatrix.min = Math.min(this.dirtyRangeMatrix.min, index);
    this.dirtyRangeMatrix.max = Math.max(this.dirtyRangeMatrix.max, index);
  }
  
  setOpacity(nodeId: string, a: number): void {
    // [PERF] Hot path - called during timeline scrubbing
    const index = this.indexOf(nodeId);
    if (index === -1) return;
    
    this.aOpacity[index] = a;
    this.dirtyRangeOpacity.min = Math.min(this.dirtyRangeOpacity.min, index);
    this.dirtyRangeOpacity.max = Math.max(this.dirtyRangeOpacity.max, index);
  }
  
  setColor(nodeId: string, c: THREE.Color): void {
    // [PERF] Hot path - called during hover/selection
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
    // [PERF] Critical path - called every frame
    if (!this.mesh) return;
    
    if (this.dirtyRangeMatrix.min !== Infinity) {
      const start = this.dirtyRangeMatrix.min * 16;
      const count = (this.dirtyRangeMatrix.max - this.dirtyRangeMatrix.min + 1) * 16;
      
      this.mesh.instanceMatrix.array.set(
        this.instanceMatrix.subarray(start, start + count),
        start
      );
      this.mesh.instanceMatrix.updateRange.offset = start;
      this.mesh.instanceMatrix.updateRange.count = count;
      this.mesh.instanceMatrix.needsUpdate = true;
    }
    
    if (this.dirtyRangeColor.min !== Infinity) {
      const start = this.dirtyRangeColor.min * 3;
      const count = (this.dirtyRangeColor.max - this.dirtyRangeColor.min + 1) * 3;
      
      const colorAttr = this.mesh.instanceColor;
      if (colorAttr) {
        colorAttr.array.set(
          this.instanceColor.subarray(start, start + count),
          start
        );
        colorAttr.updateRange.offset = start;
        colorAttr.updateRange.count = count;
        colorAttr.needsUpdate = true;
      }
    }
    
    if (this.dirtyRangeOpacity.min !== Infinity) {
      const start = this.dirtyRangeOpacity.min;
      const count = this.dirtyRangeOpacity.max - this.dirtyRangeOpacity.min + 1;
      
      const opacityAttr = this.mesh.geometry.getAttribute('aOpacity') as THREE.InstancedBufferAttribute;
      if (opacityAttr) {
        opacityAttr.array.set(
          this.aOpacity.subarray(start, start + count),
          start
        );
        opacityAttr.updateRange.offset = start;
        opacityAttr.updateRange.count = count;
        opacityAttr.needsUpdate = true;
      }
    }
    
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
    // [PERF] Hot path - called by all setter methods
    return this.nodeToIndex.get(nodeId) ?? -1;
  }
  
  idAt(idx: number): string {
    return this.indexToNode.get(idx) ?? '';
  }
}