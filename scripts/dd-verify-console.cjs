#!/usr/bin/env node
const { spawn, execSync } = require('child_process')
const http = require('http')
const fs = require('fs')
const path = require('path')
const { chromium } = require('playwright')

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
const route =
  process.env.DD_ROUTE ||
  'http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&forceVisible=1&ddDebug=1'

const consoleDir = path.join(rootDir, contextRel, 'console', commit, branch, runId)
const assetsDir = path.join(rootDir, contextRel, 'assets', commit, branch, runId)
fs.mkdirSync(consoleDir, { recursive: true })
fs.mkdirSync(assetsDir, { recursive: true })

const manualPath = path.join(consoleDir, 'console-manual.txt')
const pageJsonPath = path.join(consoleDir, 'page-console.json')
const mountErrorPath = path.join(consoleDir, 'mount-error.txt')
const domSnapshotPath = path.join(consoleDir, 'page-dom.html')
const grepPath = path.join(consoleDir, 'grep-summary.txt')
const verifyPath = path.join(consoleDir, 'console-verify.json')
const prePath = path.join(assetsDir, 'pre.png')
const postPath = path.join(assetsDir, 'post.png')

const captureMs = Number(process.env.DD_CAPTURE_MS || 60000)
const readyTimeoutMs = Number(process.env.DD_READY_TIMEOUT_MS || 60000)
const shutdownTimeoutMs = Number(process.env.DD_SHUTDOWN_TIMEOUT_MS || 5000)

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function waitForExit(child, timeoutMs) {
  if (!child || typeof child.once !== 'function') return Promise.resolve(true)
  if (child.exitCode !== null || child.signalCode !== null) return Promise.resolve(true)
  return new Promise((resolve) => {
    const onExit = () => {
      if (timer) clearTimeout(timer)
      resolve(true)
    }
    child.once('exit', onExit)
    const timer = setTimeout(() => {
      child.removeListener('exit', onExit)
      resolve(false)
    }, timeoutMs)
    if (typeof timer.unref === 'function') {
      timer.unref()
    }
  })
}

async function stopProcess(child, timeoutMs) {
  if (!child || typeof child.kill !== 'function') return
  if (child.exitCode !== null || child.signalCode !== null) return
  try {
    child.kill('SIGINT')
  } catch {
    return
  }
  const exited = await waitForExit(child, timeoutMs)
  if (!exited) {
    try {
      child.kill('SIGKILL')
    } catch {
      /* noop */
    }
    await waitForExit(child, timeoutMs)
  }
}

async function waitForReady(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs
  return new Promise((resolve) => {
    function attempt() {
      const req = http.get(url, (res) => {
        res.resume()
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

function serializeForManual(prefix, message) {
  return `${new Date().toISOString()} ${prefix} ${message}`.trim()
}

async function serializeConsoleArgs(message) {
  const args = message.args()
  if (args.length === 0) {
    return { args: [], text: message.text() }
  }
  const values = []
  for (const handle of args) {
    try {
      const value = await handle.jsonValue()
      values.push(value)
    } catch {
      values.push({ __value: String(handle) })
    }
  }
  let text
  try {
    text = values
      .map((value) => {
        if (typeof value === 'string') return value
        return JSON.stringify(value)
      })
      .join(' ')
  } catch {
    text = message.text()
  }
  return { args: values, text }
}

async function run() {
  const devLogs = []
  const childEnv = {
    ...process.env,
    PORT: process.env.PORT || '3000',
    NEXT_PUBLIC_DREAMDUST_DEBUG: '1',
  }
  const dev = spawn('node', [path.join(__dirname, 'with-node20.cjs'), 'next', 'dev', '--turbopack'], {
    cwd: rootDir,
    env: childEnv,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  dev.stdout.on('data', (chunk) => {
    const text = chunk.toString()
    devLogs.push(serializeForManual('[dev:stdout]', text.trimEnd()))
  })
  dev.stderr.on('data', (chunk) => {
    const text = chunk.toString()
    devLogs.push(serializeForManual('[dev:stderr]', text.trimEnd()))
  })

  let ready = false
  let browser = null
  let page = null
  const pageLogs = []
  const pageErrors = []
  const pageManualLines = []
  const metaManualLines = []
  const captureStartTs = Date.now()
  let tapResult = null

  try {
    ready = await waitForReady('http://127.0.0.1:3000', readyTimeoutMs)
    metaManualLines.push(
      serializeForManual('[meta]', `ready=${ready} (timeout=${readyTimeoutMs}ms)`),
    )
    if (!ready) {
      throw new Error('Dev server failed to report ready within timeout')
    }

    browser = await chromium.launch({ headless: process.env.HEADLESS !== 'false' })
    page = await browser.newPage()
    await page.setViewportSize({ width: 1280, height: 720 })

    page.on('console', async (message) => {
      const { args, text } = await serializeConsoleArgs(message)
      const entry = {
        timestamp: new Date().toISOString(),
        type: message.type(),
        text,
        args,
        location: message.location(),
      }
      pageLogs.push(entry)
      pageManualLines.push(
        serializeForManual(`[page:${entry.type}]`, `${entry.text}`),
      )
    })
    page.on('pageerror', (error) => {
      const entry = {
        timestamp: new Date().toISOString(),
        type: 'pageerror',
        message: error?.message ?? String(error),
        stack: typeof error?.stack === 'string' ? error.stack : null,
      }
      pageErrors.push(entry)
      pageManualLines.push(
        serializeForManual('[page:error]', entry.message),
      )
    })

    await page.goto(route, { waitUntil: 'networkidle' })
    await page.waitForTimeout(2000)
    const { hasCanvas, bodyHtml } = await page.evaluate(() => {
      const canvasPresent = !!document.querySelector('canvas')
      return {
        hasCanvas: canvasPresent,
        bodyHtml: document.body?.innerHTML ?? '',
      }
    })
    metaManualLines.push(
      serializeForManual('[meta]', `hasCanvas=${hasCanvas}`),
    )
    try {
      fs.writeFileSync(domSnapshotPath, `<!-- hasCanvas: ${hasCanvas} -->\n${bodyHtml}`)
    } catch (error) {
      metaManualLines.push(
        serializeForManual('[meta]', `dom snapshot write failed: ${error instanceof Error ? error.message : String(error)}`),
      )
    }
    await page.screenshot({ path: prePath, fullPage: true })
    metaManualLines.push(
      serializeForManual('[meta]', `captured pre screenshot at ${prePath}`),
    )

    tapResult = await page.evaluate(() => {
      const canvas = document.querySelector('canvas')
      if (!canvas) {
        return { success: false, reason: 'canvas not found' }
      }
      const rect = canvas.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      return { success: true, x, y }
    })

    if (tapResult?.success) {
      await page.mouse.click(tapResult.x, tapResult.y, { delay: 15 })
      metaManualLines.push(
        serializeForManual('[meta]', `tap dispatched at (${tapResult.x.toFixed(1)}, ${tapResult.y.toFixed(1)})`),
      )
    } else {
      metaManualLines.push(
        serializeForManual('[meta]', `tap failed: ${tapResult?.reason ?? 'unknown reason'}`),
      )
    }

    await page.waitForTimeout(4000)
    await page.screenshot({ path: postPath, fullPage: true })
    metaManualLines.push(
      serializeForManual('[meta]', `captured post screenshot at ${postPath}`),
    )

    const elapsed = Date.now() - captureStartTs
    const remaining = Math.max(0, captureMs - elapsed)
    if (remaining > 0) {
      await sleep(remaining)
    }
  } finally {
    if (page) {
      page.removeAllListeners()
    }
    if (browser) {
      await browser.close().catch(() => {})
    }
    await stopProcess(dev, shutdownTimeoutMs)
  }

  const manualSections = [
    '# Meta',
    ...metaManualLines,
    '',
    '# Page Console',
    ...pageManualLines,
    '',
    '# Dev Server',
    ...devLogs,
  ]
  fs.writeFileSync(manualPath, manualSections.join('\n') + '\n')
  fs.writeFileSync(pageJsonPath, JSON.stringify(pageLogs, null, 2))
  if (pageErrors.length > 0) {
    const lines = pageErrors.flatMap((entry) => {
      const payload = [
        `[${entry.timestamp}] ${entry.message}`,
        entry.stack ? entry.stack : null,
      ].filter(Boolean)
      return payload.concat('')
    })
    fs.writeFileSync(mountErrorPath, lines.join('\n'))
  } else {
    fs.writeFileSync(mountErrorPath, 'No page errors captured\n')
  }

  const tagSummary = analyseLogs(pageLogs)
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
    route,
    ready,
    tags: tagSummary,
    tap: tapResult,
  }
  fs.writeFileSync(verifyPath, JSON.stringify(verification, null, 2))
  if (!verification.ok) {
    process.exitCode = 1
  }
}

function analyseLogs(pageLogs) {
  const hasLabel = (label) =>
    pageLogs.some((entry) =>
      typeof entry.args?.[0] === 'string'
        ? entry.args[0].includes(label)
        : entry.text.includes(label),
    )
  const renderInfoEntries = pageLogs.filter((entry) => {
    const first = entry.args?.[0]
    if (typeof first === 'string' && first.includes('[PC] render-info')) {
      return true
    }
    return entry.text.includes('[PC] render-info')
  })

  let calls = 0
  let points = 0
  if (renderInfoEntries.length > 0) {
    const last = renderInfoEntries[renderInfoEntries.length - 1]
    const payload =
      last.args?.find((arg, index) => index > 0 && arg && typeof arg === 'object') ?? null
    if (payload && typeof payload === 'object') {
      if (typeof payload.calls === 'number') calls = payload.calls
      if (typeof payload.points === 'number') points = payload.points
    } else {
      const matchCalls = last.text.match(/calls[^0-9-]*(-?\d+)/)
      const matchPoints = last.text.match(/points[^0-9-]*(-?\d+)/)
      if (matchCalls) calls = Number(matchCalls[1])
      if (matchPoints) points = Number(matchPoints[1])
    }
  }

  return {
    ddDebug: hasLabel('[PC] ddDebug'),
    sentinel: hasLabel('[PC] sentinel-points'),
    renderList: hasLabel('[PC] render-list'),
    pointsBefore: hasLabel('[PC] points-before-render'),
    pointsAfter: hasLabel('[PC] points-after-render'),
    renderPassBegin: hasLabel('[PC] render-pass begin'),
    renderPassEnd: hasLabel('[PC] render-pass end'),
    renderInfo: { calls, points },
  }
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  const failure = {
    ok: false,
    error: message,
    route,
  }
  fs.writeFileSync(verifyPath, JSON.stringify(failure, null, 2))
  process.exitCode = 1
})
