import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3000'
const route = process.env.SMOKE_ROUTE || '/quiz/archetype-v1?pc=scene-03&forceVisible=1'
const url = `${baseUrl}${route}`
const outDir = process.env.SMOKE_OUT_DIR || '.clmem/artifacts/ink'
const consoleOutDir = process.env.SMOKE_CONSOLE_OUT || '.clmem/artifacts/ink-console'
const runId = process.env.RUN_ID || `${Date.now()}`
const minBytes = Number(process.env.MIN_SMOKE_BYTES || '15000')

const ensureDir = (target: string) => {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true })
  }
}

const toSerializableConsoleEntry = (entry: { ts: number; type: string; text: string }) => {
  return {
    ts: entry.ts,
    type: entry.type,
    text: entry.text,
  }
}

test('ink smoke (quiz forceVisible bypass)', async ({ page, browserName }) => {
  // 1) Deterministic viewport + reduced motion + language normalization
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'language', { value: 'en-US', configurable: true })
    Object.defineProperty(navigator, 'languages', {
      value: ['en-US', 'en'],
      configurable: true,
    })
  })

  // 2) Capture console on the page (browser-side) for later retrieval
  await page.addInitScript(() => {
    const safe = (value: unknown) => {
      try {
        if (typeof value === 'string') return value
        return JSON.stringify(value)
      } catch {
        return String(value)
      }
    }
    const buffer: { ts: number; type: string; text: string }[] = []
    Object.defineProperty(window, '__PLAYWRIGHT_MCP_CONSOLE__', {
      value: buffer,
      configurable: true,
      writable: false,
    })
    ;(['log', 'info', 'warn', 'error'] as const).forEach((type) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const original = (console as any)[type].bind(console)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(console as any)[type] = (...args: any[]) => {
        try {
          buffer.push({ ts: Date.now(), type, text: args.map(safe).join(' ') })
        } catch {
          buffer.push({ ts: Date.now(), type, text: '[console stringify failed]' })
        }
        original(...args)
      }
    })
  })

  // 3) Capture console on the Node side for redundant logging
  const nodeConsole: { ts: number; type: string; text: string }[] = []
  page.on('console', (message) => {
    nodeConsole.push({ ts: Date.now(), type: message.type(), text: message.text() })
  })

  await page.goto(url, { waitUntil: 'domcontentloaded' })

  // 4) Verify canvas presence and visibility
  const canvas = page.locator('canvas')
  await expect(canvas).toHaveCount(1)
  await expect(canvas.first()).toBeVisible()

  // 5) Await forceVisible + reveal logs via combined buffer
  await page.waitForFunction(
    () => {
      const logs = (window as any).__PLAYWRIGHT_MCP_CONSOLE__ as Array<{ text: string }> | undefined
      if (!logs || logs.length === 0) return false
      const bundle = logs.map((l) => l.text || '').join('\n')
      return (
        bundle.includes('[PC] fluid uniforms prime') &&
        bundle.includes('[PC] uniforms after-reveal') &&
        bundle.includes('[PC] fluid init') &&
        (bundle.includes('[PC] forceVisible uniforms') || bundle.includes('[PC] forceVisible applied'))
      )
    },
    { timeout: 30_000 }
  )

  // 6) Assert shader gate is clean (no validation errors)
  const shaderError = nodeConsole.find((entry) =>
    /THREE\.WebGLProgram|VALIDATE_STATUS|program not valid/i.test(entry.text)
  )
  expect(shaderError).toBeFalsy()

  // 7) Capture screenshots after a brief stabilization
  ensureDir(outDir)
  ensureDir(consoleOutDir)
  const screenshotBase = `ink-${browserName}-${runId}`
  const prePath = path.join(outDir, `${screenshotBase}-pre.png`)
  const postPath = path.join(outDir, `${screenshotBase}-post.png`)
  await page.screenshot({ path: prePath, fullPage: false })
  await page.waitForTimeout(200)
  await page.screenshot({ path: postPath, fullPage: false })

  const preStat = fs.statSync(prePath)
  const postStat = fs.statSync(postPath)
  expect(preStat.size).toBeGreaterThan(minBytes)
  expect(postStat.size).toBeGreaterThan(minBytes)

  // 8) Persist console output (merged page + node buffers)
  const pageBuffer = await page.evaluate(() => {
    return ((window as any).__PLAYWRIGHT_MCP_CONSOLE__ || []) as Array<{
      ts: number
      type: string
      text: string
    }>
  })
  const merged = [...pageBuffer, ...nodeConsole]
  const consolePath = path.join(consoleOutDir, `console-${browserName}-${runId}.json`)
  fs.writeFileSync(
    consolePath,
    JSON.stringify(merged.map(toSerializableConsoleEntry), null, 2),
    'utf8'
  )

  // 9) Optional: inspect firstVisible probe if present (non-fatal)
  const firstVisible = await page.evaluate(() => {
    return (window as any).__inkProbe?.firstVisibleFrameIndex ?? null
  })
  if (firstVisible !== null && Number.isFinite(firstVisible)) {
    expect(firstVisible as number).toBeLessThanOrEqual(2)
  }
})


