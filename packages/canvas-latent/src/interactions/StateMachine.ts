export enum InteractionState {
  Idle = 'Idle',
  Highlighting = 'Highlighting',
  Selected = 'Selected',
  Morphing = 'Morphing',
  Fading = 'Fading',
}

export type StateTransition = {
  from: InteractionState;
  to: InteractionState;
  guard?: () => boolean;
};

export interface TransitionMap {
  [key: string]: StateTransition[];
}

export const INTERACTION_TRANSITIONS: TransitionMap = {
  [InteractionState.Idle]: [
    { from: InteractionState.Idle, to: InteractionState.Highlighting },
    { from: InteractionState.Idle, to: InteractionState.Selected },
    { from: InteractionState.Idle, to: InteractionState.Morphing },
  ],
  [InteractionState.Highlighting]: [
    { from: InteractionState.Highlighting, to: InteractionState.Idle },
    { from: InteractionState.Highlighting, to: InteractionState.Selected },
    { 
      from: InteractionState.Highlighting, 
      to: InteractionState.Morphing,
      guard: () => false, // interactions disabled during Morphing
    },
  ],
  [InteractionState.Selected]: [
    { from: InteractionState.Selected, to: InteractionState.Idle },
    { from: InteractionState.Selected, to: InteractionState.Highlighting },
    { 
      from: InteractionState.Selected, 
      to: InteractionState.Morphing,
      guard: () => false, // interactions disabled during Morphing
    },
    { from: InteractionState.Selected, to: InteractionState.Fading },
  ],
  [InteractionState.Morphing]: [
    { from: InteractionState.Morphing, to: InteractionState.Idle },
    { from: InteractionState.Morphing, to: InteractionState.Fading },
  ],
  [InteractionState.Fading]: [
    { from: InteractionState.Fading, to: InteractionState.Idle },
  ],
};

export interface StateMachine {
  currentState: InteractionState;
  canTransitionTo(nextState: InteractionState): boolean;
  transitionTo(nextState: InteractionState): void;
}