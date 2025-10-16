import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3000'
const route = process.env.SMOKE_ROUTE || '/quiz/archetype-v1?pc=scene-03&falloff=1&simParamPointBaseSize=5'
const url = `${baseUrl}${route}`
const outDir = process.env.SMOKE_OUT_DIR || '.clmem/artifacts/ink'
const consoleOutDir = process.env.SMOKE_CONSOLE_OUT || '.clmem/artifacts/ink-console'
const runId = process.env.RUN_ID || `${Date.now()}`

test('ink smoke (quiz route)', async ({ page, browserName }) => {
  // 1) Persistent console buffer in page (captures logs/info/warn/error)
  await page.addInitScript(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    if (!w.__PLAYWRIGHT_MCP_CONSOLE__) w.__PLAYWRIGHT_MCP_CONSOLE__ = []
    const safe = (v: unknown) => {
      try {
        if (typeof v === 'string') return v
        return JSON.stringify(v)
      } catch {
        return String(v)
      }
    }
    ;(['log', 'info', 'warn', 'error'] as const).forEach((type) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const orig = (console as any)[type].bind(console)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(console as any)[type] = (...args: any[]) => {
        try {
          w.__PLAYWRIGHT_MCP_CONSOLE__.push({ ts: Date.now(), type, text: args.map(safe).join(' ') })
        } catch {
          // noop
        }
        orig(...args)
      }
    })
  })

  // 2) Node-side error aggregation
  const nodeConsole: { ts: number; type: string; text: string }[] = []
  page.on('console', (m) => {
    nodeConsole.push({ ts: Date.now(), type: m.type(), text: m.text() })
  })

  await page.goto(url, { waitUntil: 'domcontentloaded' })

  // 3) Reveal ready: await the three [PC] lines via the injected buffer
  await page.waitForFunction(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const logs = ((window as any).__PLAYWRIGHT_MCP_CONSOLE__ || []) as Array<{ text: string }>
    const text = logs.map((l) => (l && l.text) || '').join('\n')
    return text.includes('[PC] fluid uniforms prime') && text.includes('[PC] uniforms after-reveal') && text.includes('[PC] fluid init')
  }, { timeout: 30000 })

  // 4) Shader gate: no program/validate errors
  const shaderError = nodeConsole.find((e) => /THREE\.WebGLProgram|VALIDATE_STATUS|program not valid/i.test(e.text))
  expect(shaderError).toBeFalsy()

  // 5) Interactions: tap then drag
  const center = { x: 640, y: 360 }
  await page.mouse.move(center.x, center.y)
  await page.mouse.down()
  await page.waitForTimeout(50)
  await page.mouse.up()
  await page.mouse.move(center.x, center.y)
  await page.mouse.down()
  await page.mouse.move(center.x + 200, center.y, { steps: 15 })
  await page.mouse.up()

  // 6) Motion gate (optional if probe present)
  const firstVisible = await page.evaluate(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any).__inkProbe?.firstVisibleFrameIndex ?? null
  })
  if (firstVisible !== null) {
    expect(firstVisible as number).toBeLessThanOrEqual(2)
  }

  // 7) Artifacts: screenshots + console.json
  fs.mkdirSync(outDir, { recursive: true })
  fs.mkdirSync(consoleOutDir, { recursive: true })
  const pre = path.join(outDir, `ink-pre-${browserName}-${runId}.png`)
  const post = path.join(outDir, `ink-post-${browserName}-${runId}.png`)
  await page.screenshot({ path: pre, fullPage: false })
  await page.waitForTimeout(200)
  await page.screenshot({ path: post, fullPage: false })

  // Merge page buffer and node-side buffer, then persist
  const pageBuffer = await page.evaluate(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((window as any).__PLAYWRIGHT_MCP_CONSOLE__ || []) as Array<{ ts: number; type: string; text: string }>
  })
  const merged = [...pageBuffer, ...nodeConsole]
  const consolePath = path.join(consoleOutDir, `console-${browserName}-${runId}.json`)
  fs.writeFileSync(consolePath, JSON.stringify(merged, null, 2), 'utf8')
})


