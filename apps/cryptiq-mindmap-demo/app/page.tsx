'use client'

import { useState, useEffect, useReducer } from 'react'
import { IdeaCanvas, processCanvasCommand, createInitialCanvasState } from '@refinery/sdk-core'
import type { Graph } from '@refinery/schema'
import type { RendererCommand } from '@refinery/store'

// Canvas state reducer
function canvasReducer(state: any, command: RendererCommand) {
  return processCanvasCommand(state, command)
}

export default function Home() {
  const [graph, setGraph] = useState<Graph | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Initialize canvas state
  const [canvasState, dispatch] = useReducer(canvasReducer, null, () => createInitialCanvasState())

  // Fetch graph data from API
  useEffect(() => {
    async function fetchGraph() {
      try {
        const response = await fetch('/api/mindmap')
        if (!response.ok) {
          throw new Error(`Failed to fetch graph: ${response.statusText}`)
        }
        const data = await response.json()
        setGraph(data)
        
        // Initialize canvas state with loaded graph data
        if (data.nodes && data.edges) {
          dispatch({ type: 'BATCH_ADD_NODES', payload: { nodes: data.nodes } })
          dispatch({ type: 'BATCH_ADD_EDGES', payload: { edges: data.edges } })
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load graph')
      } finally {
        setLoading(false)
      }
    }

    fetchGraph()
  }, [])

  if (loading) {
    return (
      <main className="w-screen h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">Loading 71-node graph...</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="w-screen h-screen flex items-center justify-center bg-gray-900">
        <div className="text-red-500 text-xl">Error: {error}</div>
      </main>
    )
  }

  if (!graph) {
    return (
      <main className="w-screen h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">No graph data available</div>
      </main>
    )
  }

  return (
    <main className="w-screen h-screen">
      <IdeaCanvas
        nodes={graph.nodes}
        edges={graph.edges}
        selectedNodeIds={canvasState.selectedNodeIds}
        selectedEdgeIds={canvasState.selectedEdgeIds}
        hoveredNodeId={canvasState.hoveredNodeId}
        hoveredEdgeId={canvasState.hoveredEdgeId}
        camera={canvasState.camera}
        zoom={canvasState.zoom}
        theme={canvasState.theme}
        highlightedNodes={canvasState.highlightedNodes}
        highlightedEdges={canvasState.highlightedEdges}
        onCommand={dispatch}
        showStats={true}
      />
    </main>
  )
}
