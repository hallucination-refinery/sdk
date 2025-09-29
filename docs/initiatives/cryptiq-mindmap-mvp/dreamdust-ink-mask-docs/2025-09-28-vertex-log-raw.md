# 2025-09-28 Vertex Log Diagnostic — Raw Capture

## 1. Metadata

- Branch / PR: codex/instrument-vertex-positions-for-debugging (PR #245)
- Date & Time: 2025-09-28 10:47 PM ET
- Device & Browser: Chrome 128, M1 Pro MBP 16GB, 10-20 Safari tabs (including youtube videos), docker, claude desktop app, cursor etc. running
- URL: `http://localhost:3000/quiz/archetype-v1?pc=scene-02&debug=1&engine=sim&inkProbe=1&simProbe=1&simStats=1&inkStats=1&forceAlpha=1&vertexLog=1`
- Screenshot: docs/.../assets/2025-09-28-vertex-log.png

## 2. Terminal Session

```
 node  /workspace   codex/instrument-vertex-positions-for-debugging ? ⍟14  pnpm --filter cryptiq-mindmap-demo run start

> cryptiq-mindmap-demo@0.1.0 start /workspace/apps/cryptiq-mindmap-demo
> next start

   ▲ Next.js 15.3.5
   - Local:        http://localhost:3000
   - Network:      http://172.17.0.2:3000

 ✓ Starting...
 ✓ Ready in 1326ms
^C%
 node  /workspace   codex/instrument-vertex-positions-for-debugging ⍟14 
```

## 3. Run Notes

1. Load the URL above (flags ensure sim engine, forceAlpha, vertex logging, probes, stats).
2. Allow settle (~5s) until the cloud steadies.
3. **Attempted** short tap near the center → UI lag prevented the gesture from firing.
4. **Attempted** medium stroke across the canvas → no visible reaction, likely same lag.
5. Keep DevTools console open; `[vertex] samples` never emitted (no interaction captured).
6. After the failed interaction, captured a Chrome Performance trace (settle-only) to understand the lag.

## 4. Console Objects — `[vertex] samples`

```json
[]
```

_No `[vertex]` payload fired; the console never printed the expected sample array even after ~60 s with `vertexLog=1` enabled._

### 4.1 [PC] prebaked positions

```json
{
  "bytes": 3219888,
  "count": 268324,
  "sample": [
    -0.2320713847875595, -0.23154249787330627, 1.183864712715149, -0.22892270982265472,
    -0.22928693890571594, 1.1723296642303467
  ]
}
```

### 4.2 [PC] prebaked positions

```json
{
  "min": [-0.24537451565265656, -0.26912346482276917, 0.7519106268882751],
  "max": [0.2641647160053253, 0.20759183168411255, 1.515622615814209],
  "extent": [0.5095392316579819, 0.4767152965068817, 0.7637119889259338],
  "maxExtent": 0.7637119889259338,
  "scale": 1309.3941361407406,
  "radius": 500
}
```

### 4.3 [dreamdust] caps

```json
{
  "vertexInkOk": true,
  "floatOk": true,
  "aliasedPointSizeRange": [1, 511],
  "dpr": 1.7999999523162842,
  "dprClamp": 1.7999999523162842,
  "dprLimit": 1.8
}
```

### 4.4 [dreamdust] ink-tex bind (fires twice)

```json
[dreamdust] ink-tex bind
{
    "width": 256,
    "height": 256,
    "needsUpdate": false
}
```

### 4.5 [sim] metrics (first)

```json
{
  "min": 0,
  "max": 1.4432,
  "avg": 1.0756,
  "nanCount": 0,
  "infCount": 0,
  "samples": [
    1.2283, 1.3193, 1.3819, 1.3353, 1.284, 1.3027, 1.3812, 1.285, 1.4211, 1.242, 1.2574, 1.3898,
    1.411, 1.2493, 1.2513, 1.3931, 1.4369, 1.2484, 1.248, 1.3647, 1.4432, 1.2554, 1.2584, 1.3603,
    0.9825, 1.4384, 1.2778, 1.25, 0.9815, 1.4295, 1.2734, 1.2499, 1.276, 0.9995, 1.2512, 1.2416,
    1.2788, 1.1051, 1.2403, 1.2457, 1.2405, 1.2657, 1.2456, 0.8309, 1.2406, 1.2529, 1.2445, 0.8042,
    1.0797, 0.992, 0.9891, 0.7749, 1.0819, 0.9902, 0.9864, 0.7728, 0.7775, 0, 0, 0, 0, 0, 0, 0
  ],
  "texSize": [300, 299],
  "grid": 8
}
```

### 4.6 [sim] metrics (last)

```json
{
  "min": 0,
  "max": 1.5524,
  "avg": 0.982,
  "nanCount": 0,
  "infCount": 0,
  "samples": [
    0.8177, 1.5493, 0.8177, 0.8235, 1.5524, 1.5524, 0.8177, 1.5524, 0.8235, 0.8177, 1.5524, 1.5493,
    0.8177, 0.8235, 0.8235, 0.8235, 0.8177, 0.8235, 1.5524, 1.5493, 0.8235, 0.8235, 0.8177, 1.5493,
    0.8177, 0.8235, 0.8177, 1.5524, 0.8177, 1.5524, 1.5524, 0.8177, 0.8235, 0.8177, 0.8177, 0.8235,
    1.5524, 1.5493, 1.5493, 0.8177, 1.5524, 1.5493, 1.5524, 1.5524, 0.8177, 0.8235, 0.8177, 0.8235,
    0.8235, 0.8235, 0.8235, 1.5493, 1.5493, 1.5493, 0.8177, 0.8235, 0.8235, 0, 0, 0, 0, 0, 0, 0
  ],
  "texSize": [300, 299],
  "grid": 8
}
```

## 5. Observations (one-liners for later synthesis)

1. Difficult to describe.
2. The countdown begins, the screen is **extremely** laggy.
3. During the countdown the _same_ red cloud/cloth like object appears beneath the overlay and then it disappears; the countdown ends but the overlay _seemly_ remains (the countdown numbers disappear to be clear) and a label in the _center_ of the viewport (that I've never seen before) says "Draw what the first thing you see" (I'm doing this from memory, but it's the **exact** same text as the regular header for this screen)
4. The _same_ set of white specks/particles/cubes appear/disappear sequentially along a semi-circle down the lower left side of the viewport (_exactly_ like last time); however, I will note that the specks/particles/cubes _seem_ larger this time
5. After the final particle appears, the sides of the viewport started to glitch in like pink and greenish/blue, then the entire HUD disappears/reappears (screenshot taken here.)
6. Despite the flag and collector wiring, there were zero `[vertex]` console entries; telemetry still appears inactive.
7. `[PC] ink debug` / `[dreamdust] ink-latency` never fired—no gestures landed during this capture so ink telemetry is still untested.

- **Lag baseline:** The vertex logger run immediately before the perf trace did **not** include a successful tap/stroke due to FPS collapse.
- **Perf trace:** Collected a Chrome profiling session (settle only) after the run above; file stored at `perf-traces/2025-09-26-2330-vertex-log-baseline.json` (same branch + code state).

## 6. Screenshot Notes

- Saved at: docs/.../assets/2025-09-28-vertex-log.png
- Visual summary: See item `5.` in section `## 5. Observations (one-liners for later synthesis)` above.

## 7. Full Browser Log (optional)

```
161.4128f57827ee7dda.js:83 [PC] prebaked positions Objectbytes: 3219888count: 268324sample: (6) [-0.2320713847875595, -0.23154249787330627, 1.183864712715149, -0.22892270982265472, -0.22928693890571594, 1.1723296642303467][[Prototype]]: Object
161.4128f57827ee7dda.js:83 [PC] prebaked AABB Object
161.4128f57827ee7dda.js:83 [PC] prebaked PCA orientation applied
161.4128f57827ee7dda.js:83 [PC] prebaked present; using positions/colors, fallback images not required
161.4128f57827ee7dda.js:83 [PC] instances: 89441
page-9074fb2aef53556d.js:1 [dreamdust] caps ObjectaliasedPointSizeRange: (2) [1, 511]dpr: 1.7999999523162842dprClamp: 1.7999999523162842dprLimit: 1.8floatOk: truevertexInkOk: true[[Prototype]]: Object
page-9074fb2aef53556d.js:1 [dreamdust] caps-fanout { stage: true, context: true, host: true, metrics: true }
page-9074fb2aef53556d.js:1 [dreamdust] ink-tex bind Objectheight: 256needsUpdate: falsewidth: 256[[Prototype]]: Object
161.4128f57827ee7dda.js:83 [Dreamdust] ink-tex bind Objectheight: 256needsUpdate: falsewidth: 256[[Prototype]]: Object
161.4128f57827ee7dda.js:83 [PC] attach controls to <canvas data-engine=​"three.js r176" width=​"2280" height=​"1808" style=​"display:​ block;​ width:​ 1266.67px;​ height:​ 1004.44px;​ touch-action:​ auto;​ pointer-events:​ auto;​">​
161.4128f57827ee7dda.js:83 [Dreamdust] reveal start Objectduration: 2[[Prototype]]: Object
161.4128f57827ee7dda.js:83 [engine] sim on { count:89441, texSize:[300,299] }
161.4128f57827ee7dda.js:83 [dreamdust] bloom { enabled: false, strength: 0.2, radius: 0.4, threshold: 0.8 }
161.4128f57827ee7dda.js:83 [engine] sim fit { radius:0.382, center:[0.01,-0.03,1.13] }
161.4128f57827ee7dda.js:83 [sim] metrics Objectavg: 1.0756grid: 8infCount: 0max: 1.4432min: 0nanCount: 0samples: (64) [1.2283, 1.3193, 1.3819, 1.3353, 1.284, 1.3027, 1.3812, 1.285, 1.4211, 1.242, 1.2574, 1.3898, 1.411, 1.2493, 1.2513, 1.3931, 1.4369, 1.2484, 1.248, 1.3647, 1.4432, 1.2554, 1.2584, 1.3603, 0.9825, 1.4384, 1.2778, 1.25, 0.9815, 1.4295, 1.2734, 1.2499, 1.276, 0.9995, 1.2512, 1.2416, 1.2788, 1.1051, 1.2403, 1.2457, 1.2405, 1.2657, 1.2456, 0.8309, 1.2406, 1.2529, 1.2445, 0.8042, 1.0797, 0.992, 0.9891, 0.7749, 1.0819, 0.9902, 0.9864, 0.7728, 0.7775, 0, 0, 0, 0, 0, 0, 0]texSize: (2) [300, 299][[Prototype]]: Object
161.4128f57827ee7dda.js:83 [sim] metrics Object
161.4128f57827ee7dda.js:83 [Dreamdust] reveal end Object
161.4128f57827ee7dda.js:83 [sim] metrics Object
161.4128f57827ee7dda.js:83 [sim] metrics Object
161.4128f57827ee7dda.js:83 [sim] metrics Object
161.4128f57827ee7dda.js:83 [sim] metrics Object
161.4128f57827ee7dda.js:83 [sim] metrics Object
161.4128f57827ee7dda.js:83 [sim] metrics Object
161.4128f57827ee7dda.js:83 [sim] metrics Object
161.4128f57827ee7dda.js:83 [sim] metrics Object
161.4128f57827ee7dda.js:83 [sim] metrics Object
161.4128f57827ee7dda.js:83 [sim] metrics Object
161.4128f57827ee7dda.js:83 [sim] metrics Object
161.4128f57827ee7dda.js:83 [sim] metrics Object
161.4128f57827ee7dda.js:83 [sim] metrics Object
161.4128f57827ee7dda.js:83 [sim] metrics Object
161.4128f57827ee7dda.js:83 [sim] metrics Object
161.4128f57827ee7dda.js:83 [sim] metrics Object
161.4128f57827ee7dda.js:83 [sim] metrics Object
161.4128f57827ee7dda.js:83 [sim] metrics Object
161.4128f57827ee7dda.js:83 [sim] metrics Object
161.4128f57827ee7dda.js:83 [sim] metrics Object
161.4128f57827ee7dda.js:83 [sim] metrics Object
161.4128f57827ee7dda.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 0.982, nanCount: 0, infCount: 0, …}
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
161.4128f57827ee7dda.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 0.982, nanCount: 0, infCount: 0, …}
161.4128f57827ee7dda.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 0.982, nanCount: 0, infCount: 0, …}
161.4128f57827ee7dda.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 0.982, nanCount: 0, infCount: 0, …}
161.4128f57827ee7dda.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 0.982, nanCount: 0, infCount: 0, …}
161.4128f57827ee7dda.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 0.982, nanCount: 0, infCount: 0, …}
161.4128f57827ee7dda.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 0.982, nanCount: 0, infCount: 0, …}
161.4128f57827ee7dda.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 0.982, nanCount: 0, infCount: 0, …}
161.4128f57827ee7dda.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 0.982, nanCount: 0, infCount: 0, …}
161.4128f57827ee7dda.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 0.982, nanCount: 0, infCount: 0, …}
161.4128f57827ee7dda.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 0.982, nanCount: 0, infCount: 0, …}
161.4128f57827ee7dda.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 0.982, nanCount: 0, infCount: 0, …}
161.4128f57827ee7dda.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 0.982, nanCount: 0, infCount: 0, …}
161.4128f57827ee7dda.js:83 [sim] metrics {min: 0, max: 1.5524, avg: 0.982, nanCount: 0, infCount: 0, …}avg: 0.982grid: 8infCount: 0max: 1.5524min: 0nanCount: 0samples: (64) [0.8177, 1.5493, 0.8177, 0.8235, 1.5524, 1.5524, 0.8177, 1.5524, 0.8235, 0.8177, 1.5524, 1.5493, 0.8177, 0.8235, 0.8235, 0.8235, 0.8177, 0.8235, 1.5524, 1.5493, 0.8235, 0.8235, 0.8177, 1.5493, 0.8177, 0.8235, 0.8177, 1.5524, 0.8177, 1.5524, 1.5524, 0.8177, 0.8235, 0.8177, 0.8177, 0.8235, 1.5524, 1.5493, 1.5493, 0.8177, 1.5524, 1.5493, 1.5524, 1.5524, 0.8177, 0.8235, 0.8177, 0.8235, 0.8235, 0.8235, 0.8235, 1.5493, 1.5493, 1.5493, 0.8177, 0.8235, 0.8235, 0, 0, 0, 0, 0, 0, 0]texSize: (2) [300, 299][[Prototype]]: Object
```

## 8. Perf Trace (settle-only)

- File: `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/perf-traces/2025-09-26-2330-vertex-log-baseline.json`
- Context: Captured immediately after this run while the scene sat idle with `vertexLog=1`; no gestures were executed during the trace.
- Frame pacing: 140 `BeginMainThreadFrame` events with inter-frame median ≈ 51 ms, p90 ≈ 66 ms, and max ≈ 134 ms (computed via Node script in `/workspace`).
- Long tasks: 431 main-thread slices exceeded 16 ms, dominated by `RunTask` → `FireAnimationFrame` → `PageAnimator::serviceScriptedAnimations` chains (~132 ms each), matching the DevTools `requestAnimationFrame` violation spam recorded above.

```bash
node - <<'NODE'
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/perf-traces/2025-09-26-2330-vertex-log-baseline.json', 'utf8'));
const frames = data.traceEvents.filter(e => e.name === 'BeginMainThreadFrame').sort((a,b)=>a.ts-b.ts);
const intervals = frames.slice(1).map((f,i)=> (f.ts - frames[i].ts)/1000);
const sorted = [...intervals].sort((a,b)=>a-b);
const p = q => sorted[Math.floor(sorted.length*q)];
console.log({
  frameCount: frames.length,
  medianMs: sorted[Math.floor(sorted.length/2)],
  p90Ms: p(0.9),
  maxMs: sorted[sorted.length-1]
});
const long = data.traceEvents.filter(e => e.ph === 'X' && e.pid === 87534 && e.tid === 14359223 && e.dur > 16000);
console.log({ longTasks: long.length, topSample: long[0]?.name, topDurMs: (long[0]?.dur||0)/1000 });
NODE
```
