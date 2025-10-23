'use client'

import type { Draw3DResult } from '../draw3d/modules/types'

type MindmapNode = {
  id: string
  label: string
  hits: number
  lastConfidence: number
  lastUpdatedAt: number
  formationSize: number
}

const nodesByLabel = new Map<string, MindmapNode>()
const promptQueue: string[] = []
let nextNodeIndex = 1

const now = () =>
  typeof performance !== 'undefined' && typeof performance.now === 'function'
    ? performance.now()
    : Date.now()

const sanitizeLabel = (label: string) => {
  const trimmed = label.trim()
  return trimmed.length > 0 ? trimmed : 'unknown'
}

const titleCase = (value: string) =>
  value
    .split(/\s+/)
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(' ')
    .trim()

const toPercent = (confidence: number) =>
  Math.round(Math.max(0, Math.min(1, confidence)) * 100)

export function applyResult(result: Draw3DResult): { nodeId: string; commentary: string } {
  const label = sanitizeLabel(result.label || 'unknown')
  const key = label.toLowerCase()
  const timestamp = now()
  const formationSize = Math.floor(result.formation.length / 3)
  const previous = nodesByLabel.get(key)
  const node: MindmapNode = previous
    ? {
        ...previous,
        hits: previous.hits + 1,
        lastConfidence: result.confidence,
        lastUpdatedAt: timestamp,
        formationSize,
      }
    : {
        id: `node-${nextNodeIndex++}`,
        label,
        hits: 1,
        lastConfidence: result.confidence,
        lastUpdatedAt: timestamp,
        formationSize,
      }

  nodesByLabel.set(key, node)

  const displayLabel = titleCase(label)
  const confidencePct = toPercent(result.confidence)
  const change = previous ? 'updated' : 'added'
  const commentary = `${displayLabel} ${change} · ${confidencePct}% confidence`

  const nextCandidate = result.topK.find(
    (candidate) => candidate.label.toLowerCase() !== key
  )
  const prompt = nextCandidate
    ? `Sketch how ${displayLabel} relates to ${titleCase(nextCandidate.label)}.`
    : `Sketch something connected to ${displayLabel}.`

  promptQueue.push(prompt)

  console.log('[mindmap] commentary', commentary)
  console.log('[mindmap] node', {
    id: node.id,
    label: node.label,
    hits: node.hits,
    confidence: confidencePct,
    formationSize,
  })
  console.log('[mindmap] queued prompt', { prompt, queueLength: promptQueue.length })

  return { nodeId: node.id, commentary }
}
