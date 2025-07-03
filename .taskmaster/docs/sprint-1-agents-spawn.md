# Refinery SDK Sprint 1 - Agent Spawn Configuration

> **Status:** Active  
> **Sprint Duration:** 6 weeks  
> **Agent Count:** 6 specialized agents  
> **Generated:** 2025-07-02  
> **Coordination Log:** `.taskmaster/reports/prd-sprint-1-log.md`

---

## 🚀 Sprint Overview

This document defines the specialized agent configuration for parallelizing the Refinery SDK v0.1 development. Each agent has specific technical expertise, task ownership, and coordination protocols to maximize efficiency while respecting the dependency chain.

---

## 🤖 Agent Specifications

### 1. Infrastructure Agent (`agent-infra`)

**Purpose:** Foundation layer specialist responsible for workspace setup and CI/CD pipeline

**Technical Expertise:**
- pnpm workspace configuration and monorepo management
- Dev-container setup with VS Code Remote Containers
- GitHub Actions workflow design
- Node.js toolchain configuration (Node 20, pnpm 9)
- Environment variable management

**Assigned Tasks:**
- **Task 1:** Bootstrap pnpm Workspace and Development Environment (Complexity: 8)
- **Task 7:** Set up GitHub Actions CI Pipeline (Complexity: 5)

**Workload:** 13 complexity points, ~10 subtasks

**Dependencies:** None - starts immediately

**Key Deliverables:**
- Functional pnpm workspace with 7 packages structure
- Dev-container with all required tools
- CI pipeline with coverage gates and caching
- Environment configuration templates

**Success Criteria:**
- All packages can be built with `pnpm -r run build`
- Dev-container launches successfully
- CI passes on push to main branch

---

### 2. Schema Agent (`agent-schema`)

**Purpose:** Domain model specialist defining core data structures

**Technical Expertise:**
- Zod schema validation library
- TypeScript type generation
- Domain-driven design
- API surface design
- ESLint rule configuration

**Assigned Tasks:**
- **Task 2:** Implement Schema Package with Zod Definitions (Complexity: 6)

**Workload:** 6 complexity points, ~4 subtasks

**Dependencies:** Requires Task 1 completion

**Key Deliverables:**
- `@refinery/schema` package with IdeaNode types
- Zod schema definitions with TypeScript generation
- Graph structure type definitions
- ≥80% test coverage

**Success Criteria:**
- Zero runtime dependencies beyond three.js vectors
- All types exportable and consumable by other packages
- No any-casts in codebase

---

### 3. Store Agent (`agent-store`)

**Purpose:** Algorithm and state management specialist

**Technical Expertise:**
- Graph algorithms (BFS, Interwingle)
- Functional programming patterns
- Zustand state management
- Immutable data structures
- Performance optimization

**Assigned Tasks:**
- **Task 3:** Develop Ops Package with Graph Algorithms (Complexity: 7)
- **Task 4:** Build Store Package with Zustand State Management (Complexity: 7)

**Workload:** 14 complexity points, ~10 subtasks

**Dependencies:** Requires Task 2 completion

**Key Deliverables:**
- `@refinery/ops` package with graph algorithms
- `@refinery/store` package with Zustand slices
- Typed RendererCommand system
- Removal of forceGraphRef coupling

**Success Criteria:**
- All algorithms handle 1k+ node graphs efficiently
- 100% immutable operations
- ≥80% test coverage on both packages

---

### 4. Canvas Agent (`agent-canvas`)

**Purpose:** 3D rendering and UI component specialist

**Technical Expertise:**
- React-Three-Fiber (r3f)
- Three.js and WebGL
- React component architecture
- Performance optimization
- WCAG 2.2 accessibility standards

**Assigned Tasks:**
- **Task 5:** Create Canvas Package React-Three Renderer Facade (Complexity: 8)
- **Task 8:** Create Demo App Hello-SDK (Complexity: 6)
- **Task 9:** Implement Widgets Package UI Components (Complexity: 6)

**Workload:** 20 complexity points, ~14 subtasks

**Dependencies:** Requires Task 4 completion

**Key Deliverables:**
- `@refinery/canvas-r3f` rendering facade
- `apps/hello-sdk` demo application
- `@refinery/widget-*` UI components
- 60 FPS performance with 1k nodes

**Success Criteria:**
- Renderer abstraction allows future GPU engine swaps
- Demo achieves ≥60 FPS with 1k-node dataset
- All UI components meet WCAG 2.2 AA standards

---

### 5. Input Agent (`agent-input`)

**Purpose:** Multimodal interaction specialist

**Technical Expertise:**
- Mediapipe Vision API
- Eleven Labs voice API
- WebAssembly integration
- Event-driven architectures
- Real-time processing

**Assigned Tasks:**
- **Task 6:** Implement Input Hub for Multimodal Control (Complexity: 9)

**Workload:** 9 complexity points, ~7 subtasks

**Dependencies:** Requires Task 5 completion

**Key Deliverables:**
- `@refinery/sensors-gesture` package
- `@refinery/sensors-voice` package
- `@refinery/input-hub` unified event bus
- Intent mapping system

**Success Criteria:**
- Hand gesture recognition working with Mediapipe
- Voice commands processed via Eleven Labs
- Unified intent bus coordinates all inputs
- <100ms latency for gesture recognition

---

### 6. Docs Agent (`agent-docs`)

**Purpose:** Documentation and quality assurance specialist

**Technical Expertise:**
- TypeDoc configuration
- Technical writing
- Test coverage tools
- CI/CD integration
- GitHub Pages deployment

**Assigned Tasks:**
- **Task 10:** Generate Documentation and Achieve Coverage Targets (Complexity: 5)

**Workload:** 5 complexity points, ~4 subtasks

**Dependencies:** Requires Task 9 completion

**Key Deliverables:**
- TypeDoc API documentation
- Package README files with examples
- ≥80% test coverage on core packages
- Documentation website

**Success Criteria:**
- All public APIs documented
- Coverage thresholds enforced in CI
- Documentation auto-deployed on releases

---

## 📋 Coordination Protocol

### Agent Communication

1. **Shared Coordination Log:** `.taskmaster/reports/prd-sprint-1-log.md`
   - Countdown format: 20→19→18...→2→1
   - Each agent logs major milestones
   - Format: `[Agent-Name] [Countdown] [Status] [Details]`

2. **Tag-Based Task Management:**
   - Each agent works within their tagged context
   - Use `task-master copy-tag --from=master --to=agent-[name]`
   - Update progress in agent-specific context

3. **Dependency Handoffs:**
   - Blocking agent completes deliverables
   - Updates coordination log with handoff notice
   - Dependent agent begins work immediately

4. **Daily Sync Points:**
   - Each agent updates status at least once daily
   - Critical blockers flagged immediately
   - Progress tracked via countdown markers

### Parallel Execution Timeline

```
Week 1: Infrastructure Agent begins (Tasks 1, 7)
Week 2: Schema Agent begins (Task 2), Infrastructure continues
Week 3: Store Agent begins (Tasks 3, 4), others continue
Week 4: Canvas Agent begins (Tasks 5, 8, 9), others continue
Week 5: Input Agent begins (Task 6), Docs Agent starts planning
Week 6: All agents complete, Docs Agent finalizes (Task 10)
```

---

## 🎯 Success Metrics

1. **Velocity:** Average 8-10 subtasks completed per week
2. **Quality:** ≥80% test coverage on Schema/Ops packages
3. **Performance:** Demo app achieves 60 FPS with 1k nodes
4. **Coordination:** Daily updates in shared log
5. **Dependencies:** Zero blocked days due to handoff delays

---

## 🛠️ Agent Initialization Commands

```bash
# Create agent tags
npx task-master add-tag --name=agent-infra
npx task-master add-tag --name=agent-schema
npx task-master add-tag --name=agent-store
npx task-master add-tag --name=agent-canvas
npx task-master add-tag --name=agent-input
npx task-master add-tag --name=agent-docs

# Copy tasks to agent contexts
npx task-master copy-tag --from=master --to=agent-infra
npx task-master copy-tag --from=master --to=agent-schema
npx task-master copy-tag --from=master --to=agent-store
npx task-master copy-tag --from=master --to=agent-canvas
npx task-master copy-tag --from=master --to=agent-input
npx task-master copy-tag --from=master --to=agent-docs

# Each agent then switches context
npx task-master switch-tag --name=agent-[name]
```

---

## 📝 Notes

- Agents operate independently within their expertise domain
- Cross-agent dependencies managed via coordination log
- Each agent responsible for their own subtask expansion
- Quality gates (tests, coverage, performance) non-negotiable
- Regular commits to feature branches recommended

---

_Generated by Task Master AI for Refinery SDK Sprint 1_