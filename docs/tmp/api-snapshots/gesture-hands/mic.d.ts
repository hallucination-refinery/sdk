/**
 * README: Analyze microphone input RMS and approximate VAD.
 *
 * Uses WebAudio `AnalyserNode` with a 512-sample FFT to sample mic
 * volume for roughly one second. RMS is the root mean square
 * amplitude across all frames. `speechProb` is the fraction of frames
 * where the frame RMS exceeds -45 dBFS.
 */
export declare function analyzeMic(stream: MediaStream): Promise<{
    rms: number;
    speechProb: number;
}>;
//# sourceMappingURL=mic.d.ts.map