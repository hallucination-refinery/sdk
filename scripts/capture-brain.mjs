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
  // extra frame for determinism
  await page.waitForTimeout(200)
  await page.screenshot({ path: outPath })
  await browser.close()
  if (fs.existsSync(outPath)) console.log(`Saved ${outPath}`)
})()


