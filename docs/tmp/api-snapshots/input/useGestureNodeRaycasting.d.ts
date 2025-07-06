export interface UseGestureNodeRaycastingOpts {
    enabled?: boolean;
}
export declare function useGestureNodeRaycasting(opts?: UseGestureNodeRaycastingOpts): {
    performRaycast: () => string | null;
    currentGesturePosition: {
        x: number;
        y: number;
    };
};
//# sourceMappingURL=useGestureNodeRaycasting.d.ts.map