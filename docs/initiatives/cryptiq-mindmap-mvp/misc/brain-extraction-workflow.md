## 3dbrain Reference — Orchestrator Runbook (Isolated Dev Run Only)

Objective

- Start the existing vendor demo at `vendor/3dbrain` in isolation and verify it serves the page (no adaptation/porting; no changes outside `vendor/3dbrain/`).

Scope (explicit)

- In: install in vendor only, minimal runtime compatibility shim if required, start dev server, basic health check (HTTP 200).
- Out: any edits to `apps/cryptiq-mindmap-demo`, workspace-wide installs/builds, or visual extraction/porting.

Preconditions

- The repository has already been cloned at `vendor/3dbrain`.
- Port 8080 is available (or change PORT below).

Steps (non-interactive; safe to re-run)

1. Guard isolation and record provenance

- Do NOT add `vendor/3dbrain` to `pnpm-workspace.yaml`.
- Create vendor-local npm config to avoid workspace coupling:

```bash
printf "ignore-workspace=true\nlink-workspace-packages=false\nshared-workspace-lockfile=false\n" > vendor/3dbrain/.npmrc
git -C vendor/3dbrain rev-parse HEAD > vendor/3dbrain/COMMIT.txt
```

2. Install legacy dependencies (isolated)

```bash
pnpm --dir vendor/3dbrain install --ignore-workspace
```

3. Compatibility shim (only if particles crash occurs)

- Known error: `bas.module.js:1621 TypeError: this.setAttribute is not a function` (three r91 vs three-bas).
- Inject a small shim at runtime before app code executes:

```bash
cat > vendor/3dbrain/src/__shim__.js <<'EOF'
if (typeof window !== 'undefined' && window.THREE && window.THREE.BufferGeometry) {
  var BG = window.THREE.BufferGeometry.prototype;
  if (!BG.setAttribute && BG.addAttribute) {
    BG.setAttribute = BG.addAttribute;
  }
}
EOF

# Ensure the shim is imported first in the entry file (idempotent)
grep -q "__shim__" vendor/3dbrain/src/app.js || sed -i '1s;^;import "./__shim__";\n;' vendor/3dbrain/src/app.js
```

4. Run dev server (default port 8080)

```bash
pnpm --dir vendor/3dbrain dev
```

5. Health check (basic success criteria)

```bash
# wait for dev server to boot, then assert HTTP 200
curl -sSf http://localhost:8080/ > /dev/null
```

Acceptance (v0)

- Install step completes without workspace-wide scope.
- Dev server reports "Compiled successfully" and responds 200 at `http://localhost:8080/`.
- No edits occurred outside `vendor/3dbrain/`.

Notes

- This runbook exists solely to stand up the vendor demo for visual/code reference. Create a separate workflow for any extraction or porting after the reference is viewable.

---

### Notes

- Proven capability: The previous orchestrated run implemented all sessions with only last‑mile wiring and a relaxed vertex threshold. Primary bottlenecks are infra/scaffolding—not Claude’s implementation breadth.
- This workflow is deliberately small and measurable: no speculative edits, every step yields a concrete artifact or gate.

---

## BROWSER LOG

```
Navigated to http://localhost:8080/
app.js:3013 [HMR] Waiting for update signal from WDS...
AbstractApplication.js:31 THREE.WebGLRenderer 91
OBJLoader.js:781 OBJLoader: 155.236083984375 ms
three.module.js:31182 [Violation] 'load' handler took 158ms
Loaders.js:32 loading Complete!
bas.module.js:1621 Uncaught TypeError: this.setAttribute is not a function
    at PointBufferGeometry.createAttribute (bas.module.js:1621:10)
    at PointBufferGeometry.bufferPositions (bas.module.js:1605:10)
    at new PointBufferGeometry (bas.module.js:1601:10)
    at ParticleSystem.init (particlesSystem.js:37:1)
    at new ParticleSystem (particlesSystem.js:11:1)
    at MainBrain.addParticlesSystem (MainBrain.js:254:1)
    at MainBrain.runAnimation (MainBrain.js:196:1)
    at Loaders.handlerLoad (Loaders.js:33:1)
    at LoadingManager.itemEnd (three.module.js:30976:11)
    at HTMLImageElement.eval (three.module.js:31596:18)
createAttribute @ bas.module.js:1621
bufferPositions @ bas.module.js:1605
PointBufferGeometry @ bas.module.js:1601
init @ particlesSystem.js:37
ParticleSystem @ particlesSystem.js:11
addParticlesSystem @ MainBrain.js:254
runAnimation @ MainBrain.js:196
handlerLoad @ Loaders.js:33
LoadingManager.itemEnd @ three.module.js:30976
eval @ three.module.js:31596
MainBrain.js:128 Uncaught TypeError: Cannot read properties of undefined (reading 'transform')
    at TweenMax.onStart (MainBrain.js:128:1)
    at p._callback (TweenLite.js:582:22)
    at p.render (TweenMaxBase.js:302:11)
    at _internals.lazyRender (TweenLite.js:1132:13)
    at Animation._updateRoot.TweenLite.render (TweenLite.js:1152:6)
    at p.dispatchEvent (TweenLite.js:287:19)
    at _tick (TweenLite.js:339:13)
onStart @ MainBrain.js:128
p._callback @ TweenLite.js:582
p.render @ TweenMaxBase.js:302
_internals.lazyRender @ TweenLite.js:1132
Animation._updateRoot.TweenLite.render @ TweenLite.js:1152
p.dispatchEvent @ TweenLite.js:287
_tick @ TweenLite.js:339
requestAnimationFrame
_tick @ TweenLite.js:336
_self.wake @ TweenLite.js:385
eval @ TweenLite.js:438
eval @ TweenLite.js:899
TweenMax @ TweenMaxBase.js:45
TweenMax.fromTo @ TweenMaxBase.js:361
startIntro @ MainBrain.js:117
eval @ MainBrain.js:39
setTimeout
MainBrain @ MainBrain.js:38
eval @ app.js:5
./src/app.js @ app.js:3050
__webpack_require__ @ app.js:679
fn @ app.js:89
0 @ app.js:3229
__webpack_require__ @ app.js:679
(anonymous) @ app.js:725
(anonymous) @ app.js:728
```

## BROWSER LOG 2

```
Navigated to http://localhost:8080/
app.js:3013 [HMR] Waiting for update signal from WDS...
AbstractApplication.js:31 THREE.WebGLRenderer 91
OBJLoader.js:781 OBJLoader: 237.671875 ms
three.module.js:31182 [Violation] 'load' handler took 244ms
Loaders.js:32 loading Complete!
bas.module.js:1621 Uncaught TypeError: this.setAttribute is not a function
at PointBufferGeometry.createAttribute (bas.module.js:1621:10)
at PointBufferGeometry.bufferPositions (bas.module.js:1605:10)
at new PointBufferGeometry (bas.module.js:1601:10)
at ParticleSystem.init (particlesSystem.js:37:1)
at new ParticleSystem (particlesSystem.js:11:1)
at MainBrain.addParticlesSystem (MainBrain.js:254:1)
at MainBrain.runAnimation (MainBrain.js:196:1)
at Loaders.handlerLoad (Loaders.js:33:1)
at LoadingManager.itemEnd (three.module.js:30976:11)
at HTMLImageElement.eval (three.module.js:31596:18)
createAttribute @ bas.module.js:1621
bufferPositions @ bas.module.js:1605
PointBufferGeometry @ bas.module.js:1601
init @ particlesSystem.js:37
ParticleSystem @ particlesSystem.js:11
addParticlesSystem @ MainBrain.js:254
runAnimation @ MainBrain.js:196
handlerLoad @ Loaders.js:33
LoadingManager.itemEnd @ three.module.js:30976
eval @ three.module.js:31596
hook.js:608 [WDS] Warnings while compiling.
overrideMethod @ hook.js:608
warnings @ index.js?http://0.0.0.0:8080:147
onmessage @ socket.js:41
EventTarget.dispatchEvent @ sockjs.js:170
eval @ sockjs.js:887
SockJS.\_transportMessage @ sockjs.js:885
EventEmitter.emit @ sockjs.js:86
WebSocketTransport.ws.onmessage @ sockjs.js:2961
hook.js:608 ./src/**shim**.js
]50;CurrentDir=/workspace/vendor/3dbrain
✘ http://eslint.org/docs/rules/vars-on-top All 'var' declarations must be at the top of the function scope
 src/**shim**.js:4:3
var BG = window.THREE.BufferGeometry.prototype;
^

✘ http://eslint.org/docs/rules/no-var Unexpected var, use let or const instead
 src/**shim**.js:4:3
var BG = window.THREE.BufferGeometry.prototype;
^

✘ http://eslint.org/docs/rules/eol-last Newline required at end of file but not found
 src/**shim**.js:8:2
}
^

✘ 3 problems (3 errors, 0 warnings)

Errors:
1 http://eslint.org/docs/rules/vars-on-top
1 http://eslint.org/docs/rules/no-var
1 http://eslint.org/docs/rules/eol-last
@ ./src/app.js 3:0-21
@ multi ./node_modules/.pnpm/webpack-dev-server@2.11.5_webpack@3.12.0/node_modules/webpack-dev-server/client?http://0.0.0.0:8080 webpack/hot/dev-server ./src/app.js
overrideMethod @ hook.js:608
warnings @ index.js?http://0.0.0.0:8080:153
onmessage @ socket.js:41
EventTarget.dispatchEvent @ sockjs.js:170
eval @ sockjs.js:887
SockJS.\_transportMessage @ sockjs.js:885
EventEmitter.emit @ sockjs.js:86
WebSocketTransport.ws.onmessage @ sockjs.js:2961
MainBrain.js:128 Uncaught TypeError: Cannot read properties of undefined (reading 'transform')
at TweenMax.onStart (MainBrain.js:128:1)
at p.\_callback (TweenLite.js:582:22)
at p.render (TweenMaxBase.js:302:11)
at \_internals.lazyRender (TweenLite.js:1132:13)
at Animation.\_updateRoot.TweenLite.render (TweenLite.js:1152:6)
at p.dispatchEvent (TweenLite.js:287:19)
at \_tick (TweenLite.js:339:13)
onStart @ MainBrain.js:128
p.\_callback @ TweenLite.js:582
p.render @ TweenMaxBase.js:302
\_internals.lazyRender @ TweenLite.js:1132
Animation.\_updateRoot.TweenLite.render @ TweenLite.js:1152
p.dispatchEvent @ TweenLite.js:287
\_tick @ TweenLite.js:339
requestAnimationFrame
\_tick @ TweenLite.js:336
\_self.wake @ TweenLite.js:385
eval @ TweenLite.js:438
eval @ TweenLite.js:791
eval @ TimelineLite.js:69
Definition.check @ TweenLite.js:117
Definition @ TweenLite.js:142
window.\_gsDefine @ TweenLite.js:147
eval @ TimelineLite.js:16
./node_modules/.pnpm/gsap@1.20.6/node_modules/gsap/esm/TimelineLite.js @ app.js:2026
**webpack_require** @ app.js:679
fn @ app.js:89
eval @ index.js:3
./node_modules/.pnpm/gsap@1.20.6/node_modules/gsap/esm/index.js @ app.js:2066
**webpack_require** @ app.js:679
fn @ app.js:89
eval @ MainBrain.js:3
./src/js/MainBrain.js @ app.js:3081
**webpack_require** @ app.js:679
fn @ app.js:89
eval @ app.js:3
./src/app.js @ app.js:3058
**webpack_require** @ app.js:679
fn @ app.js:89
0 @ app.js:3237
**webpack_require** @ app.js:679
(anonymous) @ app.js:725
(anonymous) @ app.js:728
gui.js:114 Uncaught TypeError: Cannot read properties of undefined (reading 'isActive')
at t.eval [as __onChange] (gui.js:114:1)
at e.setValue (dat.gui.min.js:13:9989)
at t.setValue (dat.gui.min.js:13:11355)
at t.eval [as setValue] (dat.gui.min.js:13:7561)
at HTMLInputElement.a (dat.gui.min.js:13:10992)
eval @ gui.js:114
e.setValue @ dat.gui.min.js:13
t.setValue @ dat.gui.min.js:13
eval @ dat.gui.min.js:13
a @ dat.gui.min.js:13
gui.js:114 Uncaught TypeError: Cannot read properties of undefined (reading 'isActive')
at t.eval [as __onChange] (gui.js:114:1)
at e.setValue (dat.gui.min.js:13:9989)
at t.setValue (dat.gui.min.js:13:11355)
at t.eval [as setValue] (dat.gui.min.js:13:7561)
at HTMLInputElement.a (dat.gui.min.js:13:10992)
eval @ gui.js:114
e.setValue @ dat.gui.min.js:13
t.setValue @ dat.gui.min.js:13
eval @ dat.gui.min.js:13
a @ dat.gui.min.js:13
MainBrain.js:132 Uncaught TypeError: Cannot read properties of undefined (reading 'xRay')
at TweenMax.onComplete (MainBrain.js:132:1)
at p.\_callback (TweenLite.js:582:22)
at p.render (TweenMaxBase.js:338:11)
at p.render (TweenLite.js:877:13)
at Animation.\_updateRoot.TweenLite.render (TweenLite.js:1149:19)
at p.dispatchEvent (TweenLite.js:287:19)
at \_tick (TweenLite.js:339:13)
onComplete @ MainBrain.js:132
p.\_callback @ TweenLite.js:582
p.render @ TweenMaxBase.js:338
p.render @ TweenLite.js:877
Animation.\_updateRoot.TweenLite.render @ TweenLite.js:1149
p.dispatchEvent @ TweenLite.js:287
\_tick @ TweenLite.js:339
requestAnimationFrame
\_tick @ TweenLite.js:336
requestAnimationFrame
\_tick @ TweenLite.js:336
requestAnimationFrame
\_tick @ TweenLite.js:336
requestAnimationFrame
\_tick @ TweenLite.js:336
requestAnimationFrame
\_tick @ TweenLite.js:336
requestAnimationFrame
\_tick @ TweenLite.js:336
requestAnimationFrame
\_tick @ TweenLite.js:336
requestAnimationFrame
\_tick @ TweenLite.js:336
requestAnimationFrame
\_tick @ TweenLite.js:336
requestAnimationFrame
\_tick @ TweenLite.js:336
requestAnimationFrame
\_tick @ TweenLite.js:336
requestAnimationFrame
\_tick @ TweenLite.js:336
requestAnimationFrame
\_tick @ TweenLite.js:336
requestAnimationFrame
\_tick @ TweenLite.js:336
requestAnimationFrame
\_tick @ TweenLite.js:336
requestAnimationFrame
\_tick @ TweenLite.js:336
requestAnimationFrame
\_tick @ TweenLite.js:336
requestAnimationFrame
\_tick @ TweenLite.js:336
requestAnimationFrame
\_tick @ TweenLite.js:336
requestAnimationFrame
\_tick @ TweenLite.js:336
requestAnimationFrame
\_tick @ TweenLite.js:336
requestAnimationFrame
\_tick @ TweenLite.js:336
requestAnimationFrame
\_tick @ TweenLite.js:336
requestAnimationFrame
\_tick @ TweenLite.js:336
requestAnimationFrame
\_tick @ TweenLite.js:336
requestAnimationFrame
\_tick @ TweenLite.js:336
requestAnimationFrame
\_tick @ TweenLite.js:336
requestAnimationFrame
\_tick @ TweenLite.js:336
requestAnimationFrame
\_tick @ TweenLite.js:336
requestAnimationFrame
\_tick @ TweenLite.js:336
requestAnimationFrame
\_tick @ TweenLite.js:336
requestAnimationFrame
\_tick @ TweenLite.js:336
```

## BROWSER LOG 3

```
Navigated to http://localhost:8080/
app.js:3013 [HMR] Waiting for update signal from WDS...
AbstractApplication.js:31 THREE.WebGLRenderer 91
OBJLoader.js:781 OBJLoader: 145.5400390625 ms
Loaders.js:32 loading Complete!
bas.module.js:1621 Uncaught TypeError: this.setAttribute is not a function
    at PointBufferGeometry.createAttribute (bas.module.js:1621:10)
    at PointBufferGeometry.bufferPositions (bas.module.js:1605:10)
    at new PointBufferGeometry (bas.module.js:1601:10)
    at ParticleSystem.init (particlesSystem.js:37:1)
    at new ParticleSystem (particlesSystem.js:11:1)
    at MainBrain.addParticlesSystem (MainBrain.js:254:1)
    at MainBrain.runAnimation (MainBrain.js:196:1)
    at Loaders.handlerLoad (Loaders.js:33:1)
    at LoadingManager.itemEnd (three.module.js:30976:11)
    at HTMLImageElement.eval (three.module.js:31596:18)
createAttribute @ bas.module.js:1621
bufferPositions @ bas.module.js:1605
PointBufferGeometry @ bas.module.js:1601
init @ particlesSystem.js:37
ParticleSystem @ particlesSystem.js:11
addParticlesSystem @ MainBrain.js:254
runAnimation @ MainBrain.js:196
handlerLoad @ Loaders.js:33
LoadingManager.itemEnd @ three.module.js:30976
eval @ three.module.js:31596
hook.js:608 [WDS] Warnings while compiling.
overrideMethod @ hook.js:608
warnings @ index.js?http://0.0.0.0:8080:147
onmessage @ socket.js:41
EventTarget.dispatchEvent @ sockjs.js:170
eval @ sockjs.js:887
SockJS._transportMessage @ sockjs.js:885
EventEmitter.emit @ sockjs.js:86
WebSocketTransport.ws.onmessage @ sockjs.js:2961
hook.js:608 ./src/app.js
]50;CurrentDir=/workspace/vendor/3dbrain
  ⚠  http://eslint.org/docs/rules/func-names                   Unexpected unnamed function
  src/app.js:3:2
  (function() {
    ^

  ⚠  http://eslint.org/docs/rules/func-names                   Unexpected unnamed function
  src/app.js:5:27
    Object.defineProperty = function(obj, prop, descriptor) {
                             ^

  ✘  http://eslint.org/docs/rules/wrap-iife                    Move the invocation into the parens that contain the function
  src/app.js:3:1
  (function() {
   ^

  ✘  http://eslint.org/docs/rules/space-before-function-paren  Missing space before function parentheses
  src/app.js:3:10
  (function() {
            ^

  ✘  http://eslint.org/docs/rules/space-before-function-paren  Missing space before function parentheses
  src/app.js:5:35
    Object.defineProperty = function(obj, prop, descriptor) {
                                     ^

  ✘  https://google.com/#q=import%2Ffirst                      Import in body of module; reorder to top
  src/app.js:16:1
  import './css/style.css';
   ^

  ✘  https://google.com/#q=import%2Ffirst                      Import in body of module; reorder to top
  src/app.js:17:1
  import MainBrain from './js/MainBrain';
   ^


✘ 7 problems (5 errors, 2 warnings)


Errors:
  2  http://eslint.org/docs/rules/space-before-function-paren
  2  https://google.com/#q=import%2Ffirst
  1  http://eslint.org/docs/rules/wrap-iife

Warnings:
  2  http://eslint.org/docs/rules/func-names
 @ multi ./node_modules/.pnpm/webpack-dev-server@2.11.5_webpack@3.12.0/node_modules/webpack-dev-server/client?http://0.0.0.0:8080 webpack/hot/dev-server ./src/app.js
overrideMethod @ hook.js:608
warnings @ index.js?http://0.0.0.0:8080:153
onmessage @ socket.js:41
EventTarget.dispatchEvent @ sockjs.js:170
eval @ sockjs.js:887
SockJS._transportMessage @ sockjs.js:885
EventEmitter.emit @ sockjs.js:86
WebSocketTransport.ws.onmessage @ sockjs.js:2961
MainBrain.js:128 Uncaught TypeError: Cannot read properties of undefined (reading 'transform')
    at TweenMax.onStart (MainBrain.js:128:1)
    at p._callback (TweenLite.js:582:22)
    at p.render (TweenMaxBase.js:302:11)
    at _internals.lazyRender (TweenLite.js:1132:13)
    at Animation._updateRoot.TweenLite.render (TweenLite.js:1152:6)
    at p.dispatchEvent (TweenLite.js:287:19)
    at _tick (TweenLite.js:339:13)
onStart @ MainBrain.js:128
p._callback @ TweenLite.js:582
p.render @ TweenMaxBase.js:302
_internals.lazyRender @ TweenLite.js:1132
Animation._updateRoot.TweenLite.render @ TweenLite.js:1152
p.dispatchEvent @ TweenLite.js:287
_tick @ TweenLite.js:339
requestAnimationFrame
_tick @ TweenLite.js:336
_self.wake @ TweenLite.js:385
eval @ TweenLite.js:438
eval @ TweenLite.js:899
TweenMax @ TweenMaxBase.js:45
TweenMax.fromTo @ TweenMaxBase.js:361
startIntro @ MainBrain.js:117
eval @ MainBrain.js:39
setTimeout
MainBrain @ MainBrain.js:38
eval @ app.js:20
./src/app.js @ app.js:3050
__webpack_require__ @ app.js:679
fn @ app.js:89
0 @ app.js:3229
__webpack_require__ @ app.js:679
(anonymous) @ app.js:725
(anonymous) @ app.js:728
MainBrain.js:132 Uncaught TypeError: Cannot read properties of undefined (reading 'xRay')
    at TweenMax.onComplete (MainBrain.js:132:1)
    at p._callback (TweenLite.js:582:22)
    at p.render (TweenMaxBase.js:338:11)
    at p.render (TweenLite.js:877:13)
    at Animation._updateRoot.TweenLite.render (TweenLite.js:1149:19)
    at p.dispatchEvent (TweenLite.js:287:19)
    at _tick (TweenLite.js:339:13)
onComplete @ MainBrain.js:132
p._callback @ TweenLite.js:582
p.render @ TweenMaxBase.js:338
p.render @ TweenLite.js:877
Animation._updateRoot.TweenLite.render @ TweenLite.js:1149
p.dispatchEvent @ TweenLite.js:287
_tick @ TweenLite.js:339
requestAnimationFrame
_tick @ TweenLite.js:336
requestAnimationFrame
_tick @ TweenLite.js:336
requestAnimationFrame
_tick @ TweenLite.js:336
requestAnimationFrame
_tick @ TweenLite.js:336
requestAnimationFrame
_tick @ TweenLite.js:336
requestAnimationFrame
_tick @ TweenLite.js:336
requestAnimationFrame
_tick @ TweenLite.js:336
requestAnimationFrame
_tick @ TweenLite.js:336
requestAnimationFrame
_tick @ TweenLite.js:336
requestAnimationFrame
_tick @ TweenLite.js:336
requestAnimationFrame
_tick @ TweenLite.js:336
requestAnimationFrame
_tick @ TweenLite.js:336
requestAnimationFrame
_tick @ TweenLite.js:336
requestAnimationFrame
_tick @ TweenLite.js:336
requestAnimationFrame
_tick @ TweenLite.js:336
requestAnimationFrame
_tick @ TweenLite.js:336
requestAnimationFrame
_tick @ TweenLite.js:336
requestAnimationFrame
_tick @ TweenLite.js:336
requestAnimationFrame
_tick @ TweenLite.js:336
requestAnimationFrame
_tick @ TweenLite.js:336
requestAnimationFrame
_tick @ TweenLite.js:336
requestAnimationFrame
_tick @ TweenLite.js:336
requestAnimationFrame
_tick @ TweenLite.js:336
requestAnimationFrame
_tick @ TweenLite.js:336
requestAnimationFrame
_tick @ TweenLite.js:336
requestAnimationFrame
_tick @ TweenLite.js:336
requestAnimationFrame
_tick @ TweenLite.js:336
requestAnimationFrame
_tick @ TweenLite.js:336
requestAnimationFrame
_tick @ TweenLite.js:336
requestAnimationFrame
_tick @ TweenLite.js:336
requestAnimationFrame
_tick @ TweenLite.js:336
requestAnimationFrame
_tick @ TweenLite.js:336
```
