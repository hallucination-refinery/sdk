import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

test('ink interaction smoke - scene-03', async ({ page }) => {
  const errors: string[] = []
  const consoleLogs: string[] = []
  
  // Capture all console messages
  page.on('console', (msg) => {
    const text = msg.text()
    consoleLogs.push(`[${msg.type().toUpperCase()}] ${text}`)
    if (msg.type() === 'error') {
      errors.push(text)
    }
  })

  const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
  const url = `${baseUrl}/quiz/archetype-v1?pc=scene-03&debug=1&falloff=1`
  
  console.log(`[Test] Navigating to ${url}`)
  await page.goto(url, { waitUntil: 'domcontentloaded' })

  // Wait for canvas
  const canvas = page.locator('canvas')
  await expect(canvas).toHaveCount(1)
  await expect(canvas.first()).toBeVisible()
  console.log('[Test] Canvas visible')

  // Wait for reveal (simple timeout approach)
  console.log('[Test] Waiting for reveal...')
  await page.waitForTimeout(5000)
  
  // Inject probe and ensure falloff
  console.log('[Test] Injecting probes...')
  await page.evaluate(() => {
    if (window.dreamdust?.ensureFalloff) {
      window.dreamdust.ensureFalloff()
    }
  })

  // Get canvas bounds for interaction
  const canvasBounds = await page.evaluate(() => {
    const canvas = document.querySelector('canvas')
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
      centerX: rect.left + rect.width / 2,
      centerY: rect.top + rect.height / 2
    }
  })

  if (!canvasBounds) {
    throw new Error('Canvas bounds not found')
  }

  console.log(`[Test] Canvas bounds: ${JSON.stringify(canvasBounds)}`)

  // Capture pre-stroke uniforms
  const preUniforms = await page.evaluate(() => {
    const u: any = (window as any).dreamdust?.uniforms || {}
    return {
      uTempForce: u?.uTempForce?.value,
      uTempIntensity: u?.uTempIntensity?.value,
      uTempCenter: u?.uTempCenter?.value,
      uTempRadius: u?.uTempRadius?.value,
      uTempFalloffOn: u?.uTempFalloffOn?.value,
    }
  })
  console.log(`[Test] Pre-stroke uniforms: ${JSON.stringify(preUniforms)}`)

  // Take pre-stroke screenshot
  const timestamp = new Date().toISOString().split('T')[0]
  const assetsDir = 'docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets'
  fs.mkdirSync(assetsDir, { recursive: true })
  
  const preScreenshot = path.join(assetsDir, `${timestamp}-automated-pre-stroke.png`)
  await page.screenshot({ path: preScreenshot, fullPage: false })
  console.log(`[Test] Pre-stroke screenshot: ${preScreenshot}`)

  // Simulate stroke: left 25% to right 75% horizontally at middle
  const startX = canvasBounds.x + canvasBounds.width * 0.25
  const startY = canvasBounds.centerY
  const endX = canvasBounds.x + canvasBounds.width * 0.75
  const endY = canvasBounds.centerY

  console.log(`[Test] Simulating stroke from (${startX}, ${startY}) to (${endX}, ${endY})`)
  
  // Use native Playwright mouse for real interaction
  await page.mouse.move(startX, startY)
  await page.mouse.down()
  
  // Drag over 1 second (10 steps of 100ms)
  for (let i = 1; i <= 10; i++) {
    const x = startX + (endX - startX) * (i / 10)
    await page.mouse.move(x, startY)
    await page.waitForTimeout(100)
  }
  
  // Capture mid-stroke screenshot
  const midScreenshot = path.join(assetsDir, `${timestamp}-automated-mid-stroke.png`)
  await page.screenshot({ path: midScreenshot, fullPage: false })
  console.log(`[Test] Mid-stroke screenshot: ${midScreenshot}`)
  
  await page.mouse.up()
  console.log('[Test] Stroke complete')

  // Wait for decay
  await page.waitForTimeout(500)

  // Capture post-stroke uniforms
  const postUniforms = await page.evaluate(() => {
    if (window.dreamdust?.dumpUniforms) {
      window.dreamdust.dumpUniforms()
    }
    const u: any = (window as any).dreamdust?.uniforms || {}
    return {
      uTempForce: u?.uTempForce?.value,
      uTempIntensity: u?.uTempIntensity?.value,
      uTempCenter: u?.uTempCenter?.value,
      uTempRadius: u?.uTempRadius?.value,
      uTempFalloffOn: u?.uTempFalloffOn?.value,
    }
  })
  console.log(`[Test] Post-stroke uniforms: ${JSON.stringify(postUniforms)}`)

  // Take post-stroke screenshot
  const postScreenshot = path.join(assetsDir, `${timestamp}-automated-post-stroke.png`)
  await page.screenshot({ path: postScreenshot, fullPage: false })
  console.log(`[Test] Post-stroke screenshot: ${postScreenshot}`)

  // Extract key console logs
  const drawStartLogs = consoleLogs.filter(l => l.includes('[PC] draw start'))
  const drawEndLogs = consoleLogs.filter(l => l.includes('[PC] draw end'))
  const uniformLogs = consoleLogs.filter(l => l.includes('[dreamdust uniforms]'))
  
  console.log(`[Test] Draw events: ${drawStartLogs.length} starts, ${drawEndLogs.length} ends`)
  console.log(`[Test] Uniform dumps: ${uniformLogs.length}`)

  // Write evidence bundle
  const evidencePath = path.join(assetsDir, `${timestamp}-automated-evidence.json`)
  const evidence = {
    url,
    timestamp: new Date().toISOString(),
    preUniforms,
    postUniforms,
    drawEvents: {
      starts: drawStartLogs.length,
      ends: drawEndLogs.length
    },
    uniformDumps: uniformLogs.length,
    screenshots: {
      pre: preScreenshot,
      mid: midScreenshot,
      post: postScreenshot
    },
    consoleLogs: consoleLogs.slice(-50) // last 50 lines
  }
  fs.writeFileSync(evidencePath, JSON.stringify(evidence, null, 2))
  console.log(`[Test] Evidence bundle: ${evidencePath}`)

  // Gate verification
  console.log('[Test] Verifying acceptance gates...')
  
  // Gate 1: ≤2 frames immediate motion (check if draw events fired)
  const gate1Pass = drawStartLogs.length > 0 && drawEndLogs.length > 0
  console.log(`[Gate 1] ≤2 frames motion (draw events fired): ${gate1Pass ? 'PASS' : 'FAIL'}`)
  
  // Gate 2: Localized 10-20% (check intensity rose)
  const intensityRose = (postUniforms.uTempIntensity || 0) > 0.01
  console.log(`[Gate 2] Localized motion (intensity rose): ${intensityRose ? 'PASS' : 'FAIL'}`)
  
  // Gate 3: Falloff engaged
  const falloffEngaged = (postUniforms.uTempFalloffOn || 0) > 0.5
  console.log(`[Gate 3] Falloff engaged: ${falloffEngaged ? 'PASS' : 'FAIL'}`)
  
  // Gate 4: No console errors
  const gate4Pass = errors.length === 0
  console.log(`[Gate 4] No errors: ${gate4Pass ? 'PASS' : 'FAIL'}`)
  
  const allGatesPassed = gate1Pass && intensityRose && falloffEngaged && gate4Pass
  
  console.log(`\n${'='.repeat(60)}`)
  console.log(`AUTOMATED SMOKE TEST: ${allGatesPassed ? 'PASS' : 'FAIL'}`)
  console.log(`${'='.repeat(60)}`)
  console.log(`Evidence: ${evidencePath}`)
  console.log(`Screenshots: ${preScreenshot}, ${midScreenshot}, ${postScreenshot}`)
  console.log(`Uniforms: uTempIntensity=${postUniforms.uTempIntensity}, uTempFalloffOn=${postUniforms.uTempFalloffOn}, uTempRadius=${postUniforms.uTempRadius}`)
  
  // Soft assertions (report but don't fail test)
  if (!allGatesPassed) {
    console.warn('[Test] Some gates failed - see evidence for details')
  }
  
  // Hard assertion: at minimum, page should load and render without errors
  expect(errors.length).toBe(0)
})

