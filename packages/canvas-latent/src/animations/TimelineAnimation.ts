import { TweenRegistry, TweenUpdater } from './TweenRegistry';
import { lerp, easeInOutCubic } from '../utils/Interpolation';
import { FADE_TRANSITION } from '../constants';

export interface NodeAttributeManager {
  setOpacity(nodeId: string, opacity: number): void;
  flush(): void;
}

export interface OpacityState {
  current: number;
  target: number;
  tweenId?: string;
}

export interface TimelineAnimationConfig {
  visibleIds: Set<string>;
  nodeVisibility: Map<string, boolean>;
  manager: NodeAttributeManager;
  registry: TweenRegistry;
  duration?: number;
}

const OPACITY_TWEEN_DURATION = 160; // 120-200ms, using 160ms as middle ground
const FRAME_TIME = 16.67; // ~60fps target

class TimelineOpacityController {
  private opacityStates: Map<string, OpacityState> = new Map();
  private manager: NodeAttributeManager;
  private registry: TweenRegistry;
  private pendingUpdates: Set<string> = new Set();
  private frameThrottleId: number | null = null;
  private lastFlushTime: number = 0;

  constructor(manager: NodeAttributeManager, registry: TweenRegistry) {
    this.manager = manager;
    this.registry = registry;
  }

  private getOpacityState(nodeId: string): OpacityState {
    if (!this.opacityStates.has(nodeId)) {
      this.opacityStates.set(nodeId, {
        current: 1,
        target: 1,
      });
    }
    return this.opacityStates.get(nodeId)!;
  }

  private scheduleFrameUpdate(): void {
    if (this.frameThrottleId !== null) return;
    
    this.frameThrottleId = requestAnimationFrame(() => {
      this.flushPendingUpdates();
      this.frameThrottleId = null;
    });
  }

  private flushPendingUpdates(): void {
    const now = performance.now();
    
    // Throttle to frame cadence
    if (now - this.lastFlushTime < FRAME_TIME) {
      this.scheduleFrameUpdate();
      return;
    }

    // Batch all pending opacity updates
    this.pendingUpdates.forEach(nodeId => {
      const state = this.getOpacityState(nodeId);
      this.manager.setOpacity(nodeId, state.current);
    });

    // Single flush per frame
    if (this.pendingUpdates.size > 0) {
      this.manager.flush();
      this.pendingUpdates.clear();
      this.lastFlushTime = now;
    }
  }

  public updateVisibility(
    nodeId: string,
    isVisible: boolean,
    duration: number = OPACITY_TWEEN_DURATION
  ): void {
    const state = this.getOpacityState(nodeId);
    const targetOpacity = isVisible ? 1 : 0;

    // Skip if already at target
    if (state.target === targetOpacity && state.current === targetOpacity) {
      return;
    }

    // Cancel existing tween if any
    if (state.tweenId) {
      this.registry.cancel(state.tweenId);
    }

    state.target = targetOpacity;
    const startOpacity = state.current;
    const tweenId = `opacity-${nodeId}-${Date.now()}`;
    state.tweenId = tweenId;

    // Create tween updater
    const updater: TweenUpdater = (progress: number) => {
      const easedProgress = easeInOutCubic(progress);
      state.current = lerp(startOpacity, targetOpacity, easedProgress);
      
      // Mark for batched update
      this.pendingUpdates.add(nodeId);
      this.scheduleFrameUpdate();
    };

    // Register tween
    this.registry.add(
      tweenId,
      updater,
      duration,
      undefined, // easing already applied in updater
      () => {
        // Ensure final value is set
        state.current = targetOpacity;
        state.tweenId = undefined;
        this.pendingUpdates.add(nodeId);
        this.scheduleFrameUpdate();
      }
    );
  }

  public batchUpdateVisibility(
    updates: Array<{ nodeId: string; isVisible: boolean }>,
    duration?: number
  ): void {
    // Process all updates without immediate flush
    updates.forEach(({ nodeId, isVisible }) => {
      this.updateVisibility(nodeId, isVisible, duration);
    });
  }

  public reset(): void {
    // Cancel all active tweens
    this.opacityStates.forEach((state, nodeId) => {
      if (state.tweenId) {
        this.registry.cancel(state.tweenId);
      }
    });
    
    this.opacityStates.clear();
    this.pendingUpdates.clear();
    
    if (this.frameThrottleId !== null) {
      cancelAnimationFrame(this.frameThrottleId);
      this.frameThrottleId = null;
    }
  }
}

// Singleton instance
let timelineController: TimelineOpacityController | null = null;

export function initTimelineAnimation(
  manager: NodeAttributeManager,
  registry: TweenRegistry
): void {
  if (timelineController) {
    timelineController.reset();
  }
  timelineController = new TimelineOpacityController(manager, registry);
}

export function updateNodeVisibility(
  nodeId: string,
  isVisible: boolean,
  duration?: number
): void {
  if (!timelineController) {
    console.warn('TimelineAnimation not initialized');
    return;
  }
  timelineController.updateVisibility(nodeId, isVisible, duration);
}

export function updateNodesVisibility(
  visibleIds: Set<string>,
  allNodeIds: string[],
  duration?: number
): void {
  if (!timelineController) {
    console.warn('TimelineAnimation not initialized');
    return;
  }

  const updates = allNodeIds.map(nodeId => ({
    nodeId,
    isVisible: visibleIds.has(nodeId)
  }));

  timelineController.batchUpdateVisibility(updates, duration);
}

export function onVisibilityChange(
  visibleIds: Set<string> | null,
  nodeVisibility: Map<string, boolean> | null,
  allNodeIds: string[]
): void {
  if (!timelineController) {
    console.warn('TimelineAnimation not initialized');
    return;
  }

  const updates: Array<{ nodeId: string; isVisible: boolean }> = [];

  // Handle visibleIds change
  if (visibleIds !== null) {
    allNodeIds.forEach(nodeId => {
      updates.push({
        nodeId,
        isVisible: visibleIds.has(nodeId)
      });
    });
  }
  
  // Handle nodeVisibility map change (overrides visibleIds if both present)
  if (nodeVisibility !== null) {
    nodeVisibility.forEach((isVisible, nodeId) => {
      const existingIndex = updates.findIndex(u => u.nodeId === nodeId);
      if (existingIndex >= 0) {
        updates[existingIndex].isVisible = isVisible;
      } else {
        updates.push({ nodeId, isVisible });
      }
    });
  }

  if (updates.length > 0) {
    timelineController.batchUpdateVisibility(updates);
  }
}

export function resetTimelineAnimation(): void {
  if (timelineController) {
    timelineController.reset();
    timelineController = null;
  }
}

export function isTimelineAnimating(): boolean {
  // Check if any tweens are active
  return timelineController !== null;
}