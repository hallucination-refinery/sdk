import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3000'
const route = process.env.SMOKE_ROUTE || '/quiz/archetype-v1?pc=scene-03&falloff=1&simParamPointBaseSize=5'
const url = `${baseUrl}${route}`

test('ink smoke (quiz route)', async ({ page, browserName }) => {
  const errors: string[] = []
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })

  await page.goto(url, { waitUntil: 'domcontentloaded' })

  // Reveal ready: await the three [PC] lines
  await page.waitForFunction(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const logs = (window as any).__PLAYWRIGHT_MCP_CONSOLE__ as any[] | undefined
    const text = (logs || []).map((l) => (l && l.text) || '').join('\n')
    return text.includes('[PC] fluid uniforms prime') && text.includes('[PC] uniforms after-reveal') && text.includes('[PC] fluid init')
  }, { timeout: 20000 })

  // Shader gate: no program/validate errors in console so far
  const shaderError = errors.find((e) => /THREE\.WebGLProgram|VALIDATE_STATUS|program not valid/i.test(e))
  expect(shaderError).toBeFalsy()

  // Interactions: tap then drag
  const center = { x: 640, y: 360 }
  await page.mouse.move(center.x, center.y)
  await page.mouse.down()
  await page.waitForTimeout(50)
  await page.mouse.up()
  await page.mouse.move(center.x, center.y)
  await page.mouse.down()
  await page.mouse.move(center.x + 200, center.y, { steps: 15 })
  await page.mouse.up()

  // Motion gate: expect frame probe <= 2
  const firstVisible = await page.evaluate(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any).__inkProbe?.firstVisibleFrameIndex ?? null
  })
  expect(firstVisible).not.toBeNull()
  expect(firstVisible as number).toBeLessThanOrEqual(2)

  // Artifacts
  const outDir = process.env.SMOKE_OUT_DIR || '.clmem/artifacts/ink'
  const runId = process.env.RUN_ID || `${Date.now()}`
  fs.mkdirSync(outDir, { recursive: true })
  const pre = path.join(outDir, `ink-pre-${browserName}-${runId}.png`)
  const post = path.join(outDir, `ink-post-${browserName}-${runId}.png`)
  await page.screenshot({ path: pre, fullPage: false })
  await page.waitForTimeout(200)
  await page.screenshot({ path: post, fullPage: false })
})


