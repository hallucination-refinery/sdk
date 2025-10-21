#!/usr/bin/env node
/**
 * Documentation Updater for Ink Smoke Tests
 * Updates markdown documentation with smoke test results
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '..')

const DOCS_BASE =
  'docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15'
const EVIDENCE_DOC = '10-latest-smoke-evidence.md'
const WORKING_DOC = '06-working-document.md'

/**
 * Get git metadata
 */
function getGitMetadata() {
  try {
    const commit = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()
    const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim()
    return { commit, branch }
  } catch {
    return { commit: 'unknown', branch: 'unknown' }
  }
}

/**
 * Format timestamp for documentation
 */
function formatTimestamp(date = new Date()) {
  return date.toISOString()
}

/**
 * Format console logs for markdown
 */
function formatConsoleLogs(parsed) {
  const sections = []

  if (parsed.renderInfo) {
    sections.push(
      `- \`[PC] render-info ${JSON.stringify(parsed.renderInfo)}\``,
    )
  }

  if (parsed.pointsMesh) {
    sections.push(
      `- \`[PC] points-mesh ${JSON.stringify(parsed.pointsMesh)}\``,
    )
  }

  if (parsed.pointsAfterRender) {
    sections.push(
      `- \`[PC] points-after-render ${JSON.stringify(parsed.pointsAfterRender)}\``,
    )
  } else {
    sections.push(`- **❌ \`[PC] points-after-render\` — MISSING**`)
  }

  if (parsed.sceneTraversal) {
    sections.push(
      `- \`[PC] scene-traversal ${JSON.stringify(parsed.sceneTraversal)}\``,
    )
  }

  if (parsed.renderList) {
    sections.push(
      `- \`[PC] render-list ${JSON.stringify(parsed.renderList)}\``,
    )
  }

  if (parsed.rendererRenderCall) {
    sections.push(
      `- \`[PC] renderer-render-call ${JSON.stringify(parsed.rendererRenderCall)}\``,
    )
  }

  return sections.join('\n')
}

/**
 * Update evidence document (10-latest-smoke-evidence.md)
 */
async function updateEvidenceDoc(result, artifactPaths, git) {
  const docPath = path.join(REPO_ROOT, DOCS_BASE, EVIDENCE_DOC)

  const timestamp = formatTimestamp()
  const runId = path.basename(artifactPaths.console).replace('console-chromium-', '').replace('.json', '')

  // Build new content
  const newContent = `---
title: Latest Smoke Evidence – Prod URL (scene-03 forceVisible bypass)
date: ${timestamp}
tags: [evidence, smoke, prod, forceVisible, diagnostic, render-info, points-mesh, scene-traversal, render-list, renderer-render-call]
commit: ${git.commit}
branch: ${git.branch}
url: http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&forceVisible=1
---

Summary: Claude Code automated smoke test run on commit \`${git.commit}\` revealed **${result.analysis.verdict}** — ${result.analysis.reason}

Key console lines:
${formatConsoleLogs(result.parsed)}

Screenshots:
${artifactPaths.screenshots.map((p) => `- \`${p}\``).join('\n')}

Console logs:
- \`${artifactPaths.console}\`

Test result:
- \`BASE_URL=http://127.0.0.1:3000\`
- \`SMOKE_ROUTE=/quiz/archetype-v1?pc=scene-03&forceVisible=1\`
- \`tests/ink.smoke.spec.ts\` → ${result.analysis.verdict === 'PASS' ? 'PASSED' : 'FAILED'}

Decision: **${result.analysis.verdict}** (${result.analysis.category || 'general'}) — ${result.analysis.reason}

${result.analysis.details ? `Details:
\`\`\`json
${JSON.stringify(result.analysis.details, null, 2)}
\`\`\`
` : ''}
**Next action**: ${getNextAction(result.analysis)}
`

  await fs.writeFile(docPath, newContent, 'utf8')
  return docPath
}

/**
 * Get next action based on analysis
 */
function getNextAction(analysis) {
  if (analysis.verdict === 'PASS') {
    return 'Continue monitoring. All checks passing.'
  }

  if (analysis.category === 'wrong-scene') {
    return `Investigate R3F's scene management:
1. Check if R3F uses \`useThree().scene\` and verify it returns the correct scene
2. Verify Points mesh is added to the same scene object that R3F passes to renderer.render()
3. Add logging to capture both scene UUIDs and compare`
  }

  if (analysis.category === 'lists-empty') {
    return `Debug camera frustum/layers/visibility culling:
1. Verify camera frustum includes Points mesh bounds
2. Check camera layers match Points mesh layers
3. Confirm Points visibility flags are correct`
  }

  if (analysis.category === 'render-not-called') {
    return `Investigate R3F integration:
1. Check if R3F is properly initialized
2. Verify frameloop is running
3. Confirm R3F Canvas is mounted and active`
  }

  return 'Review diagnostic output and determine root cause'
}

/**
 * Update working document (06-working-document.md)
 */
async function updateWorkingDoc(result, git) {
  const docPath = path.join(REPO_ROOT, DOCS_BASE, WORKING_DOC)

  // Read existing doc
  let existingContent = ''
  try {
    existingContent = await fs.readFile(docPath, 'utf8')
  } catch {
    // File doesn't exist or can't be read
  }

  // Update frontmatter
  let newContent = existingContent.replace(
    /^title:.*$/m,
    `title: Working Plan — Ink Prototype (Current Iteration)`,
  )
  newContent = newContent.replace(/^date:.*$/m, `date: ${formatTimestamp()}`)
  newContent = newContent.replace(/^commit:.*$/m, `commit: ${git.commit}`)
  newContent = newContent.replace(/^branch:.*$/m, `branch: ${git.branch}`)

  // Update Section A (Where we are)
  const sectionAUpdate = `**A) Where we are**
- Latest smoke test on commit \`${git.commit}\` (${formatTimestamp()}) — **${result.analysis.verdict}**
- ${result.analysis.reason}
- Acceptance gate status: ${result.analysis.verdict} (${result.analysis.category || 'general'})
${result.analysis.details ? `- Key findings: ${JSON.stringify(result.analysis.details, null, 2).split('\n').map(l => `  ${l}`).join('\n')}` : ''}`

  newContent = newContent.replace(
    /\*\*A\) Where we are\*\*[\s\S]*?(?=\*\*B\))/,
    sectionAUpdate + '\n\n',
  )

  // Update Section E (Single change to run next)
  const sectionEUpdate = `**E) Single change to run next**
- ${getNextAction(result.analysis)}`

  newContent = newContent.replace(
    /\*\*E\) Single change to run next\*\*[\s\S]*?(?=\*\*F\))/,
    sectionEUpdate + '\n\n',
  )

  await fs.writeFile(docPath, newContent, 'utf8')
  return docPath
}

/**
 * Find artifact paths
 */
async function findArtifactPaths(runId) {
  const git = getGitMetadata()
  const baseDir = path.join(
    REPO_ROOT,
    'docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype',
  )

  // Try to find artifacts in the structured directory
  const assetsDir = path.join(baseDir, 'assets', git.commit, git.branch, runId)
  const consoleDir = path.join(baseDir, 'console', git.commit, git.branch, runId)

  const screenshots = []
  const consolePath = path.join(
    REPO_ROOT,
    '.clmem/artifacts/ink-console',
    `console-chromium-${runId}.json`,
  )

  // Try to find screenshots
  try {
    const inkDir = path.join(REPO_ROOT, '.clmem/artifacts/ink')
    const files = await fs.readdir(inkDir)
    const screenshotFiles = files.filter(
      (f) => f.includes(runId) && (f.endsWith('-pre.png') || f.endsWith('-post.png')),
    )
    screenshots.push(...screenshotFiles.map((f) => path.join('.clmem/artifacts/ink', f)))
  } catch {
    // No screenshots found
  }

  return {
    screenshots,
    console: consolePath,
  }
}

/**
 * CLI entry point
 */
async function main() {
  const args = process.argv.slice(2)
  const pwAnalysisFile = args[0]
  const mcpAnalysisFile = args[1] // Optional MCP analysis

  if (!pwAnalysisFile) {
    console.error('Usage: update-smoke-docs.mjs <playwright-analysis.json> [mcp-analysis.json]')
    console.error('Example: update-smoke-docs.mjs .clmem/artifacts/ink-console/console-chromium-*-analysis.json')
    process.exit(1)
  }

  // Read Playwright analysis results
  const pwResult = JSON.parse(await fs.readFile(pwAnalysisFile, 'utf8'))

  // Read MCP analysis results if provided
  let mcpResult = null
  if (mcpAnalysisFile && (await fs.access(mcpAnalysisFile).then(() => true).catch(() => false))) {
    mcpResult = JSON.parse(await fs.readFile(mcpAnalysisFile, 'utf8'))
  }

  // Get git metadata
  const git = getGitMetadata()

  // Extract runId from Playwright analysis file
  const runId = path
    .basename(pwAnalysisFile)
    .replace('console-chromium-', '')
    .replace('-analysis.json', '')

  // Find artifact paths
  const artifactPaths = await findArtifactPaths(runId)

  console.log('Updating documentation...')
  console.log(`Commit: ${git.commit}`)
  console.log(`Branch: ${git.branch}`)
  console.log(`Run ID: ${runId}`)
  console.log(`Playwright Verdict: ${pwResult.analysis.verdict}`)
  if (mcpResult) {
    console.log(`MCP Verdict: ${mcpResult.analysis.verdict}`)
  }
  console.log()

  // Update documents (primary result is Playwright for now)
  // TODO: Merge MCP and Playwright results in evidence doc
  const evidencePath = await updateEvidenceDoc(pwResult, artifactPaths, git)
  console.log(`✓ Updated: ${path.relative(REPO_ROOT, evidencePath)}`)

  const workingPath = await updateWorkingDoc(pwResult, git)
  console.log(`✓ Updated: ${path.relative(REPO_ROOT, workingPath)}`)

  if (mcpResult) {
    console.log('\n✓ MCP analysis included (dual-pass mode)')
  }

  console.log('\nDocumentation update complete!')
}

main().catch((err) => {
  console.error('Documentation update failed:', err)
  process.exit(1)
})
