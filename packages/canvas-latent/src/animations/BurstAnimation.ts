import type { NodeData } from '../types';
import type { TweenRegistry } from './TweenRegistry';
import type * as THREE from 'three';
import { BURST_DURATION } from '../constants';
import { lerp3 } from '../utils/Interpolation';

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

let isBurstComplete = false;
let isAnimating = false;

export function runBurst(config: BurstAnimationConfig): void {
  // Ensure burst runs exactly once
  if (isBurstComplete || isAnimating) {
    return;
  }

  const {
    nodes,
    getTarget,
    manager,
    registry,
    duration = BURST_DURATION
  } = config;

  // Mark as animating to block interactions
  isAnimating = true;

  // Store initial positions and target positions for each node
  const nodeAnimations = nodes.map(node => {
    const origin = {
      x: node.position.x,
      y: node.position.y,
      z: node.position.z
    };
    const target = getTarget(node);
    return {
      nodeId: node.id,
      origin,
      target: {
        x: target.x,
        y: target.y,
        z: target.z
      }
    };
  });

  // Create tween for burst animation
  registry.add(
    'burst-animation',
    (progress: number) => {
      // Update all node positions using linear interpolation
      nodeAnimations.forEach(({ nodeId, origin, target }) => {
        const interpolated = lerp3(origin, target, progress);
        manager.setPosition(nodeId, interpolated as any);
      });
    },
    duration,
    undefined, // Use default easing
    () => {
      // Completion callback
      isAnimating = false;
      isBurstComplete = true;
    }
  );
}

export function isInteractionBlocked(): boolean {
  return isAnimating;
}

export function resetBurstState(): void {
  isBurstComplete = false;
  isAnimating = false;
}