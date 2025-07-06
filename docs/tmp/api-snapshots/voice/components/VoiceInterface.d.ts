import type { InteractionState } from '@refinery/interaction';
interface VoiceInterfaceProps {
    className?: string;
    interactionDispatch?: (action: {
        type: string;
        payload?: unknown;
    }) => void;
    addToast?: (message: string, type: 'success' | 'error' | 'info', duration?: number) => void;
    interactionState?: InteractionState;
}
export declare function VoiceInterface({ className, interactionDispatch, addToast, interactionState, }: VoiceInterfaceProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=VoiceInterface.d.ts.map