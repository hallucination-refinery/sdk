#!/usr/bin/env node

import sharp from 'sharp'
import fs from 'fs'

const [,, screenshotPath, referencePath] = process.argv

if (!screenshotPath || !referencePath) {
  console.error('Usage: analyze-visual-parity.mjs <screenshot> <reference>')
  process.exit(1)
}

async function analyzeScreenshot(screenshotPath, referencePath) {
  try {
    const { data: screenshot, info } = await sharp(screenshotPath)
      .raw()
      .toBuffer({ resolveWithObject: true })

    const { width, height } = info
    const totalPixels = width * height

    let nonBlackPixels = 0
    let brightPixels = 0
    const colorCounts = new Map()

    for (let i = 0; i < screenshot.length; i += 3) {
      const r = screenshot[i]
      const g = screenshot[i + 1]
      const b = screenshot[i + 2]

      if (r > 10 || g > 10 || b > 10) {
        nonBlackPixels++
      }

      const brightness = (r + g + b) / 3
      if (brightness > 150) brightPixels++

      const colorKey = `${Math.floor(r/50)*50}-${Math.floor(g/50)*50}-${Math.floor(b/50)*50}`
      colorCounts.set(colorKey, (colorCounts.get(colorKey) || 0) + 1)
    }

    const coverage = (nonBlackPixels / totalPixels) * 100
    const particleCount = brightPixels
    const distinctColors = colorCounts.size

    const hasOverlay = await detectOverlay(screenshotPath)
    const aestheticScore = calculateAestheticScore(coverage, particleCount, distinctColors)

    const stageMetrics = {
      framing: coverage >= 70 && coverage <= 80,
      particles: particleCount >= 200,
      colors: distinctColors >= 5,
      overlay: !hasOverlay
    }

    const metrics = {
      coverage: Math.round(coverage * 100) / 100,
      particleCount,
      distinctColors,
      hasOverlay,
      aestheticScore: Math.round(aestheticScore * 100) / 100,
      stageMetrics,
      acceptable: stageMetrics.framing && stageMetrics.particles && stageMetrics.colors && stageMetrics.overlay,
      timestamp: new Date().toISOString()
    }

    console.log(JSON.stringify(metrics, null, 2))
    return metrics
  } catch (error) {
    console.error('Analysis failed:', error.message)
    process.exit(1)
  }
}

async function detectOverlay(imagePath) {
  const { data } = await sharp(imagePath).greyscale().raw().toBuffer({ resolveWithObject: true })
  let edgePixels = 0
  for (let i = 1; i < data.length - 1; i++) {
    if (Math.abs(data[i] - data[i-1]) > 100) edgePixels++
  }
  return (edgePixels / data.length) > 0.01
}

function calculateAestheticScore(coverage, particleCount, distinctColors) {
  let score = 0
  if (coverage >= 70 && coverage <= 80) score += 40
  else if (coverage >= 60 && coverage <= 85) score += 30
  else if (coverage >= 50 && coverage <= 90) score += 20

  if (particleCount >= 300) score += 30
  else if (particleCount >= 200) score += 25
  else if (particleCount >= 100) score += 15
  else if (particleCount >= 50) score += 10

  if (distinctColors >= 7) score += 30
  else if (distinctColors >= 5) score += 25
  else if (distinctColors >= 3) score += 15
  else if (distinctColors >= 2) score += 10

  return score
}

analyzeScreenshot(screenshotPath, referencePath)


