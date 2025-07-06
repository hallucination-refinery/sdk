'use client'

import { IdeaAperture } from '@refinery/widget-aperture'
import { ApertureThemeProvider } from '@refinery/widget-aperture'
import type { Graph } from '@refinery/schema'

// Generate sample data
const generateSampleGraph = (): Graph => {
  const nodes = []
  const edges = []

  // Create central node
  nodes.push({
    id: 'center',
    label: 'Cryptiq Mind Map',
    position: { x: 0, y: 0, z: 0 },
  })

  // Create topic nodes
  const topics = [
    'Product Features',
    'User Research',
    'Technical Architecture',
    'Marketing Strategy',
    'Competitive Analysis',
    'Roadmap',
  ]

  topics.forEach((topic, i) => {
    const angle = (i / topics.length) * Math.PI * 2
    const radius = 200
    const id = `topic-${i}`

    nodes.push({
      id,
      label: topic,
      position: {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: 0,
      },
    })

    edges.push({
      id: `edge-center-${id}`,
      source: 'center',
      target: id,
      type: 'relates-to' as const,
      strength: 1,
      directed: false,
      visible: true,
    })

    // Add sub-nodes
    for (let j = 0; j < 3; j++) {
      const subId = `${id}-sub-${j}`
      const subAngle = angle + (j - 1) * 0.3
      const subRadius = radius + 100

      nodes.push({
        id: subId,
        label: `${topic} Item ${j + 1}`,
        position: {
          x: Math.cos(subAngle) * subRadius,
          y: Math.sin(subAngle) * subRadius,
          z: 0,
        },
      })

      edges.push({
        id: `edge-${id}-${subId}`,
        source: id,
        target: subId,
        type: 'contains' as const,
        strength: 0.8,
        directed: true,
        visible: true,
      })
    }
  })

  return { nodes, edges }
}

export default function Home() {
  const graph = generateSampleGraph()

  return (
    <main className="w-screen h-screen">
      <ApertureThemeProvider>
        <IdeaAperture graph={graph} showHelp={false} ariaLabel="Cryptiq Mind Map Demo" />
      </ApertureThemeProvider>
    </main>
  )
}
