/**
 * @file eventMux.ts
 * Centralized hub for processing and distributing normalized input events.
 */
export type InputEvent = {
    type: 'WHEEL';
    delta: number;
    rawEvent: WheelEvent;
} | {
    type: 'PINCH_ROTATE';
    deltaX: number;
    deltaY: number;
    rawEvent: MouseEvent;
} | {
    type: 'KEY_DOWN';
    key: string;
    rawEvent: KeyboardEvent;
} | {
    type: 'HAND_POSITION';
    x: number;
    y: number;
    pinched: boolean;
} | {
    type: 'VOICE';
    cmd: string;
    targetId?: string | null;
    details?: unknown;
};
export type InputListener = (event: InputEvent) => void;
/**
 * Registers a listener function to receive input events.
 * @param listener The function to call when an event is emitted.
 * @returns A function to unregister the listener.
 */
export declare function addInputListener(listener: InputListener): () => void;
/**
 * Emits an input event to all registered listeners.
 * @param event The input event to emit.
 */
export declare function emit(event: InputEvent): void;
export declare function globalEmit(event: InputEvent): void;
//# sourceMappingURL=eventMux.d.ts.map