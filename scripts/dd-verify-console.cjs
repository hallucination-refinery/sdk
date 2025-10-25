#!/usr/bin/env node
const { spawn, execSync } = require('child_process')
const http = require('http')
const fs = require('fs')
const path = require('path')

const rootDir = path.resolve(__dirname, '..')
const contextRel = path.join(
  'docs',
  'initiatives',
  'cryptiq-mindmap-mvp',
  'dreamdust-ink-mask-docs',
  'context-pack-2025-10-10',
  'cursor-ooda-ink-prototype',
)

function git(cmd) {
  return execSync(cmd, { cwd: rootDir }).toString().trim()
}

const commit = process.env.COMMIT_SHORT || git('git rev-parse --short HEAD')
const branch = process.env.BRANCH_NAME || git('git rev-parse --abbrev-ref HEAD')
const runId =
  process.env.RUN_ID || new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 15)

const consoleDir = path.join(rootDir, contextRel, 'console', commit, branch, runId)
const assetsDir = path.join(rootDir, contextRel, 'assets', commit, branch, runId)
fs.mkdirSync(consoleDir, { recursive: true })
fs.mkdirSync(assetsDir, { recursive: true })

const logPath = path.join(consoleDir, 'console-manual.txt')
const grepPath = path.join(consoleDir, 'grep-summary.txt')
const verifyPath = path.join(consoleDir, 'console-verify.json')

const dev = spawn('node', [path.join(__dirname, 'with-node20.cjs'), 'next', 'dev', '--turbopack'], {
  cwd: rootDir,
  env: { ...process.env, NEXT_PUBLIC_DREAMDUST_DEBUG: '1' },
  stdio: ['ignore', 'pipe', 'pipe'],
})

const logStream = fs.createWriteStream(logPath)
dev.stdout.on('data', (chunk) => logStream.write(chunk))
dev.stderr.on('data', (chunk) => logStream.write(chunk))

async function waitForReady(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs
  return new Promise((resolve) => {
    function attempt() {
      const req = http.get(url, (res) => {
        res.destroy()
        if (res.statusCode && res.statusCode < 500) {
          resolve(true)
        } else if (Date.now() > deadline) {
          resolve(false)
        } else {
          setTimeout(attempt, 1000)
        }
      })
      req.on('error', () => {
        if (Date.now() > deadline) {
          resolve(false)
        } else {
          setTimeout(attempt, 1000)
        }
      })
    }
    attempt()
  })
}

(async () => {
  const ready = await waitForReady('http://127.0.0.1:3000', 60000)
  const captureMs = Number(process.env.DD_CAPTURE_MS || 60000)
  await new Promise((resolve) => setTimeout(resolve, captureMs))

  try {
    dev.kill('SIGINT')
    setTimeout(() => {
      if (!dev.killed) {
        dev.kill('SIGKILL')
      }
    }, 2500)
  } catch (error) {
    process.stderr.write(`[dd-verify] kill error: ${error.message}\n`)
  }

  await new Promise((resolve) => dev.on('exit', resolve))
  logStream.end()

  const logText = fs.readFileSync(logPath, 'utf8')
  const has = (regex) => regex.test(logText)
  const extractCount = (label) => {
    const match = logText.match(new RegExp(`\\[PC\\] render-info[^\\n]*${label}:\\s*(\\d+)`))
    return match ? Number(match[1]) : 0
  }

  const tagSummary = {
    ddDebug: has(/\[PC\] ddDebug/),
    sentinel: has(/\[PC\] sentinel-points/),
    renderList: has(/\[PC\] render-list (snapshot|empty)/),
    pointsBefore: has(/\[PC\] points-before-render/),
    pointsAfter: has(/\[PC\] points-after-render/),
    renderPassBegin: has(/\[PC\] render-pass begin/),
    renderPassEnd: has(/\[PC\] render-pass end/),
    renderInfo: {
      calls: extractCount('calls'),
      points: extractCount('points'),
    },
  }

  const grepLines = [
    `ddDebug: ${tagSummary.ddDebug ? 'yes' : 'no'}`,
    `sentinel: ${tagSummary.sentinel ? 'yes' : 'no'}`,
    `renderList: ${tagSummary.renderList ? 'yes' : 'no'}`,
    `points-before-render: ${tagSummary.pointsBefore ? 'yes' : 'no'}`,
    `points-after-render: ${tagSummary.pointsAfter ? 'yes' : 'no'}`,
    `render-pass begin: ${tagSummary.renderPassBegin ? 'yes' : 'no'}`,
    `render-pass end: ${tagSummary.renderPassEnd ? 'yes' : 'no'}`,
    `render-info: calls=${tagSummary.renderInfo.calls} points=${tagSummary.renderInfo.points}`,
  ]
  fs.writeFileSync(grepPath, grepLines.join('\n'))

  const verification = {
    ok:
      tagSummary.renderPassBegin &&
      tagSummary.renderPassEnd &&
      tagSummary.pointsBefore &&
      tagSummary.renderInfo.calls >= 1,
    nodeVersion: process.version,
    route: 'http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&forceVisible=1&ddDebug=1',
    ready,
    tags: tagSummary,
  }

  fs.writeFileSync(verifyPath, JSON.stringify(verification, null, 2))
  process.exit(verification.ok ? 0 : 1)
})()
