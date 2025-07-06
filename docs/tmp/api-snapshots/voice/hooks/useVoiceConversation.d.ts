import { InteractionState } from '@refinery/interaction';
export interface PendingAction {
    type: 'expand' | 'focus';
    nodeId: string;
    nodeLabel: string;
}
export interface UseVoiceConversationOptions {
    interactionDispatch?: (action: {
        type: string;
        payload?: unknown;
    }) => void;
    addToast?: (message: string, type: 'success' | 'error' | 'info', duration?: number) => void;
    interactionState?: InteractionState;
}
export declare function useVoiceConversation(options?: UseVoiceConversationOptions): {
    startConversation: () => Promise<void>;
    stopConversation: () => void;
    isConnected: boolean;
    pendingAction: PendingAction | null;
    highlightedNodeId: string | null;
    confirmAction: () => void;
    cancelAction: () => void;
    status: import("@elevenlabs/react").Status;
    isSpeaking: boolean;
};
//# sourceMappingURL=useVoiceConversation.d.ts.map