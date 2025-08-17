import { InteractionAction } from '@refinery/interaction';
type DialAction = Extract<InteractionAction, {
    type: 'SET_DIAL_STATE';
}>;
interface XYPadProps {
    dispatch?: (action: DialAction) => void;
}
export interface DialSnapResult {
    mode: 0 | 1 | 2;
    depth: 1 | 2 | 3;
    position: {
        x: number;
        y: number;
    };
    isCenter: boolean;
}
export declare function dialSnap(position: {
    x: number;
    y: number;
}): DialSnapResult;
export default function XYPad({ dispatch: dispatchProp }: XYPadProps): import("react/jsx-runtime").JSX.Element;
export {};
