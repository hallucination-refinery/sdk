type AddToastFunction = (message: string, variant: 'info' | 'success' | 'error', duration?: number) => void;
interface UseVoiceLoopProps {
    addToast: AddToastFunction;
}
interface UseVoiceLoopReturn {
    isListening: boolean;
    transcript: string | null;
    error: string | null;
    startListening: () => void;
    stopListening: () => void;
    commitAudio: () => void;
    browserSupportsSpeechRecognition: boolean;
}
declare const useVoiceLoop: ({ addToast }: UseVoiceLoopProps) => UseVoiceLoopReturn;
export default useVoiceLoop;
//# sourceMappingURL=useVoiceLoop.d.ts.map