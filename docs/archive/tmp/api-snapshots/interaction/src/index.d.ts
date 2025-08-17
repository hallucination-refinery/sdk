export declare const __interaction_placeholder = true;
export { InteractionProvider } from './InteractionProvider';
export { useInteractionState, useInteractionDispatch, } from './InteractionProvider';
export { parseDialParams, updateUrlFromDial } from './InteractionProvider';
export type { InteractionState, InteractionAction } from './types';
export * from './reducer';
export * from './useKeyboardInput';
export * from './usePointerInput';
export * from './useGestureInput';
export * from './constants';
export { expandChoreo } from './useCameraChoreo';
import type { InteractionAction as IA } from './types';
export declare const setActiveLens: (lens: "causal" | "affinity" | "temporal") => IA;
export declare const setTimeIndex: (index: number) => IA;
export declare const setTimelineDate: (date: string) => IA;
export { useActiveLens } from './InteractionProvider';
export { useTimeIndex } from './InteractionProvider';
//# sourceMappingURL=index.d.ts.map