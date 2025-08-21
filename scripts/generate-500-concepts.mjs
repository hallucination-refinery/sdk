#!/usr/bin/env node
import fs from 'node:fs'

const regions = ['frontal', 'parietal', 'temporal', 'occipital']
const labels = [
  'Cognition', 'Memory', 'Language', 'Vision', 'Attention', 'Emotion',
  'Planning', 'Motor Control', 'Spatial Awareness', 'Decision Making',
  'Learning', 'Reasoning', 'Perception', 'Consciousness', 'Creativity',
  'Problem Solving', 'Social Cognition', 'Executive Function', 'Working Memory',
  'Long-term Memory', 'Sensory Processing', 'Abstract Thinking', 'Pattern Recognition',
  'Face Recognition', 'Object Recognition', 'Auditory Processing', 'Touch Sensation',
  'Pain Processing', 'Temperature Sensing', 'Balance', 'Coordination'
]

const concepts = []
for (let i = 1; i <= 500; i++) {
  const id = `c${String(i).padStart(3, '0')}`
  const label = labels[i % labels.length] + (i > labels.length ? ` ${Math.floor(i / labels.length)}` : '')
  const group = regions[i % regions.length]
  const weight = 0.5 + (Math.sin(i * 0.1) * 0.4) // Deterministic weight between 0.1 and 0.9
  
  concepts.push({
    id,
    label,
    group,
    properties: { weight: Math.round(weight * 100) / 100 }
  })
}

const output = { concepts }
fs.writeFileSync('packages/canvas-r3f/fixtures/concepts-500.json', JSON.stringify(output, null, 2))
console.log('Generated 500 concepts')