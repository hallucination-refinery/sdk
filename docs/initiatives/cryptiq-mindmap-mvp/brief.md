# Cryptiq Mindmap Alignment Brief

Last updated: <2025-08-19>

## Vision & Purpose

Cryptiq Mindmap is a self-contained, web-based Refinery SDK promotional demo meant to showcase the SDK’s range. It also represents a collaboration with Cryptiq, a privacy-first memory vault combining encrypted storage and bespoke AI tools. The experience enriches your Cryptiq memories by deriving structure—identifying entities, categories, and relationships—and renders them as a canvas/graph of nodes and edges. You then explore this enriched graph through multiple lenses (causal, affinity, temporal) to reveal connections, while timeline scrubbing, filters, and focused highlighting progressively surface patterns and gaps to support self-reflection, open-ended exploration, and discovery.

## End-User Experience

- **Arrive:** A glowing wireframe **brain** fills the canvas; thousands of particle “neurons” are anchored to its surface; a minimal HUD is visible.
- **Focus:** Hover never moves nodes; click a neuron to highlight it and its **synaptic arcs**; a details panel opens.
- **Refine:** Filters/tags and the **timeline** fade or reveal neurons/edges while positions stay fixed.
- **Reframe:** Switching **Affinity / Temporal / Causal** changes color/size/brightness and edge pulses to expose patterns—the brain silhouette remains stable.

## Features

- Deterministic, **physics-free** layout; neurons mapped to **brain-surface vertices**; positions static (lenses animate attributes, not geometry).
- **Synapse edges** (curved, glowing) with optional directional pulses; neighbor highlight on selection.
- Lenses: **Affinity** (category→color), **Temporal** (time→brightness/visibility via slider), **Causal** (animated pulses along connected edges).
- Search, tag/category filters, timeline scrub; pin/snapshot current view.

## Interface

- **HUD:** search, lens switcher, filter chips, **timeline**, edge toggle, snapshot.
- **Canvas:** pan/zoom (optional box-select); stable brain silhouette between lens changes.
- **Details Panel:** on selection shows preview, key fields, related nodes/edges.
- **Visual Controls:** opacity for non-matches, pulse toggle, color legend.

## Clarification

    •	Nodes in the visualization are derived concepts/themes, not individual memories; neurons on the brain represent concepts, and memories serve as provenance.
    •	The immutable memories[] is input only; the enrichment pipeline must aggregate → derive concept nodes and edges, preserving createdFrom: MemoryID[] links for details.
    •	Edges operate between concepts per lens (Affinity/Temporal/Causal), using memory-derived signals (e.g., co-occurrence, temporal co-evolution, inferred direction) but not connecting raw memories.
    •	Timeline/filters modulate concept visibility/attributes via aggregated memory stats (firstDate/lastDate, counts, recency), while the layout remains deterministic and physics-free.
    •	Any prior specs assuming 1:1 memory→node are incorrect for MVP and must be revised to concept-centric modeling.
    •	“Freedom to change node/edge structures” is only to improve the experience; choices that degrade clarity (e.g., rendering all memories as nodes) are out of scope.

### Cryptiq Memories Data Structure

We cannot **change** this.JSON object with: memories: array of items { id: string, sentence: string, conceptIds: string[], secret: boolean, date: YYYY-MM-DD, originalCategory: string }

`json
{
  "memories": [
    {
      "id": "m_001",
      "sentence": "This user values authenticity but is learning to balance honesty with sensitivity.",
      "conceptIds": ["c_001", "c_004"],
      "secret": false,
      "date": "2025-06-21",
      "originalCategory": "Relationships"
    },
    {
      "id": "m_002",
      "sentence": "This user uses AI to plan new ideas and reflects on their creative process.",
      "conceptIds": ["c_015", "c_047"],
      "secret": true,
      "date": "2025-06-22",
      "originalCategory": "About Me"
    }
  ]
}
`

### Legacy Cryptiq Mindmap Demo Data Structure

We can change this depending on implementation requirements:

1. Node model: Each node represents a derived concept from memories with fields like id, title/full_title, type (e.g., value/goal/trait/outcome/catalyst), ring (0–2 for “distance”/grouping), cluster (theme/category), secret (boolean), firstDate/lastDate (for timeline), and createdFrom (array of memory IDs that birthed this concept).
2. Edge model (per lens): Edges are partitioned by lens into edges_causal, edges_affinity, and edges_temporal; each edge has at least id, source, target and may carry weight/confidence; switching lenses swaps the active edge set while the node set stays the same.
3. Clusters: Clusters are thematic groupings (e.g., Relationships, Anxiety & Coping) referenced by each node’s cluster field; they drive color-coding and filtering and may be backed by a cluster name/color map in the data.
4. Relationships: Nodes link to the memories that created them via createdFrom; edges connect node ids, and timeline visibility is derived from node firstDate (edges only render if both endpoints are currently visible).
5. Interaction across structures: Lens selection chooses the edge set; timeline and filters reduce the visible node/edge subset; cluster membership informs styling and category filters without changing topology.

### Three.js 'Brain' Repo

Below is a proposal from Google Gemini for how to adapt the following (repo)[https://github.com/iamwallam/3dbrain] to our use-case.

```
### Analysis of the Video vs. the Code

After careful review, here is what is happening in the video and how it connects to the code:

1.  **The Glowing Wireframe Brain:**
    * **What we see:** A semi-transparent, glowing, blueish wireframe of a brain.
    * **How it works (`src/components/Brain/`):** This is handled by loading the `brain.obj` model and applying a custom GLSL shader (`vertex.glsl`, `fragment.glsl`). This shader is what gives the lines their glowing, non-solid appearance. **This is the perfect canvas for your mindmap.**

2.  **The Animated Particles (The "Neurons"):**
    * **What we see:** A dense cloud of white particles that perfectly outlines the brain's shape, creating a shimmering, "living" texture on its surface. There is also a constant, gentle "flow" or "drift" of these particles in one direction.
    * **How it works (`src/components/Particles/`):** This is the most important part. The code generates thousands of particles and places them randomly *inside a sphere*. The reason they *look* like they are on the brain's surface is a clever illusion: the wireframe is drawn on top, giving the impression that the particles are attached to it. The "flow" effect is achieved in the particle's vertex shader (`src/components/Particles/shaders/vertex.glsl`), which constantly updates the `z` position of every particle, creating a steady drift.

### The Refined Plan: Making the Brain Your Mindmap

The goal is to stop faking the effect and make it real by using your data. We will make the brain model a true representation of your Cryptiq Mindmap.

Here is a more accurate, step-by-step guide:

#### **Step 1: Keep the Brain as Your Canvas**

Do not change the `Brain` component. The visual style is exactly what you need.

#### **Step 2: Turn Your Nodes into "Neurons" on the Brain's Surface**

This is the key modification. We will change the particle system from a random sphere into a precise map of your data.

* **Location:** `src/components/Particles/index.js`
* **Action:**
    1.  **Get Brain Geometry:** In this file, you will need to access the loaded brain model's geometry (the array of its vertices).
    2.  **Map Nodes to Vertices:** Instead of the `for` loop that creates random positions in a sphere, you will loop through your Cryptiq Mindmap nodes. For each of your nodes, you will randomly select a vertex from the brain's geometry and assign its `x, y, z` coordinates to your node's particle.
    3.  This will ensure your nodes are **actually located on the surface of the brain**, making the visual connection explicit and meaningful.

#### **Step 3: Draw Your Edges as "Synapses"**

The video does not have visible connections between its particles, but your mindmap does. This is where you will add a new, powerful visual layer.

* **Location:** This will be a new module/component you create.
* **Action:**
    1.  For each relationship (edge) in your data, find the 3D positions of the two nodes it connects (which are now on the brain's surface).
    2.  Use `THREE.TubeGeometry` to draw a curved, glowing line between these two points. This will create stunning "synapse" arcs that travel across the brain's surface.
    3.  You can animate a pulse of light along these tubes to represent the direction of a causal link or the "firing" of a memory.

#### **Step 4: Use Shaders to Implement Your "Lenses"**

The existing shader animation is the key to your interactive lenses.

* **Location:** `src/components/Particles/shaders/` (for nodes) and a new shader for your edges.
* **Action:**
    * **Affinity Lens:** Pass the "category" of each node as an attribute to the shader. The fragment shader can then set the particle's color based on its category.
    * **Temporal Lens:** Pass a `timestamp` for each node. You can then have a slider in your UI that sends a "currentTime" uniform to the shader. The shader can then increase the size (`gl_PointSize`) or brightness of nodes whose timestamp is close to the `currentTime`.
    * **Causal Lens:** When a user focuses on a node, you can trigger an animation along the "synapse" tubes connected to it, showing the flow of causality.

By following this revised plan, you will directly achieve your goal: the brain will not just be a decorative object but will become the living, breathing structure of your Cryptiq Mindmap, with your data points as its neurons and their relationships as its synapses.
```
