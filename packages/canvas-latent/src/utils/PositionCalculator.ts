import * as THREE from 'three';

export interface PositionLens {
  type: 'grid' | 'spiral' | 'random' | 'force';
  params?: Record<string, any>;
}

export class PositionCalculator {
  private seed: number;
  
  constructor(seed: number = 42) {
    this.seed = seed;
  }
  
  calculate(
    nodeId: string,
    lens?: PositionLens,
    index?: number
  ): THREE.Vector3 {
    if (!lens) {
      return this.deterministicPosition(nodeId, index ?? 0);
    }
    
    switch (lens.type) {
      case 'grid':
        return this.gridPosition(index ?? 0, lens.params);
      case 'spiral':
        return this.spiralPosition(index ?? 0, lens.params);
      case 'random':
        return this.seededRandomPosition(nodeId, lens.params);
      case 'force':
        return this.forceDirectedPosition(nodeId, lens.params);
      default:
        return this.deterministicPosition(nodeId, index ?? 0);
    }
  }
  
  private deterministicPosition(nodeId: string, index: number): THREE.Vector3 {
    const hash = this.hashString(nodeId + this.seed);
    const angle = (hash % 360) * (Math.PI / 180);
    const radius = 10 + (hash % 50);
    const height = ((hash % 100) - 50) * 0.1;
    
    return new THREE.Vector3(
      Math.cos(angle) * radius,
      height,
      Math.sin(angle) * radius
    );
  }
  
  private gridPosition(
    index: number,
    params?: Record<string, any>
  ): THREE.Vector3 {
    const columns = params?.columns ?? 10;
    const spacing = params?.spacing ?? 5;
    
    const x = (index % columns) * spacing;
    const z = Math.floor(index / columns) * spacing;
    const y = params?.height ?? 0;
    
    return new THREE.Vector3(
      x - (columns * spacing) / 2,
      y,
      z - (columns * spacing) / 2
    );
  }
  
  private spiralPosition(
    index: number,
    params?: Record<string, any>
  ): THREE.Vector3 {
    const radiusStep = params?.radiusStep ?? 0.5;
    const angleStep = params?.angleStep ?? 0.3;
    const heightStep = params?.heightStep ?? 0.1;
    
    const angle = index * angleStep;
    const radius = index * radiusStep;
    const height = index * heightStep;
    
    return new THREE.Vector3(
      Math.cos(angle) * radius,
      height,
      Math.sin(angle) * radius
    );
  }
  
  private seededRandomPosition(
    nodeId: string,
    params?: Record<string, any>
  ): THREE.Vector3 {
    const hash = this.hashString(nodeId + this.seed);
    const range = params?.range ?? 100;
    
    const x = this.seededRandom(hash) * range - range / 2;
    const y = this.seededRandom(hash + 1) * range - range / 2;
    const z = this.seededRandom(hash + 2) * range - range / 2;
    
    return new THREE.Vector3(x, y, z);
  }
  
  private forceDirectedPosition(
    nodeId: string,
    params?: Record<string, any>
  ): THREE.Vector3 {
    const hash = this.hashString(nodeId + this.seed);
    const initialRadius = params?.initialRadius ?? 50;
    
    const angle = (hash % 360) * (Math.PI / 180);
    const phi = ((hash % 180) - 90) * (Math.PI / 180);
    
    return new THREE.Vector3(
      Math.cos(angle) * Math.cos(phi) * initialRadius,
      Math.sin(phi) * initialRadius,
      Math.sin(angle) * Math.cos(phi) * initialRadius
    );
  }
  
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
  
  private seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }
  
  setSeed(seed: number): void {
    this.seed = seed;
  }
}