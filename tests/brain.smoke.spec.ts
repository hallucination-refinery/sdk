import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

test('brain smoke', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })

  const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
  const route = process.env.SMOKE_ROUTE || '/brain'
  const url = `${baseUrl}${route}`

  await page.goto(url, { waitUntil: 'domcontentloaded' })

  const canvas = page.locator('canvas')
  await expect(canvas).toHaveCount(1)
  await expect(canvas.first()).toBeVisible()

  // Wait for readiness: overlay with non-zero brain vertex count
  const readyTimeout = Number(process.env.READY_TIMEOUT_MS || 20000)
  await page.waitForFunction(
    () => {
      const divs = Array.from(document.querySelectorAll('div'))
      const el = divs.find((d) => (d.textContent || '').includes('Brain Vertices:'))
      if (!el) return false
      const m = (el.textContent || '').match(/Brain Vertices:\s*([0-9,]+)/)
      if (!m) return false
      const count = parseInt(m[1].replace(/,/g, ''), 10)
      return Number.isFinite(count) && count > 0
    },
    { timeout: readyTimeout }
  )

  const grace = Number(process.env.RENDER_GRACE_MS || 1500)
  await page.waitForTimeout(grace)

  // Stabilize visuals (disable CSS animations/transitions) before visual parity check
  await page.addStyleTag({
    content: '* { animation: none !important; transition: none !important; }',
  })

  // Hide small overlays so we don't mask the whole viewport by accident
  await page.evaluate(() => {
    const findDiv = (text: string) => Array.from(document.querySelectorAll('div')).find(d => (d.textContent || '').includes(text));
    const status = findDiv('Session 12: Integration Testing');
    const perf = findDiv('Performance Baseline');
    if (status) (status as HTMLElement).style.visibility = 'hidden';
    if (perf) (perf as HTMLElement).style.visibility = 'hidden';
  })
  // Visual parity gate (always assert; --update-snapshots will seed baseline on first run)
  const visualTolerance = Number(process.env.VISUAL_TOLERANCE || '0.10')
  await expect(page).toHaveScreenshot('brain-baseline.png', {
    maxDiffPixelRatio: visualTolerance,
    fullPage: false,
    timeout: 15000,
  })

  const outDir = process.env.SMOKE_OUT_DIR || '.clmem/artifacts/smoke'
  const runId = process.env.RUN_ID || `${Date.now()}`
  fs.mkdirSync(outDir, { recursive: true })
  const outPath = path.join(outDir, `brain-${runId}.png`)
  await page.screenshot({ path: outPath, fullPage: false })

  const stat = fs.statSync(outPath)
  expect(stat.size).toBeGreaterThan(10_000)

  const failOnConsole = (process.env.FAIL_ON_CONSOLE_ERRORS || 'true') === 'true'
  if (failOnConsole) {
    expect(errors, `Console errors:\n${errors.join('\n')}`).toEqual([])
  }
})
