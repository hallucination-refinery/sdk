export type EasingFunction = (t: number) => number;

export type TweenUpdater = (progress: number) => void;

export interface Tween {
  id: string;
  startTime: number;
  duration: number;
  updater: TweenUpdater;
  easing?: EasingFunction;
  onComplete?: () => void;
}

export interface TweenRegistry {
  add(
    id: string,
    updater: TweenUpdater,
    duration: number,
    easing?: EasingFunction,
    onComplete?: () => void
  ): void;
  
  tick(now: number): void;
  
  cancel(id: string): void;
}