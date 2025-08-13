# MET-Like Morph Vision

**Last Updated:** 8:30 PM EST, 12-08-2025

## What We're Building Instead of Force-Graph

Replace the force-graph with a stable latent-space projection where:

- Nodes positioned by semantic similarity (computed server-side)
- No physics, no springs, no drift
- Smooth pan/zoom like the MET Museum demo
- 60fps with 1000+ nodes

## Required Behaviors

### Lens Switching

- When user switches lens (Causal/Affinity/Temporal), nodes animate to new positions
- Animation duration: 300-800ms (designer discretion)
- During animation, interactions temporarily disabled
- After animation, all interactions resume

### Visual Stability

- Node positions deterministic for given lens + data
- Users can build spatial memory
- Zoom/pan doesn't change node relationships
- Timeline scrub only affects opacity, not position

### Optional Edge Overlay

- Edges can be toggled on/off
- When visible, they show relationships without spring physics
- Pure visual connections, not force simulation
- Toggle is instant or quick fade (designer discretion)

## Why This Matters for Thursday Demo

The force-graph approach:

- Can't scale past 5k nodes
- Constantly moves (breaks user orientation)
- Positions are meaningless (just physics optimization)

The latent-space approach:

- Scales to 50k+ nodes (GPU instancing)
- Stable positions encode meaning
- Matches Cryptiq's need for reflective exploration

## Implementation Notes

Use the same prop interface as ForceGraphAdapter but ignore physics-related methods. Pre-computed positions come from enrichment API or are calculated once on load.
