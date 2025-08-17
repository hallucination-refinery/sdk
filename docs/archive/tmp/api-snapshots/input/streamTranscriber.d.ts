export declare class StreamTranscriber extends EventTarget {
    private coreLinkUrl;
    private whisperEndpoint;
    private lastPartial;
    private lastDispatch;
    constructor(coreLinkUrl: string, whisperEndpoint: string);
    connect(stream: MediaStream): void;
    private startCoreLink;
    private startWhisper;
    private handleTranscript;
}
//# sourceMappingURL=streamTranscriber.d.ts.map