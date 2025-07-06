import { NormalizedLandmark } from '@mediapipe/tasks-vision';
export interface HandPositionUpdateEvent extends CustomEvent {
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
export interface UseMediaPipeHandsOpts {
    /** optional: external video element (eg. hidden <video>) */
    videoRef?: React.RefObject<HTMLVideoElement | null>;
    pinchThresholdRatio?: number;
}
export interface UseMediaPipeHandsOutput {
    ready: boolean;
    latestLandmarks: NormalizedLandmark[][] | null;
}
export declare function useMediaPipeHands(opts?: UseMediaPipeHandsOpts): UseMediaPipeHandsOutput;
//# sourceMappingURL=useMediaPipeHands.d.ts.map