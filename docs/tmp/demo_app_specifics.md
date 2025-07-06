# 5. Demo-app specifics
--------------------------

## a) Entry files and primary React root components

### `apps/animus-demo`
- **Entry File (Layout):** `apps/animus-demo/app/layout.tsx`
- **Root Layout Component:** `RootLayout` (wraps children in `HUDToastProvider` and `InteractionProvider`).
- **Entry File (Page):** `apps/animus-demo/app/page.tsx`
- **Primary Page Component:** `Landing`.

### `apps/cryptic-vault-demo`
- **Entry File (Layout):** `apps/cryptic-vault-demo/app/layout.tsx`
- **Root Layout Component:** `RootLayout` (wraps children in `InteractionProvider`).
- **Entry File (Page):** `apps/cryptic-vault-demo/app/page.tsx`
- **Primary Page Component:** `Home`, which dynamically loads the `CrypticVaultScene` component.

### `apps/jam-session-demo`
- **Entry File (Layout):** `apps/jam-session-demo/app/layout.tsx`
- **Root Layout Component:** `RootLayout` (no special providers).
- **Entry File (Page):** `apps/jam-session-demo/app/page.tsx`
- **Primary Page Component:** `JamSessionPage`, which renders a `ParticleSystem` component.

## b) Custom loaders/helpers that ingest raw memory JSON

### `apps/cryptic-vault-demo`
This app is heavily data-driven and uses a combination of direct `require` calls and processing scripts to load its graph data.
- **Direct Loading**: The main component at `apps/cryptic-vault-demo/components/CrypticVaultScene.tsx` directly ingests data using:
  - `require('@/data/graph_bundle.json')`
  - `require('@/data/concepts.json')`
- **Processing Scripts**: The `apps/cryptic-vault-demo/scripts/` directory contains crucial helpers for generating the JSON data from other formats:
  - `csv-to-json.js`: Converts `memories.csv` into the `memories.json` format.
  - `parse-cryptic-data.js`: A more advanced script that reads a `full-synthetic-data.csv`, intelligently builds connections based on shared tags and dates, and outputs `memories.json`.

### `apps/animus-demo`
This app uses a more dynamic, API-driven approach to loading graph data.
- **API Routes**:
  - `apps/animus-demo/app/api/generate-concepts/route.ts`: Takes a seed prompt, generates concepts (likely via `@refinery/ai-ranker`), and returns them as nodes and links.
  - `apps/animus-demo/app/api/ingest/route.ts`: Handles file uploads (e.g., via drag-and-drop) and processes them into graph data.
- **Client-side Helpers**:
  - `jsonToNodesLinks` from `@refinery/ai-ranker`: This function is used on the client-side (in `app/canvas/page.tsx`) to process the JSON response from the concept generation API.
- **Data Generation for Testing**:
  - `generateStressTestData()`: A local function in `app/canvas/page.tsx` that programmatically generates a large graph for performance testing.
  - `genRandomTree()`: A helper in `lib/random-data.js` for creating random graph data.
- **Placeholder Data**:
  - It imports `placeholderInitialNodes` and `placeholderInitialLinks` from `@refinery/ideanode` as a default starting graph.

### `apps/jam-session-demo`
This app does not load any external JSON data for its visualization. Its data is generated internally by:
- **Audio Analysis**: Components like `AudioEngine.tsx` and `AudioFileEngine.tsx` analyze audio from a file or synthesized sounds and produce `AudioData` objects in real-time to drive the particle system.

## c) Canvas initial camera position and default colour palette

### `apps/animus-demo`
- **Camera Position**: In `app/canvas/page.tsx`, the `<Canvas>` is initialized with `camera={{ position: [0, 0, 100], fov: 50, far: 2000 }}`.
- **Color Palette**:
  - The background color is driven by CSS variables: `background: 'hsl(var(--background))'`. The variables in `app/globals.css` define `--background: 0 0% 98%` for light mode and `--background: 0 0% 3.9%` for dark mode.
  - Lighting consists of `<ambientLight intensity={1.0} />` and `<directionalLight position={[30, 30, 30]} intensity={1.5} />`.
  - A full color system is defined in `tailwind.config.js` using shadcn/ui conventions.

### `apps/cryptic-vault-demo`
- **Camera Position**: In `components/CrypticVaultScene.tsx`, the `<Canvas>` is initialized with `camera={{ position: [0, 0, 100], fov: 50, far: 5000 }}`.
- **Color Palette**:
  - The background color is explicitly set to `#EDE4D7`.
  - Lighting consists of `<ambientLight intensity={0.5} />` and `<directionalLight position={[10, 10, 10]} intensity={1} />`.
  - A rich, semantic color palette is defined in `utils/clusterPalette.ts`, exporting `NODE_TYPE_COLORS`, `CLUSTER_COLORS`, and `LINK_COLORS`. These are used to dynamically color nodes and links.
  - The `tailwind.config.js` also defines theme-specific colors like `cryptic: '#7C3AED'`.

### `apps/jam-session-demo`
- **Camera Position**: In `app/page.tsx`, the `<Canvas>` is initialized with `camera={{ position: [600, 400, 800], fov: 60, near: 1, far: 5000 }}`.
- **Color Palette**:
  - The background color is hard-coded to black: `style={{ background: '#000' }}`.
  - Lighting consists of `<ambientLight intensity={0.5} />` and `<pointLight position={[10, 10, 10]} />`.
  - Particle colors appear to be calculated dynamically based on the audio analysis, likely transitioning between blue and purple based on the code in `ParticleSystem.tsx`.

## d) Duplicated logic that already exists in `packages/*`

This analysis identifies code within the `apps/*` directories that could or should be generalized and moved into a shared `packages/*` directory.

### `apps/cryptic-vault-demo`
- **File**: `utils/graphTraversal.ts`
  - **Logic**: Contains the `performTwoHopTraversal` function.
  - **Duplication**: This is a pure, reusable graph traversal algorithm. It has no React or component-specific code.
  - **Recommendation**: This logic should be moved to a shared graph utility package, such as `@refinery/thinkable` or a new, dedicated graph algorithms package.

- **File**: `components/CrypticNodeSprite.tsx`
  - **Logic**: Contains sophisticated logic for rendering a node to a sprite, including text wrapping, caching, and dynamic coloring based on node state.
  - **Duplication**: While the color palette is specific to this demo, the core functionality of creating a dynamic sprite for a graph node is highly reusable. The `@refinery/view-three` package likely has or needs a base component for this, which this implementation could extend or replace.
  - **Recommendation**: Refactor this into a generic `NodeSprite` component in `@refinery/view-three` and allow for theme/style injection.

### `apps/jam-session-demo`
- **File**: `components/ParticleSystem.tsx`
  - **Logic**: A complex Three.js component that renders and animates a large number of particles.
  - **Duplication**: Although its animation is driven by audio data specific to this demo, the core particle system (instanced meshes, physics, rendering) is a generic visual component.
  - **Recommendation**: Create a generic `ParticleSystem` component in `@refinery/view-three` that accepts a data-driver function (e.g., `onUpdate(particles)`) to control animation.

### `apps/animus-demo`
- **File**: `lib/utils.ts`
  - **Logic**: Contains the `cn` utility function for merging Tailwind CSS classes.
  - **Duplication**: This is a minor case. While this is a common utility, it's often included per-project when using `shadcn/ui`. However, if other apps or packages need this, it could be moved to `@refinery/shared`.
  - **Recommendation**: Low priority, but consider moving to `@refinery/shared` if used elsewhere. 