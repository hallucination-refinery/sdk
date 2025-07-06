'use client'

import { useEffect } from 'react'
import { IdeaCanvas } from '@refinery/sdk-core'
import { CanvasProvider, useCanvas } from '@refinery/canvas-r3f'
import { forgeGraph } from '@refinery/graph-forge'
import type { IdeaNode, Edge } from '@refinery/schema'

// Generate sample data
const generateSampleData = () => {
  const nodes: IdeaNode[] = []
  const edges: Edge[] = []

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

function MindMapCanvas() {
  const { state, enqueueCommands } = useCanvas()

  useEffect(() => {
    const data = generateSampleData()
    const forged = forgeGraph(data)

    // Load the graph into canvas state
    const commands = [
      ...forged.nodes.map((node) => ({
        type: 'ADD_NODE' as const,
        payload: { node },
      })),
      ...forged.edges.map((edge) => ({
        type: 'ADD_EDGE' as const,
        payload: { edge },
      })),
    ]

    enqueueCommands(commands)
  }, [enqueueCommands])

  return (
    <IdeaCanvas
      nodes={Array.from(state.nodes.values())}
      edges={Array.from(state.edges.values())}
      selectedNodeIds={state.selectedNodeIds}
      selectedEdgeIds={state.selectedEdgeIds}
      hoveredNodeId={state.hoveredNodeId}
      hoveredEdgeId={state.hoveredEdgeId}
      camera={state.camera}
      zoom={state.zoom}
      theme={state.theme}
      highlightedNodes={state.highlightedNodes}
      highlightedEdges={state.highlightedEdges}
      onCommand={(cmd) => enqueueCommands([cmd])}
      className="w-full h-full"
    />
  )
}

export default function Home() {
  return (
    <main className="w-screen h-screen bg-gray-50">
      <div className="h-full">
        <CanvasProvider>
          <MindMapCanvas />
        </CanvasProvider>
      </div>
    </main>
  )
}
