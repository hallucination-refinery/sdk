'use client'

import { useState, useCallback } from 'react'
// Temporarily disable aperture widget imports to fix missing module in dev
const ApertureThemeProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>
const IdeaAperture = (_props: any) => null
import type { Graph } from '@refinery/schema'
import CategoryHUD from '../components/CategoryHUD'
import ControlsHUD from '../components/ControlsHUD'

// Generate 1k nodes optimized for performance
const generate1kNodeGraph = (): Graph => {
  const nodes = []
  const edges = []

  // Create central node
  nodes.push({
    id: 'center',
    label: 'Cryptiq Knowledge Graph',
    position: { x: 0, y: 0, z: 0 },
  })

  // First level - 8 main categories
  const categories = [
    'Technology',
    'Science',
    'Business',
    'Design',
    'Research',
    'Development',
    'Strategy',
    'Analytics',
  ]

  categories.forEach((category, catIdx) => {
    const catAngle = (catIdx / categories.length) * Math.PI * 2
    const catRadius = 300
    const catId = `cat-${catIdx}`

    nodes.push({
      id: catId,
      label: category,
      position: {
        x: Math.cos(catAngle) * catRadius,
        y: Math.sin(catAngle) * catRadius,
        z: 0,
      },
    })

    edges.push({
      id: `edge-center-${catId}`,
      source: 'center',
      target: catId,
      type: 'relates-to' as const,
      strength: 1,
      directed: false,
      visible: true,
    })

    // Second level - 15 topics per category
    for (let topicIdx = 0; topicIdx < 15; topicIdx++) {
      const topicAngle = catAngle + (topicIdx - 7) * 0.08
      const topicRadius = catRadius + 200
      const topicId = `${catId}-topic-${topicIdx}`

      nodes.push({
        id: topicId,
        label: `${category} Topic ${topicIdx + 1}`,
        position: {
          x: Math.cos(topicAngle) * topicRadius,
          y: Math.sin(topicAngle) * topicRadius,
          z: Math.random() * 100 - 50, // Add slight z variation
        },
      })

      edges.push({
        id: `edge-${catId}-${topicId}`,
        source: catId,
        target: topicId,
        type: 'contains' as const,
        strength: 0.8,
        directed: true,
        visible: true,
      })

      // Third level - 8 items per topic (until we reach ~1000 nodes)
      const itemsPerTopic = nodes.length < 950 ? 8 : Math.max(0, 1000 - nodes.length)

      for (let itemIdx = 0; itemIdx < itemsPerTopic && nodes.length < 1000; itemIdx++) {
        const itemAngle = topicAngle + (itemIdx - 3.5) * 0.05
        const itemRadius = topicRadius + 150
        const itemId = `${topicId}-item-${itemIdx}`

        nodes.push({
          id: itemId,
          label: `Item ${nodes.length}`,
          position: {
            x: Math.cos(itemAngle) * itemRadius,
            y: Math.sin(itemAngle) * itemRadius,
            z: Math.random() * 150 - 75,
          },
        })

        // Only add edges for a subset to reduce rendering load
        if (Math.random() > 0.3) {
          edges.push({
            id: `edge-${topicId}-${itemId}`,
            source: topicId,
            target: itemId,
            type: 'contains' as const,
            strength: 0.6,
            directed: true,
            visible: true,
          })
        }
      }
    }
  })

  console.log(`Generated ${nodes.length} nodes and ${edges.length} edges`)
  return { nodes, edges }
}

export default function Home() {
  const [fullGraph] = useState(() => generate1kNodeGraph())
  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set())

  // Filter nodes based on active categories
  const filteredGraph = useCallback(() => {
    // If no categories or all categories are active, show full graph
    if (activeCategories.size === 0 || activeCategories.size === 8) return fullGraph

    const filteredNodes = fullGraph.nodes.filter((node) => {
      if (node.id === 'center') return true // Always show center node

      // Check if node belongs to an active category
      const match = node.label?.match(
        /^(Technology|Science|Business|Design|Research|Development|Strategy|Analytics)/
      )
      return match ? activeCategories.has(match[1]) : !match // Include nodes without categories too
    })

    const nodeIds = new Set(filteredNodes.map((n) => n.id))
    const filteredEdges = fullGraph.edges.filter(
      (edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target)
    )

    return { nodes: filteredNodes, edges: filteredEdges }
  }, [fullGraph, activeCategories])

  return (
    <main className="w-screen h-screen">
      <ApertureThemeProvider>
        <IdeaAperture graph={filteredGraph()} showHelp={false} ariaLabel="Cryptiq Mind Map Demo" />
        <CategoryHUD nodes={fullGraph.nodes} onCategoriesChange={setActiveCategories} />
        <ControlsHUD />
      </ApertureThemeProvider>
    </main>
  )
}
