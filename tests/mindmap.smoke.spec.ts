import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

test('mindmap smoke', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })

  const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
  const url = baseUrl

  await page.goto(url, { waitUntil: 'domcontentloaded' })

  // Check for canvas element
  const canvas = page.locator('canvas')
  await expect(canvas).toHaveCount(1)
  await expect(canvas.first()).toBeVisible()

  // Wait for rendering
  const grace = Number(process.env.RENDER_GRACE_MS || 1500)
  await page.waitForTimeout(grace)

  // Stabilize visuals (disable CSS animations/transitions) before visual parity check
  await page.addStyleTag({
    content: '* { animation: none !important; transition: none !important; }',
  })

  // Visual parity gate
  const visualTolerance = Number(process.env.VISUAL_TOLERANCE || '0.10')
  await expect(page).toHaveScreenshot('mindmap-baseline.png', {
    maxDiffPixelRatio: visualTolerance,
    fullPage: false,
    timeout: 15000,
  })

  const outDir = process.env.SMOKE_OUT_DIR || '.clmem/artifacts/smoke'
  const runId = process.env.RUN_ID || `${Date.now()}`
  fs.mkdirSync(outDir, { recursive: true })
  const outPath = path.join(outDir, `mindmap-${runId}.png`)
  await page.screenshot({ path: outPath, fullPage: false })

  const stat = fs.statSync(outPath)
  const minBytes = Number(process.env.MIN_SMOKE_BYTES || '10000')
  expect(stat.size).toBeGreaterThan(minBytes)

  const failOnConsole = (process.env.FAIL_ON_CONSOLE_ERRORS || 'true') === 'true'
  if (failOnConsole) {
    expect(errors, `Console errors:\n${errors.join('\n')}`).toEqual([])
  }
})