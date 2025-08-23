#!/usr/bin/env node
import { chromium } from 'playwright'
import fs from 'fs'

const outPath = process.argv[2]
if (!outPath) {
  console.error('Usage: capture-brain.mjs <outPath>')
  process.exit(1)
}

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

;(async () => {
  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const page = await ctx.newPage()
  await page.goto(`${BASE_URL}/brain`)
  await page.waitForSelector('canvas')
  // Wait until the app reports readiness via overlay text
  await page.waitForFunction(
    () => {
      const divs = Array.from(document.querySelectorAll('div'))
      const overlay = divs.find((d) => (d.textContent || '').includes('Brain Vertices'))
      if (!overlay) return false
      const txt = overlay.textContent || ''
      const m = txt.match(/Brain Vertices:\s*([0-9,]+)/)
      if (!m) return false
      const v = parseInt(m[1].replace(/,/g, ''), 10)
      if (!Number.isFinite(v) || v <= 0) return false
      // Optionally detect PASSED status if present
      const statusLine = divs.find((d) => (d.textContent || '').includes('Status:'))
      return !!statusLine
    },
    { timeout: 30000 }
  )
  // extra frame for determinism
  await page.waitForTimeout(250)
  await page.screenshot({ path: outPath })
  await browser.close()
  if (fs.existsSync(outPath)) console.log(`Saved ${outPath}`)
})()
