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
  const targetCoverage = process.env.TARGET_COVERAGE || '0.75'
  await page.goto(
    `${BASE_URL}/brain?screenshot=1&targetCoverage=${encodeURIComponent(targetCoverage)}`
  )
  await page.waitForSelector('canvas')
  // Wait for canvas to settle (no HUD in screenshot mode)
  await page.waitForTimeout(2000)
  await page.screenshot({ path: outPath })
  await browser.close()
  if (fs.existsSync(outPath)) console.log(`Saved ${outPath}`)
})()
