# 2025-10-13 — Ink Latch + Inkboost Smoke (Raw)

Environment
- URL (first pass): `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&debug=1&falloff=1`
- URL (second pass): `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&debug=1&falloff=1&inkboost=1.8`
- Server: next start (prod build)

Sequence
1) Waited for `[Dreamdust] reveal end` and saw `[PC] falloff latch recheck applied` (before drawing).
2) Began probe and ran `window.dreamdust.ensureFalloff()`.
3) Drew multiple strokes quickly; minimal/no motion first pass; slight local motion second pass with `&inkboost=1.8`.
4) Stopped probe and copied uniform dumps.

Observations (summary)
- `uTempFalloffOn` did become 1.
- `uTempCenter` tracked pointer UV.
- `uTempRadius` ~0.16.
- `uTempIntensity` rose during stroke and decayed after.
- Visual: first pass mostly unreactive; second pass showed slight local displacement near cursor.

---

## STROKES LOG EXCERPT 1 (first pass; falloff=1)

```
window._probe = setInterval(() => window.dreamdust.dumpUniforms(), 100)
window.dreamdust.ensureFalloff()
[dreamdust uniforms] {uTempForce: Array(2), uTempIntensity: 0, uTempCenter: Array(2), uTempRadius: 0.16, uTempFalloffOn: 1}
...
[PC] draw start
[PC] ink tex updated
[dreamdust uniforms] {uTempForce: Array(2), uTempIntensity: 0.0245, uTempCenter: Array(2), uTempRadius: 0.16, uTempFalloffOn: 1}
[dreamdust uniforms] {uTempForce: Array(2), uTempIntensity: 0.0800, ...}
[dreamdust uniforms] {uTempForce: Array(2), uTempIntensity: 0.1260, ...}
...
[PC] draw end { type: 'stroke', durationMs: 2336.3, distancePx: 3765.7 }
[dreamdust uniforms] {uTempForce: Array(2), uTempIntensity: 0.00186, ...}
...
```

## STROKE LOG EXCERPT 2 (second pass; falloff=1&inkboost=1.8)

```
window._probe = setInterval(() => window.dreamdust.dumpUniforms(), 100)
[dreamdust uniforms] {uTempForce: Array(2), uTempIntensity: 0, ..., uTempFalloffOn: 0}
window.dreamdust.ensureFalloff()
[dreamdust uniforms] {uTempForce: Array(2), uTempIntensity: 0, ..., uTempFalloffOn: 1}
...
[PC] draw start
[PC] ink tex updated
[dreamdust uniforms] {uTempForce: Array(2), uTempIntensity: 0.2024, ...}
[dreamdust uniforms] {uTempForce: Array(2), uTempIntensity: 0.245.. → 0.30.. → up to 1.0 (several frames), ...}
...
[PC] draw end { type: 'stroke', durationMs: 6467.9, distancePx: 16549.1 }
[dreamdust uniforms] {uTempForce: Array(2), uTempIntensity: 0.0115 → 0.00013 → 0, ...}
```

Notes
- Evidence confirms latch ON, live center/radius, and rising intensity under stroke; slight local motion observed only with `&inkboost`.
- Implication: the localized vertex offset executes, but baseline displacement feels too small at Scene‑03 camera distance without boost.


