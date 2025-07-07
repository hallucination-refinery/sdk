import { NextResponse } from 'next/server'
import type { Graph, IdeaNode, Edge } from '@refinery/schema'

// Generate a 71-node graph with realistic mindmap structure
function generate71NodeGraph(): Graph {
  const nodes: IdeaNode[] = []
  const edges: Edge[] = []
  const now = new Date().toISOString()

  // Create central node
  nodes.push({
    id: 'central',
    label: 'Knowledge Base',
    content: 'Central hub for all knowledge domains',
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    color: '#f97316',
    size: 2,
    metadata: { level: 0, domain: 'root' },
    selected: false,
    hovered: false,
    fixed: true,
    createdAt: now,
    updatedAt: now,
  })

  // Main categories (6 nodes)
  const categories = [
    { id: 'tech', label: 'Technology', color: '#3b82f6' },
    { id: 'science', label: 'Science', color: '#10b981' },
    { id: 'business', label: 'Business', color: '#8b5cf6' },
    { id: 'design', label: 'Design', color: '#ec4899' },
    { id: 'philosophy', label: 'Philosophy', color: '#6366f1' },
    { id: 'arts', label: 'Arts', color: '#f59e0b' },
  ]

  // Add category nodes (level 1)
  categories.forEach((cat, i) => {
    const angle = (i / categories.length) * Math.PI * 2
    const radius = 250
    
    nodes.push({
      id: cat.id,
      label: cat.label,
      content: `${cat.label} domain knowledge`,
      position: {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: 0,
      },
      velocity: { x: 0, y: 0, z: 0 },
      color: cat.color,
      size: 1.5,
      metadata: { level: 1, domain: cat.id },
      selected: false,
      hovered: false,
      fixed: false,
      createdAt: now,
      updatedAt: now,
    })

    edges.push({
      id: `edge-central-${cat.id}`,
      source: 'central',
      target: cat.id,
      type: 'contains',
      label: '',
      strength: 1,
      directed: true,
      metadata: {},
      color: '#94a3b8',
      width: 2,
      style: 'solid',
      visible: true,
      createdAt: now,
      updatedAt: now,
    })
  })

  // Add subcategories and topics (64 more nodes to reach 71)
  let nodeCount = 7 // Already have 7 nodes
  
  categories.forEach((cat, catIndex) => {
    const subcategoryCount = catIndex < 4 ? 4 : 3 // First 4 categories get 4 subcategories, last 2 get 3
    const catAngle = (catIndex / categories.length) * Math.PI * 2
    const catRadius = 250

    for (let subIndex = 0; subIndex < subcategoryCount && nodeCount < 71; subIndex++) {
      const subId = `${cat.id}-sub-${subIndex}`
      const subAngle = catAngle + (subIndex - subcategoryCount / 2) * 0.3
      const subRadius = catRadius + 150
      
      // Subcategory node
      nodes.push({
        id: subId,
        label: `${cat.label} Topic ${subIndex + 1}`,
        content: `Detailed knowledge about ${cat.label} topic ${subIndex + 1}`,
        position: {
          x: Math.cos(subAngle) * subRadius,
          y: Math.sin(subAngle) * subRadius,
          z: Math.random() * 50 - 25,
        },
        velocity: { x: 0, y: 0, z: 0 },
        color: cat.color,
        size: 1.2,
        metadata: { level: 2, domain: cat.id },
        selected: false,
        hovered: false,
        fixed: false,
        createdAt: now,
        updatedAt: now,
      })

      edges.push({
        id: `edge-${cat.id}-${subId}`,
        source: cat.id,
        target: subId,
        type: 'contains',
        label: '',
        strength: 0.8,
        directed: true,
        metadata: {},
        color: '#94a3b8',
        width: 1.5,
        style: 'solid',
        visible: true,
        createdAt: now,
        updatedAt: now,
      })

      nodeCount++

      // Add child nodes for each subcategory
      const childCount = Math.min(3, 71 - nodeCount) // Up to 3 children per subcategory
      for (let childIndex = 0; childIndex < childCount && nodeCount < 71; childIndex++) {
        const childId = `${subId}-child-${childIndex}`
        const childAngle = subAngle + (childIndex - 1) * 0.2
        const childRadius = subRadius + 100

        nodes.push({
          id: childId,
          label: `Concept ${nodeCount}`,
          content: `Specific concept related to ${cat.label}`,
          position: {
            x: Math.cos(childAngle) * childRadius,
            y: Math.sin(childAngle) * childRadius,
            z: Math.random() * 100 - 50,
          },
          velocity: { x: 0, y: 0, z: 0 },
          color: cat.color,
          size: 1,
          metadata: { level: 3, domain: cat.id },
          selected: false,
          hovered: false,
          fixed: false,
          createdAt: now,
          updatedAt: now,
        })

        edges.push({
          id: `edge-${subId}-${childId}`,
          source: subId,
          target: childId,
          type: 'relates-to',
          label: '',
          strength: 0.6,
          directed: false,
          metadata: {},
          color: '#cbd5e1',
          width: 1,
          style: 'solid',
          visible: true,
          createdAt: now,
          updatedAt: now,
        })

        nodeCount++
      }
    }
  })

  // Add some cross-connections between related domains
  const connections = [
    { source: 'tech-sub-0', target: 'science-sub-0' },
    { source: 'design-sub-0', target: 'arts-sub-0' },
    { source: 'business-sub-0', target: 'tech-sub-1' },
    { source: 'philosophy-sub-0', target: 'science-sub-1' },
  ]

  connections.forEach((conn, i) => {
    if (nodes.some(n => n.id === conn.source) && nodes.some(n => n.id === conn.target)) {
      edges.push({
        id: `cross-edge-${i}`,
        source: conn.source,
        target: conn.target,
        type: 'relates-to',
        label: '',
        strength: 0.4,
        directed: false,
        metadata: { crossDomain: true },
        color: '#e2e8f0',
        width: 1,
        style: 'dashed',
        visible: true,
        createdAt: now,
        updatedAt: now,
      })
    }
  })

  return {
    id: 'mindmap-71',
    name: '71-Node Knowledge Graph',
    description: 'A comprehensive knowledge graph with 71 interconnected nodes',
    nodes,
    edges,
    metadata: {
      generatedAt: now,
      nodeCount: nodes.length,
      edgeCount: edges.length,
      levels: 4,
    },
    createdAt: now,
    updatedAt: now,
  }
}

export async function GET() {
  const graph = generate71NodeGraph()
  return NextResponse.json(graph)
}