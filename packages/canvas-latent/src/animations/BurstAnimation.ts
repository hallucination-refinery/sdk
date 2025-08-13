import type { NodeData } from '../types';
import type { TweenRegistry } from './TweenRegistry';
import type * as THREE from 'three';

// NodeAttributeManager will be imported from core when available
// For now, defining the expected interface
export interface NodeAttributeManager {
  setPosition(nodeId: string, position: THREE.Vector3): void;
  setOpacity(nodeId: string, opacity: number): void;
  setColor(nodeId: string, color: THREE.Color): void;
  setSelected(nodeId: string, selected: boolean): void;
}

export interface BurstAnimationConfig {
  nodes: NodeData[];
  getTarget: (node: NodeData) => THREE.Vector3;
  manager: NodeAttributeManager;
  registry: TweenRegistry;
  now: () => number;
  duration?: number;
}

export function runBurst(_config: BurstAnimationConfig): void {
  // Interface only - no implementation logic
}