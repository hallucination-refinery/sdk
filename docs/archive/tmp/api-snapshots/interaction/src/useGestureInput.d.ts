interface HandPositionUpdateEvent extends CustomEvent {
    detail: {
        x: number;
        y: number;
        pinched: boolean;
    };
}
declare global {
    interface WindowEventMap {
        handPositionUpdate: HandPositionUpdateEvent;
    }
}
export declare function useGestureInput(): {};
export {};
//# sourceMappingURL=useGestureInput.d.ts.map