#!/usr/bin/env node
/**
 * Console Analyzer for Ink Smoke Tests
 * Applies diagnostic rubric to console JSON artifacts
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '..')

// Required console log markers
const REQUIRED_LOGS = [
  '[PC] render-info',
  '[PC] points-mesh',
  '[PC] points-after-render',
  '[PC] scene-traversal',
  '[PC] render-list',
  '[PC] renderer-render-call',
]

/**
 * Parse console entries to extract structured data
 */
function parseConsoleEntries(entries) {
  const parsed = {
    renderInfo: null,
    pointsMesh: null,
    pointsAfterRender: null,
    sceneTraversal: null,
    renderList: null,
    rendererRenderCall: null,
  }

  for (const entry of entries) {
    const text = entry.text || ''

    // Try to extract JSON from log entries (only if not already found to avoid overwriting with failed parses)
    if (!parsed.renderInfo && text.includes('[PC] render-info')) {
      parsed.renderInfo = extractJson(text, '[PC] render-info')
    }
    if (!parsed.pointsMesh && text.includes('[PC] points-mesh')) {
      parsed.pointsMesh = extractJson(text, '[PC] points-mesh')
    }
    if (!parsed.pointsAfterRender && text.includes('[PC] points-after-render')) {
      parsed.pointsAfterRender = extractJson(text, '[PC] points-after-render')
    }
    if (!parsed.sceneTraversal && text.includes('[PC] scene-traversal')) {
      parsed.sceneTraversal = extractJson(text, '[PC] scene-traversal')
    }
    if (!parsed.renderList && text.includes('[PC] render-list')) {
      parsed.renderList = extractJson(text, '[PC] render-list')
    }
    if (!parsed.rendererRenderCall && text.includes('[PC] renderer-render-call')) {
      parsed.rendererRenderCall = extractJson(text, '[PC] renderer-render-call')
    }
  }

  return parsed
}

/**
 * Extract JSON object from log text
 */
function extractJson(text, marker) {
  try {
    const startIdx = text.indexOf(marker) + marker.length
    let jsonStr = text.slice(startIdx).trim()

    // Find the first '{' and try to parse from there
    const openBrace = jsonStr.indexOf('{')
    if (openBrace === -1) {
      return null
    }

    jsonStr = jsonStr.slice(openBrace)

    // Try to parse the JSON - if it fails, try to find just the balanced braces
    try {
      return JSON.parse(jsonStr)
    } catch {
      // Find balanced braces
      let depth = 0
      let endIdx = 0
      for (let i = 0; i < jsonStr.length; i++) {
        if (jsonStr[i] === '{') depth++
        if (jsonStr[i] === '}') depth--
        if (depth === 0 && i > 0) {
          endIdx = i + 1
          break
        }
      }

      if (endIdx > 0) {
        const balanced = jsonStr.slice(0, endIdx)
        return JSON.parse(balanced)
      }

      return null
    }
  } catch {
    return null
  }
}

/**
 * Apply diagnostic rubric
 */
function applyRubric(parsed) {
  const { renderInfo, pointsMesh, pointsAfterRender, sceneTraversal, renderList, rendererRenderCall } =
    parsed

  // Check for missing required logs
  const missing = []
  if (!renderInfo) missing.push('[PC] render-info')
  if (!pointsMesh) missing.push('[PC] points-mesh')
  if (!sceneTraversal) missing.push('[PC] scene-traversal')
  if (!renderList) missing.push('[PC] render-list')
  if (!rendererRenderCall) missing.push('[PC] renderer-render-call')

  if (missing.length > 0) {
    return {
      verdict: 'FAIL',
      reason: `Missing required logs: ${missing.join(', ')}`,
      confidence: 0.95,
      missing,
    }
  }

  // FAIL: Render not called
  if (!rendererRenderCall) {
    return {
      verdict: 'FAIL',
      reason: 'render not called - R3F not invoking renderer.render() for this scene',
      confidence: 0.98,
      category: 'render-not-called',
    }
  }

  // FAIL: Wrong scene
  const renderedChildCount = rendererRenderCall.sceneChildCount || 0
  const traversedNodeCount = sceneTraversal.nodeCount || 0

  // Check if scene structure matches
  // Traversed scene should have 3 children at root (AmbientLight, DirectionalLight, Group)
  // If rendered scene has different child count, it's the wrong scene
  if (renderedChildCount === 1 && traversedNodeCount > 3) {
    return {
      verdict: 'FAIL',
      reason: `wrong scene - R3F rendering different scene (rendered childCount: ${renderedChildCount}, traversed nodeCount: ${traversedNodeCount})`,
      confidence: 0.98,
      category: 'wrong-scene',
      details: {
        renderedSceneUuid: rendererRenderCall.sceneUuid,
        renderedChildCount,
        traversedNodeCount,
        pointsInTraversedScene: sceneTraversal.pointsFound,
      },
    }
  }

  // FAIL: Render called with empty lists
  const opaqueCount = rendererRenderCall.opaqueCount || 0
  const transparentCount = rendererRenderCall.transparentCount || 0

  if (opaqueCount === 0 && transparentCount === 0) {
    // Check if points mesh exists but isn't in lists
    if (sceneTraversal.pointsFound) {
      return {
        verdict: 'FAIL',
        reason: 'render called but lists empty - Points mesh exists but being culled (camera frustum/layers/visibility)',
        confidence: 0.90,
        category: 'lists-empty',
        details: {
          pointsFound: sceneTraversal.pointsFound,
          opaqueCount,
          transparentCount,
        },
      }
    }
  }

  // PASS conditions
  const hasPoints = (renderInfo?.points || 0) > 0
  const pointsFound = sceneTraversal.pointsFound === true
  const hasNonEmptyLists = opaqueCount > 0 || transparentCount > 0
  const noTimeout = renderInfo?.timeout === false

  if (noTimeout && hasPoints && pointsFound && hasNonEmptyLists) {
    return {
      verdict: 'PASS',
      reason: 'All conditions met: no timeout, points rendered, mesh found in scene, render lists populated',
      confidence: 0.95,
      details: {
        points: renderInfo.points,
        opaqueCount,
        transparentCount,
        pointsFound,
      },
    }
  }

  // Default FAIL if we got here
  return {
    verdict: 'FAIL',
    reason: 'Diagnostic criteria not met',
    confidence: 0.70,
    details: {
      hasPoints,
      pointsFound,
      hasNonEmptyLists,
      noTimeout,
    },
  }
}

/**
 * Find latest console JSON file
 */
async function findLatestConsoleJson(consoleDir) {
  try {
    const files = await fs.readdir(consoleDir)
    const jsonFiles = files.filter((f) => f.startsWith('console-') && f.endsWith('.json'))

    if (jsonFiles.length === 0) {
      return null
    }

    // Sort by filename (which includes timestamp) and get the latest
    jsonFiles.sort()
    return path.join(consoleDir, jsonFiles[jsonFiles.length - 1])
  } catch (err) {
    return null
  }
}

/**
 * Main analyzer
 */
async function analyzeConsole(consoleFilePath) {
  // Read console JSON
  const consoleJson = JSON.parse(await fs.readFile(consoleFilePath, 'utf8'))

  // Parse entries
  const parsed = parseConsoleEntries(consoleJson)

  // Apply rubric
  const analysis = applyRubric(parsed)

  return {
    consoleFile: consoleFilePath,
    timestamp: new Date().toISOString(),
    parsed,
    analysis,
  }
}

/**
 * CLI entry point
 */
async function main() {
  const args = process.argv.slice(2)
  let consoleFile = args[0]

  if (!consoleFile) {
    // Auto-detect latest console file
    const consoleDir = path.join(REPO_ROOT, '.clmem/artifacts/ink-console')
    consoleFile = await findLatestConsoleJson(consoleDir)

    if (!consoleFile) {
      console.error('No console JSON files found in .clmem/artifacts/ink-console/')
      process.exit(1)
    }

    console.log(`Auto-detected latest console file: ${path.basename(consoleFile)}`)
  }

  // Analyze
  const result = await analyzeConsole(consoleFile)

  // Output results
  console.log('\n' + '='.repeat(80))
  console.log('SMOKE TEST CONSOLE ANALYSIS')
  console.log('='.repeat(80))
  console.log(`Verdict: ${result.analysis.verdict}`)
  console.log(`Reason: ${result.analysis.reason}`)
  console.log(`Confidence: ${(result.analysis.confidence * 100).toFixed(0)}%`)

  if (result.analysis.category) {
    console.log(`Category: ${result.analysis.category}`)
  }

  if (result.analysis.missing) {
    console.log(`Missing logs: ${result.analysis.missing.join(', ')}`)
  }

  if (result.analysis.details) {
    console.log('\nDetails:')
    console.log(JSON.stringify(result.analysis.details, null, 2))
  }

  console.log('='.repeat(80))
  console.log()

  // Write analysis to file
  const outputFile = consoleFile.replace('.json', '-analysis.json')
  await fs.writeFile(outputFile, JSON.stringify(result, null, 2), 'utf8')
  console.log(`Analysis saved to: ${outputFile}`)

  // Exit with appropriate code
  process.exit(result.analysis.verdict === 'PASS' ? 0 : 1)
}

main().catch((err) => {
  console.error('Analysis failed:', err)
  process.exit(1)
})
