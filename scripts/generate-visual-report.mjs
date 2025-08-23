#!/usr/bin/env node
import fs from 'fs'
import path from 'path'

const [,, runDir] = process.argv
if (!runDir) {
  console.error('Usage: generate-visual-report.mjs <run_dir>')
  process.exit(1)
}

async function generateReport(runDir) {
  try {
    const metricsPath = path.join(runDir, 'metrics.json')
    const metrics = JSON.parse(fs.readFileSync(metricsPath, 'utf8'))
    const iterations = metrics.iterations || []

    const final = iterations.length ? iterations[iterations.length - 1] : metrics
    const converged = final.acceptable

    const report = `# Visual Parity Report\n\n` +
      `## Summary\n` +
      `- **Iterations**: ${iterations.length || 1}\n` +
      `- **Status**: ${converged ? '✅ CONVERGED' : '❌ FAILED'}\n` +
      `- **Final Coverage**: ${final.coverage}%\n` +
      `- **Particles**: ${final.particleCount}\n` +
      `- **Colors**: ${final.distinctColors}\n\n` +
      `## Acceptance Criteria\n` +
      `- Coverage 70–80%: ${final.coverage >= 70 && final.coverage <= 80 ? 'PASS' : 'FAIL'}\n` +
      `- Particles ≥200: ${final.particleCount >= 200 ? 'PASS' : 'FAIL'}\n` +
      `- Colors ≥5: ${final.distinctColors >= 5 ? 'PASS' : 'FAIL'}\n` +
      `- No overlay: ${!final.hasOverlay ? 'PASS' : 'FAIL'}\n` +
      `\n---\n*Generated at ${new Date().toISOString()}*\n`

    fs.writeFileSync(path.join(runDir, 'report.md'), report)
    console.log(`✅ Report generated: ${path.join(runDir, 'report.md')}`)
  } catch (e) {
    console.error('❌ Report generation failed:', e.message)
    process.exit(1)
  }
}

generateReport(runDir)


