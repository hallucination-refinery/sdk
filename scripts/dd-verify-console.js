#!/usr/bin/env node
/* eslint-env node */
 
/* global process, console */
// Dev-only helper: start Next.js dev server, capture Dreamdust console tags, exit with summary.
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { setTimeout as delay } from 'node:timers/promises'
import { chromium } from 'playwright'

const REQUIRED_PATTERNS = [
  /\[PC\] render-info/, 
  /\[PC\] render-list (snapshot|empty)/,
  /\[PC\] points-before-render/,
  /\[PC\] points-after-render/,
  /\[PC\] render-pass begin/,
  /\[PC\] render-pass end/,
]

const DEFAULT_URL = 'http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&forceVisible=1&ddDebug=1'
const url = process.env.BASE_URL ?? DEFAULT_URL

const devEnv = {
  ...process.env,
  NEXT_PUBLIC_DREAMDUST_DEBUG: process.env.NEXT_PUBLIC_DREAMDUST_DEBUG ?? '1',
}

const logBuffer = []
const pushLog = (chunk) => {
  const text = chunk.toString()
  logBuffer.push(text)
  if (logBuffer.length > 200) {
    logBuffer.shift()
  }
}

function spawnDevServer() {
  const child = spawn('pnpm', ['--filter', 'cryptiq-mindmap-demo', 'run', 'dev'], {
    env: devEnv,
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  const readyRegex = /ready - started server/i
  let ready = false

  const readyPromise = new Promise((resolve, reject) => {
    const handleData = (data) => {
      pushLog(data)
      if (!ready && readyRegex.test(data.toString())) {
        ready = true
        resolve(undefined)
      }
    }

    child.stdout.on('data', handleData)
    child.stderr.on('data', pushLog)

    child.once('exit', (code) => {
      if (!ready) {
        reject(new Error(`dev server exited before ready (code ${code ?? 'null'})`))
      }
    })
  })

  return { child, readyPromise }
}

async function runPlaywright() {
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage()
    const seen = new Map(REQUIRED_PATTERNS.map((pattern) => [pattern.source, 0]))

    page.on('console', (message) => {
      const text = message.text()
      for (const pattern of REQUIRED_PATTERNS) {
        if (pattern.test(text)) {
          const key = pattern.source
          seen.set(key, (seen.get(key) ?? 0) + 1)
        }
      }
    })

    const start = Date.now()
    await page.goto(url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(5000)
    const durationMs = Date.now() - start

    const missing = REQUIRED_PATTERNS.filter((pattern) => (seen.get(pattern.source) ?? 0) === 0)
    return {
      ok: missing.length === 0,
      durationMs,
      summary: Object.fromEntries([...seen.entries()].sort()),
      missing: missing.map((pattern) => pattern.source),
    }
  } finally {
    await browser.close()
  }
}

async function main() {
  const { child: dev, readyPromise } = spawnDevServer()
  let verification
  try {
    await readyPromise
    verification = await runPlaywright()
  } catch (error) {
    if (dev.pid) {
      dev.kill('SIGINT')
    }
    throw error
  } finally {
    if (dev.pid) {
      dev.kill('SIGINT')
      await Promise.race([
        once(dev, 'exit'),
        delay(2000),
      ])
    }
  }

  const output = {
    ok: verification.ok,
    durationMs: verification.durationMs,
    summary: verification.summary,
    missing: verification.missing,
    baseUrl: url,
    serverLog: logBuffer.slice(-50),
  }

  const writer = verification.ok ? console.log : console.error
  writer(JSON.stringify(output, null, 2))
  if (!verification.ok) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  const payload = {
    ok: false,
    error: error instanceof Error ? error.message : String(error),
    baseUrl: url,
    serverLog: logBuffer.slice(-50),
  }
  console.error(JSON.stringify(payload, null, 2))
  process.exitCode = 1
})
