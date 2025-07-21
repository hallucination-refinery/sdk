#!/usr/bin/env node
/**
 * A simple verification script that runs TypeScript and ESLint checks.
 */

import { spawn } from 'child_process'
import path from 'path'

interface CommandResult {
  command: string
  success: boolean
}

// Dynamically determine the project root relative to this script's location.
// __dirname is not available in ES modules, so we derive it.
const scriptUrl = new URL(import.meta.url)
const scriptDir = path.dirname(scriptUrl.pathname)
const projectRoot = path.resolve(scriptDir, '..')

async function runCommand(command: string, args: string[]): Promise<CommandResult> {
  console.log(`\n🔷 Running: ${command} ${args.join(' ')}`)
  console.log('='.repeat(50))

  const proc = spawn(command, args, {
    cwd: projectRoot,
    stdio: 'inherit', // Stream output directly to the console
    shell: true, // Use shell to handle npx correctly on different systems
  })

  const exitCode = await new Promise<number>((resolve) => {
    proc.on('close', resolve)
  })

  return { command: `${command} ${args[0]}`, success: exitCode === 0 }
}

async function main() {
  console.log('🔍 Starting verification harness...')
  console.log(`📂 Project root identified as: ${projectRoot}`)

  const tscResult = await runCommand('npx', ['tsc', '-p', '.', '--noEmit'])
  const eslintResult = await runCommand('npx', [
    'eslint',
    '.',
    '--ext',
    '.ts,.tsx',
    '--max-warnings',
    '0',
    '--ignore-pattern',
    'legacy/',
    '--ignore-pattern',
    '.next/',
  ])

  console.log('\n📊 Verification Summary')
  console.log('='.repeat(50))
  console.log(`${tscResult.success ? '✅' : '❌'} TypeScript`)
  console.log(`${eslintResult.success ? '✅' : '❌'} ESLint`)

  if (!tscResult.success || !eslintResult.success) {
    console.error('\n❌ Verification failed. Please fix the errors above.')
    process.exit(1)
  } else {
    console.log('\n✅ All checks passed!')
  }
}

main().catch((error) => {
  console.error('\n🚨 An unexpected error occurred in the verification script:', error)
  process.exit(1)
})
