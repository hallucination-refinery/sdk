# 2. Package & app inventory
--------------------------
## `apps/animus-demo`
**Name**: `animus-demo`
**Version**: 0.1.0
**Private**: true
**Purpose**: *No description provided.*

### Build Status
**Status**: ❌ Failed
```

> animus-demo@0.1.0 build /Users/williambarron/hallucination-refinery/refinery-mono/apps/animus-demo
> next build

   ▲ Next.js 15.3.2

   Creating an optimized production build ...
 ✓ Compiled successfully in 5.0s
   Linting and checking validity of types ...
 ⚠ TypeScript project references are not fully supported. Attempting to build in incremental mode.

 ⚠ The Next.js plugin was not detected in your ESLint configuration. See https://nextjs.org/docs/app/api-reference/config/eslint#migrating-existing-config
Failed to compile.

../../packages/interaction/src/InteractionProvider.tsx:108:10
Type error: Re-exporting a type when 'isolatedModules' is enabled requires using 'export type'.

[0m [90m 106 |[39m[0m
[0m [90m 107 |[39m [90m// re-export inside provider file for barrel[39m[0m
[0m[31m[1m>[22m[39m[90m 108 |[39m [36mexport[39m { [33mInteractionContextType[39m }[33m;[39m[0m
[0m [90m     |[39m          [31m[1m^[22m[39m[0m
[0m [90m 109 |[39m[0m
Next.js build worker exited with code: 1 and signal: null
/Users/williambarron/hallucination-refinery/refinery-mono/apps/animus-demo:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  animus-demo@0.1.0 build: `next build`
Exit status 1
```

### Test Status
**Status**: ℹ️ No test script.

---

## `apps/cryptic-vault-demo`
**Name**: `cryptic-vault-demo`
**Version**: 0.1.0
**Private**: true
**Purpose**: *No description provided.*

### Build Status
**Status**: ❌ Failed
```

> cryptic-vault-demo@0.1.0 build /Users/williambarron/hallucination-refinery/refinery-mono/apps/cryptic-vault-demo
> next build

   ▲ Next.js 15.3.2

   Creating an optimized production build ...
[Error: Cannot apply unknown utility class `bg-background`. Are you using CSS modules or similar and missing `@reference`? https://tailwindcss.com/docs/functions-and-directives#reference-directive]
 ✓ Compiled successfully in 5.0s
   Linting and checking validity of types ...
 ⚠ TypeScript project references are not fully supported. Attempting to build in incremental mode.

 ⚠ The Next.js plugin was not detected in your ESLint configuration. See https://nextjs.org/docs/app/api-reference/config/eslint#migrating-existing-config

Failed to compile.

./components/BrainMeshView.tsx
4:13  Error: 'THREE' is defined but never used.  @typescript-eslint/no-unused-vars
7:10  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
13:3  Error: 'nodes' is defined but never used.  @typescript-eslint/no-unused-vars

./components/CategoryHUD.tsx
2:10  Error: 'CATEGORY_MAPPINGS' is defined but never used.  @typescript-eslint/no-unused-vars
5:7  Error: 'a' is assigned a value but never used.  @typescript-eslint/no-unused-vars
9:10  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./components/ClusterVisualization.tsx
36:37  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./components/CrypticAnimusScene.tsx
6:3  Error: 'useState' is defined but never used.  @typescript-eslint/no-unused-vars
29:12  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
30:12  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
32:24  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
33:28  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
54:3  Error: 'onBackgroundClickRequest' is defined but never used.  @typescript-eslint/no-unused-vars
61:24  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
86:5  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
113:12  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
113:18  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
155:51  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
168:23  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
178:12  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
185:9  Error: 'getLinkOpacity' is assigned a value but never used.  @typescript-eslint/no-unused-vars
186:12  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
195:13  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
198:13  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
241:26  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
247:21  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
248:26  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
272:31  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
273:29  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
274:29  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
281:12  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
313:12  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
330:12  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
370:30  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./components/CrypticVaultScene.tsx
13:8  Error: 'dynamic' is defined but never used.  @typescript-eslint/no-unused-vars
27:10  Error: 'useThree' is defined but never used.  @typescript-eslint/no-unused-vars
34:8  Error: 'EnergyRippleOverlay' is defined but never used.  @typescript-eslint/no-unused-vars
37:22  Error: A `require()` style import is forbidden.  @typescript-eslint/no-require-imports
57:14  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
59:9  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
63:21  Error: A `require()` style import is forbidden.  @typescript-eslint/no-require-imports
64:7  Error: 'conceptsJson' is assigned a value but never used.  @typescript-eslint/no-unused-vars
64:22  Error: A `require()` style import is forbidden.  @typescript-eslint/no-require-imports
65:42  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
76:10  Error: 'convertConceptsToIdeaNodes' is defined but never used.  @typescript-eslint/no-unused-vars
85:27  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
138:3  Error: 'enrichedImages' is defined but never used.  @typescript-eslint/no-unused-vars
141:3  Error: 'highlightActiveTime' is defined but never used.  @typescript-eslint/no-unused-vars
147:27  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
151:21  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
158:29  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
168:29  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
218:30  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
230:43  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
231:43  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
238:22  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
252:29  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
269:29  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
284:26  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
297:21  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
298:18  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
309:11  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
318:29  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
334:19  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
341:32  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
342:32  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./components/EnergyRippleOverlay.tsx
3:27  Error: 'useEffect' is defined but never used.  @typescript-eslint/no-unused-vars
14:10  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
73:3  Error: 'activeTime' is assigned a value but never used.  @typescript-eslint/no-unused-vars

./components/KeyboardControls.tsx
8:19  Error: 'gl' is assigned a value but never used.  @typescript-eslint/no-unused-vars
11:9  Error: 'direction' is assigned a value but never used.  @typescript-eslint/no-unused-vars
27:9  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console

./components/LODController.tsx
4:10  Error: 'useEffect' is defined but never used.  @typescript-eslint/no-unused-vars

./components/MemoryNodes.tsx
22:26  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
23:32  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any

./components/ParticleCloud.tsx
20:7  Error: 'vertexShader' is assigned a value but never used.  @typescript-eslint/no-unused-vars
71:7  Error: 'fragmentShader' is assigned a value but never used.  @typescript-eslint/no-unused-vars
94:9  Error: 'materialRef' is assigned a value but never used.  @typescript-eslint/no-unused-vars
136:7  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console

info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules
/Users/williambarron/hallucination-refinery/refinery-mono/apps/cryptic-vault-demo:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  cryptic-vault-demo@0.1.0 build: `next build`
Exit status 1
```

### Test Status
**Status**: ℹ️ No test script.

---

## `apps/jam-session-demo`
**Name**: `jam-session-demo`
**Version**: 0.1.0
**Private**: true
**Purpose**: *No description provided.*

### Build Status
**Status**: ❌ Failed
```

> jam-session-demo@0.1.0 build /Users/williambarron/hallucination-refinery/refinery-mono/apps/jam-session-demo
> next build

   ▲ Next.js 15.3.2

   Creating an optimized production build ...
 ✓ Compiled successfully in 1000ms
   Linting and checking validity of types ...

 ⚠ The Next.js plugin was not detected in your ESLint configuration. See https://nextjs.org/docs/app/api-reference/config/eslint#migrating-existing-config

Failed to compile.

./app/page.tsx
3:33  Error: 'useRef' is defined but never used.  @typescript-eslint/no-unused-vars
15:3  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
39:7  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console

./components/AudioEngine.tsx
65:7  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
78:7  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
129:7  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
133:5  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
135:5  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
136:5  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
159:7  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
162:9  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
169:9  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
173:5  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
250:5  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
259:5  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
262:7  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
266:5  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
270:5  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
275:7  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
277:7  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
280:7  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
284:7  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
288:7  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
292:5  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
294:5  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
299:5  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
321:5  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console

./components/AudioFileEngine.tsx
100:5  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
104:7  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
125:9  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
139:5  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
148:5  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
165:5  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console

./components/HUD.tsx
70:15  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console

./components/MusicPlayer.tsx
4:13  Error: 'Tone' is defined but never used.  @typescript-eslint/no-unused-vars
11:24  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
53:69  Error: Unexpected any. Specify a different type.  @typescript-eslint/no-explicit-any
71:7  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
165:7  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console

./components/ParticleSystem.tsx
1:27  Error: 'useEffect' is defined but never used.  @typescript-eslint/no-unused-vars
116:7  Error: Unexpected console statement. Only these console methods are allowed: warn, error.  no-console
193:17  Error: 'audioBoost' is assigned a value but never used.  @typescript-eslint/no-unused-vars

info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules
/Users/williambarron/hallucination-refinery/refinery-mono/apps/jam-session-demo:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  jam-session-demo@0.1.0 build: `next build`
Exit status 1
```

### Test Status
**Status**: ℹ️ No test script.

---

## `packages/ai-ranker`
**Name**: `@refinery/ai-ranker`
**Version**: 0.0.0
**Private**: 
**Purpose**: *No description provided.*

### Build Status
**Status**: ❌ Failed
```

> @refinery/ai-ranker@0.0.0 build /Users/williambarron/hallucination-refinery/refinery-mono/packages/ai-ranker
> tsc -p .

src/ingest.ts(1,26): error TS6059: File '/Users/williambarron/hallucination-refinery/refinery-mono/packages/ideanode/src/index.ts' is not under 'rootDir' '/Users/williambarron/hallucination-refinery/refinery-mono/packages/ai-ranker/src'. 'rootDir' is expected to contain all source files.
  The file is in the program because:
    Imported via '@refinery/ideanode' from file '/Users/williambarron/hallucination-refinery/refinery-mono/packages/ai-ranker/src/ingest.ts'
    Imported via '@refinery/ideanode' from file '/Users/williambarron/hallucination-refinery/refinery-mono/packages/ai-ranker/src/map/jsonToNodesLinks.ts'
    Imported via '@refinery/ideanode' from file '/Users/williambarron/hallucination-refinery/refinery-mono/packages/ai-ranker/src/ingestFlow.ts'
src/ingest.ts(1,26): error TS6307: File '/Users/williambarron/hallucination-refinery/refinery-mono/packages/ideanode/src/index.ts' is not listed within the file list of project '/Users/williambarron/hallucination-refinery/refinery-mono/packages/ai-ranker/tsconfig.json'. Projects must list all files or use an 'include' pattern.
  The file is in the program because:
    Imported via '@refinery/ideanode' from file '/Users/williambarron/hallucination-refinery/refinery-mono/packages/ai-ranker/src/ingest.ts'
    Imported via '@refinery/ideanode' from file '/Users/williambarron/hallucination-refinery/refinery-mono/packages/ai-ranker/src/map/jsonToNodesLinks.ts'
    Imported via '@refinery/ideanode' from file '/Users/williambarron/hallucination-refinery/refinery-mono/packages/ai-ranker/src/ingestFlow.ts'
/Users/williambarron/hallucination-refinery/refinery-mono/packages/ai-ranker:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  @refinery/ai-ranker@0.0.0 build: `tsc -p .`
Exit status 2
```

### Test Status
**Status**: ℹ️ No test script.

---

## `packages/convo-loop`
**Name**: `@refinery/convo-loop`
**Version**: 0.1.0
**Private**: 
**Purpose**: *No description provided.*

### Build Status
**Status**: ✅ Success

### Test Status
**Status**: ℹ️ No test script.

---

## `packages/embeddings`
**Name**: `@refinery/embeddings`
**Version**: 0.0.1
**Private**: true
**Purpose**: *No description provided.*

### Build Status
**Status**: ✅ Success

### Test Status
**Status**: ❌ Failed
**Coverage**: *Not reported.*
```

> @refinery/embeddings@0.0.1 test /Users/williambarron/hallucination-refinery/refinery-mono/packages/embeddings
> echo "Error: no test specified" && exit 1

Error: no test specified
/Users/williambarron/hallucination-refinery/refinery-mono/packages/embeddings:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  @refinery/embeddings@0.0.1 test: `echo "Error: no test specified" && exit 1`
Exit status 1
```

---

## `packages/gesture-hands`
**Name**: `@refinery/gesture-hands`
**Version**: 0.1.0
**Private**: true
**Purpose**: *No description provided.*

### Build Status
**Status**: ❌ Failed
```

> @refinery/gesture-hands@0.1.0 build /Users/williambarron/hallucination-refinery/refinery-mono/packages/gesture-hands
> tsc -p .

src/eventMux.ts(6,24): error TS6059: File '/Users/williambarron/hallucination-refinery/refinery-mono/packages/shared/src/index.ts' is not under 'rootDir' '/Users/williambarron/hallucination-refinery/refinery-mono/packages/gesture-hands/src'. 'rootDir' is expected to contain all source files.
src/eventMux.ts(6,24): error TS6307: File '/Users/williambarron/hallucination-refinery/refinery-mono/packages/shared/src/index.ts' is not listed within the file list of project '/Users/williambarron/hallucination-refinery/refinery-mono/packages/gesture-hands/tsconfig.json'. Projects must list all files or use an 'include' pattern.
../shared/src/index.ts(4,24): error TS6059: File '/Users/williambarron/hallucination-refinery/refinery-mono/packages/shared/src/logger.ts' is not under 'rootDir' '/Users/williambarron/hallucination-refinery/refinery-mono/packages/gesture-hands/src'. 'rootDir' is expected to contain all source files.
../shared/src/index.ts(4,24): error TS6307: File '/Users/williambarron/hallucination-refinery/refinery-mono/packages/shared/src/logger.ts' is not listed within the file list of project '/Users/williambarron/hallucination-refinery/refinery-mono/packages/gesture-hands/tsconfig.json'. Projects must list all files or use an 'include' pattern.
/Users/williambarron/hallucination-refinery/refinery-mono/packages/gesture-hands:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  @refinery/gesture-hands@0.1.0 build: `tsc -p .`
Exit status 2
```

### Test Status
**Status**: ℹ️ No test script.

---

## `packages/graph-store`
**Name**: `@refinery/graph-store`
**Version**: 0.0.1
**Private**: true
**Purpose**: *No description provided.*

### Build Status
**Status**: ✅ Success

### Test Status
**Status**: ❌ Failed
**Coverage**: *Not reported.*
```

> @refinery/graph-store@0.0.1 test /Users/williambarron/hallucination-refinery/refinery-mono/packages/graph-store
> echo "Error: no test specified" && exit 1

Error: no test specified
/Users/williambarron/hallucination-refinery/refinery-mono/packages/graph-store:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  @refinery/graph-store@0.0.1 test: `echo "Error: no test specified" && exit 1`
Exit status 1
```

---

## `packages/ideanode`
**Name**: `@refinery/ideanode`
**Version**: 0.1.0
**Private**: 
**Purpose**: *No description provided.*

### Build Status
**Status**: ✅ Success

### Test Status
**Status**: ℹ️ No test script.

---

## `packages/input`
**Name**: `@refinery/input`
**Version**: 0.1.0
**Private**: 
**Purpose**: *No description provided.*

### Build Status
**Status**: ❌ Failed
```

> @refinery/input@0.1.0 build /Users/williambarron/hallucination-refinery/refinery-mono/packages/input
> tsc -p .

src/useMediaPipeHands.ts(12,24): error TS6059: File '/Users/williambarron/hallucination-refinery/refinery-mono/packages/shared/src/index.ts' is not under 'rootDir' '/Users/williambarron/hallucination-refinery/refinery-mono/packages/input/src'. 'rootDir' is expected to contain all source files.
  The file is in the program because:
    Imported via '@refinery/shared' from file '/Users/williambarron/hallucination-refinery/refinery-mono/packages/input/src/useMediaPipeHands.ts'
    Imported via '@refinery/shared' from file '/Users/williambarron/hallucination-refinery/refinery-mono/packages/input/src/useVoiceLoop.ts'
src/useMediaPipeHands.ts(12,24): error TS6307: File '/Users/williambarron/hallucination-refinery/refinery-mono/packages/shared/src/index.ts' is not listed within the file list of project '/Users/williambarron/hallucination-refinery/refinery-mono/packages/input/tsconfig.json'. Projects must list all files or use an 'include' pattern.
  The file is in the program because:
    Imported via '@refinery/shared' from file '/Users/williambarron/hallucination-refinery/refinery-mono/packages/input/src/useMediaPipeHands.ts'
    Imported via '@refinery/shared' from file '/Users/williambarron/hallucination-refinery/refinery-mono/packages/input/src/useVoiceLoop.ts'
../shared/src/index.ts(4,24): error TS6059: File '/Users/williambarron/hallucination-refinery/refinery-mono/packages/shared/src/logger.ts' is not under 'rootDir' '/Users/williambarron/hallucination-refinery/refinery-mono/packages/input/src'. 'rootDir' is expected to contain all source files.
../shared/src/index.ts(4,24): error TS6307: File '/Users/williambarron/hallucination-refinery/refinery-mono/packages/shared/src/logger.ts' is not listed within the file list of project '/Users/williambarron/hallucination-refinery/refinery-mono/packages/input/tsconfig.json'. Projects must list all files or use an 'include' pattern.
/Users/williambarron/hallucination-refinery/refinery-mono/packages/input:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  @refinery/input@0.1.0 build: `tsc -p .`
Exit status 2
```

### Test Status
**Status**: ℹ️ No test script.

---

## `packages/interaction`
**Name**: `@refinery/interaction`
**Version**: 0.1.0
**Private**: true
**Purpose**: *No description provided.*

### Build Status
**Status**: ❌ Failed
```

> @refinery/interaction@0.1.0 build /Users/williambarron/hallucination-refinery/refinery-mono/packages/interaction
> tsc -p .

src/types.ts(1,36): error TS6059: File '/Users/williambarron/hallucination-refinery/refinery-mono/packages/ideanode/src/index.ts' is not under 'rootDir' '/Users/williambarron/hallucination-refinery/refinery-mono/packages/interaction'. 'rootDir' is expected to contain all source files.
  The file is in the program because:
    Imported via '@refinery/ideanode' from file '/Users/williambarron/hallucination-refinery/refinery-mono/packages/interaction/src/types.ts'
    Imported via '@refinery/ideanode' from file '/Users/williambarron/hallucination-refinery/refinery-mono/packages/interaction/src/reducer.ts'
    Imported via '@refinery/ideanode' from file '/Users/williambarron/hallucination-refinery/refinery-mono/packages/interaction/src/applyInteractionAction.ts'
src/types.ts(1,36): error TS6307: File '/Users/williambarron/hallucination-refinery/refinery-mono/packages/ideanode/src/index.ts' is not listed within the file list of project '/Users/williambarron/hallucination-refinery/refinery-mono/packages/interaction/tsconfig.json'. Projects must list all files or use an 'include' pattern.
  The file is in the program because:
    Imported via '@refinery/ideanode' from file '/Users/williambarron/hallucination-refinery/refinery-mono/packages/interaction/src/types.ts'
    Imported via '@refinery/ideanode' from file '/Users/williambarron/hallucination-refinery/refinery-mono/packages/interaction/src/reducer.ts'
    Imported via '@refinery/ideanode' from file '/Users/williambarron/hallucination-refinery/refinery-mono/packages/interaction/src/applyInteractionAction.ts'
/Users/williambarron/hallucination-refinery/refinery-mono/packages/interaction:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  @refinery/interaction@0.1.0 build: `tsc -p .`
Exit status 2
```

### Test Status
**Status**: ✅ Passed
**Coverage**: *Not reported.*
```

> @refinery/interaction@0.1.0 test /Users/williambarron/hallucination-refinery/refinery-mono/packages/interaction
> jest --config ./jest.config.cjs

FAIL __tests__/interactionReducer.test.ts
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /Users/williambarron/hallucination-refinery/refinery-mono/packages/ideanode/src/index.js:4
    export const originalPlaceholderNodes = [/* ───── Roots (tier 0) ───── */
    ^^^^^^

    SyntaxError: Unexpected token 'export'

    > 1 | import {
        | ^
      2 |   IdeaNode,
      3 |   placeholderInitialNodes,
      4 |   placeholderInitialLinks,

      at Runtime.createScriptFromCode (../../node_modules/.pnpm/jest-runtime@29.7.0/node_modules/jest-runtime/build/index.js:1505:14)
      at Object.<anonymous> (src/reducer.ts:1:1)
      at Object.<anonymous> (__tests__/interactionReducer.test.ts:1:1)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        1.743 s
Ran all test suites.
/Users/williambarron/hallucination-refinery/refinery-mono/packages/interaction:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  @refinery/interaction@0.1.0 test: `jest --config ./jest.config.cjs`
Exit status 1
```

---

## `packages/shared`
**Name**: `@refinery/shared`
**Version**: 0.1.0
**Private**: 
**Purpose**: *No description provided.*

### Build Status
**Status**: ✅ Success

### Test Status
**Status**: ℹ️ No test script.

---

## `packages/thinkable`
**Name**: `@refinery/thinkable`
**Version**: 0.1.0
**Private**: 
**Purpose**: *No description provided.*

### Build Status
**Status**: ❌ Failed
```

> @refinery/thinkable@0.1.0 build /Users/williambarron/hallucination-refinery/refinery-mono/packages/thinkable
> tsc -p .

src/cascadingContext.ts(4,31): error TS6059: File '/Users/williambarron/hallucination-refinery/refinery-mono/packages/ideanode/src/index.ts' is not under 'rootDir' '/Users/williambarron/hallucination-refinery/refinery-mono/packages/thinkable/src'. 'rootDir' is expected to contain all source files.
src/cascadingContext.ts(4,31): error TS6307: File '/Users/williambarron/hallucination-refinery/refinery-mono/packages/ideanode/src/index.ts' is not listed within the file list of project '/Users/williambarron/hallucination-refinery/refinery-mono/packages/thinkable/tsconfig.json'. Projects must list all files or use an 'include' pattern.
/Users/williambarron/hallucination-refinery/refinery-mono/packages/thinkable:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  @refinery/thinkable@0.1.0 build: `tsc -p .`
Exit status 2
```

### Test Status
**Status**: ✅ Passed
**Coverage**: *Not reported.*
```

> @refinery/thinkable@0.1.0 test /Users/williambarron/hallucination-refinery/refinery-mono/packages/thinkable
> vitest run


 RUN  v3.2.3 /Users/williambarron/hallucination-refinery/refinery-mono/packages/thinkable

 ✓ src/__tests__/cascadingContext.test.ts (3 tests) 2ms
 ✓ src/__tests__/search.test.ts (5 tests) 2ms
 ✓ src/__tests__/deriveInterwingle.test.ts (4 tests) 3ms

 Test Files  3 passed (3)
      Tests  12 passed (12)
   Start at  17:01:22
   Duration  403ms (transform 69ms, setup 0ms, collect 97ms, tests 7ms, environment 0ms, prepare 551ms)
```

---

## `packages/view-three`
**Name**: `@refinery/view-three`
**Version**: 0.0.0
**Private**: 
**Purpose**: *No description provided.*

### Build Status
**Status**: ✅ Success

### Test Status
**Status**: ✅ Passed
**Coverage**: *Not reported.*
```

> @refinery/view-three@0.0.0 test /Users/williambarron/hallucination-refinery/refinery-mono/packages/view-three
> jest --config ./jest.config.cjs

(node:57165) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
FAIL src/__tests__/dialSnap.test.ts
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /Users/williambarron/hallucination-refinery/refinery-mono/packages/ideanode/src/index.js:4
    export const originalPlaceholderNodes = [/* ───── Roots (tier 0) ───── */
    ^^^^^^

    SyntaxError: Unexpected token 'export'

    > 1 | import {
        | ^
      2 |   IdeaNode,
      3 |   placeholderInitialNodes,
      4 |   placeholderInitialLinks,

      at Runtime.createScriptFromCode (../../node_modules/.pnpm/jest-runtime@29.7.0/node_modules/jest-runtime/build/index.js:1505:14)
      at Object.<anonymous> (../interaction/src/reducer.ts:1:1)
      at Object.<anonymous> (../interaction/src/InteractionProvider.tsx:12:1)
      at Object.<anonymous> (../interaction/src/index.ts:4:1)
      at Object.<anonymous> (src/XYPad.tsx:4:1)
      at Object.<anonymous> (src/__tests__/dialSnap.test.ts:1:1)

(node:57166) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
FAIL src/__tests__/XYPad.test.tsx
  ● Test suite failed to run

    Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

    By default "node_modules" folder is ignored by transformers.

    Here's what you can do:
     • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
     • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
     • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
     • If you need a custom transformation specify a "transform" option in your config.
     • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

    You'll find more details and examples of these config options in the docs:
    https://jestjs.io/docs/configuration
    For information about custom transformations, see:
    https://jestjs.io/docs/code-transformation

    Details:

    /Users/williambarron/hallucination-refinery/refinery-mono/packages/ideanode/src/index.js:4
    export const originalPlaceholderNodes = [/* ───── Roots (tier 0) ───── */
    ^^^^^^

    SyntaxError: Unexpected token 'export'

    > 1 | import {
        | ^
      2 |   IdeaNode,
      3 |   placeholderInitialNodes,
      4 |   placeholderInitialLinks,

      at Runtime.createScriptFromCode (../../node_modules/.pnpm/jest-runtime@29.7.0/node_modules/jest-runtime/build/index.js:1505:14)
      at Object.<anonymous> (../interaction/src/reducer.ts:1:1)
      at Object.<anonymous> (../interaction/src/InteractionProvider.tsx:12:1)
      at Object.<anonymous> (../interaction/src/index.ts:4:1)
      at Object.<anonymous> (src/__tests__/XYPad.test.tsx:4:1)

Test Suites: 2 failed, 2 total
Tests:       0 total
Snapshots:   0 total
Time:        1.312 s
Ran all test suites.
/Users/williambarron/hallucination-refinery/refinery-mono/packages/view-three:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  @refinery/view-three@0.0.0 test: `jest --config ./jest.config.cjs`
Exit status 1
```

---

## `packages/voice`
**Name**: `@refinery/voice`
**Version**: 0.1.0
**Private**: true
**Purpose**: *No description provided.*

### Build Status
**Status**: ❌ Failed
```

> @refinery/voice@0.1.0 build /Users/williambarron/hallucination-refinery/refinery-mono/packages/voice
> tsc -p .

src/RealtimeClient.ts(8,24): error TS6059: File '/Users/williambarron/hallucination-refinery/refinery-mono/packages/shared/src/index.ts' is not under 'rootDir' '/Users/williambarron/hallucination-refinery/refinery-mono/packages/voice/src'. 'rootDir' is expected to contain all source files.
src/RealtimeClient.ts(8,24): error TS6307: File '/Users/williambarron/hallucination-refinery/refinery-mono/packages/shared/src/index.ts' is not listed within the file list of project '/Users/williambarron/hallucination-refinery/refinery-mono/packages/voice/tsconfig.json'. Projects must list all files or use an 'include' pattern.
../shared/src/index.ts(4,24): error TS6059: File '/Users/williambarron/hallucination-refinery/refinery-mono/packages/shared/src/logger.ts' is not under 'rootDir' '/Users/williambarron/hallucination-refinery/refinery-mono/packages/voice/src'. 'rootDir' is expected to contain all source files.
../shared/src/index.ts(4,24): error TS6307: File '/Users/williambarron/hallucination-refinery/refinery-mono/packages/shared/src/logger.ts' is not listed within the file list of project '/Users/williambarron/hallucination-refinery/refinery-mono/packages/voice/tsconfig.json'. Projects must list all files or use an 'include' pattern.
/Users/williambarron/hallucination-refinery/refinery-mono/packages/voice:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  @refinery/voice@0.1.0 build: `tsc -p .`
Exit status 2
```

### Test Status
**Status**: ℹ️ No test script.

---

# Inventory Summary

- **Blocked Packages**: The majority of packages and all applications are currently **blocked** due to build failures. The recurring `error TS6059: File ... is not under 'rootDir'` suggests a systemic misconfiguration in the TypeScript project references (`tsconfig.json` files) across the monorepo. The applications also suffer from numerous linting errors that are causing their builds to fail.
- **Experimental Packages**: The `packages/ideanode` package has several backup files (`index.ts.backup`, `index.ts 2.backup`), which indicates it is likely undergoing heavy, potentially breaking changes and can be considered **experimental**. Given the widespread build and test failures, many other packages may also be in a de-facto experimental state.
- **Deprecated Packages**: There are no explicit indicators of deprecated packages from the inventory scan.
- **Test Coverage**: Test coverage is very low or non-existent across the repository. Several packages have a "test" script that simply exits with an error. The few packages with actual tests are failing, preventing any meaningful coverage analysis.

