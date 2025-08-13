import type { NodeData } from '../types';
import type { TweenRegistry } from './TweenRegistry';
import type * as THREE from 'three';

export interface NodeAttributeManager {
  updatePosition(nodeId: string, x: number, y: number, z: number): void;
  updateColor(nodeId: string, color: string): void;
  updateOpacity(nodeId: string, opacity: number): void;
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

export type RunBurst = (config: BurstAnimationConfig) => void;