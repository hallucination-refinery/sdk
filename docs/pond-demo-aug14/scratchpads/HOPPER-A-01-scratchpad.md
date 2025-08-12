# HOPPER-A-01 Scratchpad
## Task Start: 12-08-2025

## 1. DECOMPOSE - Task Verbatim

**NAME:** HOPPER-A
**TASK:** Document the complete current state of ForceGraph integration by analyzing @CrypticAnimusScene.tsx @ForceGraphAdapter.tsx interfaces, creating codebase-current-state.md and dependency-analysis.md in @docs/pond-demo-aug14/guides. Document **every action and thought** in your scratchpad; make atomic commits.

**WARNING:** Must capture *EVERY* prop, method, and integration point that canvas-latent implementation must satisfy; miss nothing.

**SUCCESS CRITERIA:** Complete interface signatures documented, dependency tree mapped, Three.js/React patterns catalogued, state management flow diagrammed.

## 2. PLAN - Subtask Breakdown

### Phase 1: Source Analysis
- [ ] Locate CrypticAnimusScene.tsx
- [ ] Analyze all props, state, and methods
- [ ] Locate ForceGraphAdapter.tsx  
- [ ] Document all interfaces and integration points
- [ ] Map data flow between components

### Phase 2: Documentation Creation
- [ ] Create codebase-current-state.md with:
  - Complete interface signatures
  - All props with types
  - All methods with signatures
  - State management patterns
- [ ] Create dependency-analysis.md with:
  - Full dependency tree
  - Three.js patterns used
  - React patterns catalogued
  - Integration architecture

### Phase 3: Verification
- [ ] Cross-check against working-doc.md claims
- [ ] Verify all integration points captured
- [ ] Ensure no missing interfaces

## 3. PROBE - Falsifiable OODA Loops

### Loop 1: File Discovery
- **Observe:** Search for target files
- **Orient:** Map file locations and imports
- **Decide:** Determine analysis order
- **Act:** Begin systematic analysis

### Loop 2: Interface Documentation
- **Observe:** Extract all type definitions
- **Orient:** Map relationships between types
- **Decide:** Structure documentation hierarchy
- **Act:** Document comprehensively

## 4. SEQUENCE - Execution Order

1. Create scratchpad (THIS FILE) ✓
2. Find CrypticAnimusScene.tsx
3. Analyze and document all interfaces
4. Find ForceGraphAdapter.tsx
5. Document integration points
6. Create codebase-current-state.md
7. Create dependency-analysis.md
8. Atomic commits throughout

## 5. EXECUTION LOG

### Action 1: Created scratchpad
- Time: [Starting now]
- Created HOPPER-A-01-scratchpad.md
- Documented task decomposition

### Action 2: Searching for source files
- Next: Use Glob to find CrypticAnimusScene.tsx and ForceGraphAdapter.tsx
- Found: /workspace/apps/legacy-import/cryptic-vault-demo/components/CrypticAnimusScene.tsx
- Found: /workspace/packages/canvas-r3f/src/adapters/ForceGraphAdapter.tsx

### Action 3: Analyzed CrypticAnimusScene.tsx
- Lines: 1152
- Key Props Interface: CrypticAnimusSceneProps (lines 41-59)
- Key dependencies: ForceGraphAdapter, Three.js, @react-three/fiber
- State management: useRef for graph data, physics control
- Custom node rendering with sprites
- Complex filtering logic for visibility

### Action 4: Analyzed ForceGraphAdapter.tsx  
- Lines: 419
- Key Props Interface: ForceGraphAdapterProps (lines 27-84)
- Key Ref Interface: ForceGraphAdapterRef (lines 86-121)
- Wraps r3f-forcegraph library
- Provides imperative methods: highlightNode, selectNode
- Handles physics simulation via d3Force
- Material mutations for visual feedback

### Action 5: Creating documentation files
- Creating codebase-current-state.md
- Creating dependency-analysis.md