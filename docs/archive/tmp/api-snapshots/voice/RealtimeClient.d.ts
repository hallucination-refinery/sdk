export interface RealtimeClientOpts {
    /** WebSocket proxy URL, defaults to 'ws://localhost:3000/api/voice-ws' */
    proxyUrl?: string;
}
export interface TranscriptEvent extends CustomEvent<{
    text: string;
}> {
    readonly type: 'transcript';
}
export interface AudioEvent extends CustomEvent<{
    data: ArrayBuffer;
}> {
    readonly type: 'audio';
}
declare global {
    interface WindowEventMap {
        transcript: TranscriptEvent;
        audio: AudioEvent;
    }
}
export declare class RealtimeClient extends EventTarget {
    private socket;
    private proxyUrl;
    private audioCtx;
    private source;
    private processor;
    private isSessionReady;
    private canStreamAudio;
    private audioBuffer;
    private sessionId;
    constructor(opts?: RealtimeClientOpts);
    connect(stream: MediaStream): Promise<void>;
    private startAudioStream;
    private convertToPCM16;
    private arrayBufferToBase64;
    private base64ToArrayBuffer;
    close(): void;
    commitAudioBuffer(): void;
    private cleanupAudio;
    private flushBufferedAudio;
}
//# sourceMappingURL=RealtimeClient.d.ts.map