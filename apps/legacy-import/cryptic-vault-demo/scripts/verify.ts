#!/usr/bin/env node
/**
 * Chunk runner script to avoid E2BIG errors when running TypeScript and ESLint checks
 * Processes files in batches to stay within command line length limits
 */

import { spawn } from 'child_process'
import { readdir } from 'fs/promises'
import { join, relative } from 'path'

const CHUNK_SIZE = 15
const projectRoot = join(__dirname, '..')

interface CheckResult {
  command: string
  hasErrors: boolean
  errorCount: number
}

/**
 * Recursively find all TypeScript files in a directory
 */
async function getTypeScriptFiles(dir: string): Promise<string[]> {
  const files: string[] = []
  const entries = await readdir(dir, { withFileTypes: true })
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== 'dist') {
      files.push(...await getTypeScriptFiles(fullPath))
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      files.push(fullPath)
    }
  }
  return files
}

/**
 * Run a command on file chunks
 */
async function runInChunks(
  command: string, 
  args: string[], 
  files: string[]
): Promise<CheckResult> {
  const chunks: string[][] = []
  for (let i = 0; i < files.length; i += CHUNK_SIZE) {
    chunks.push(files.slice(i, i + CHUNK_SIZE))
  }
  
  let hasErrors = false
  let totalErrors = 0
  
  console.log(`\n📋 Processing ${files.length} files in ${chunks.length} chunks...`)
  
  for (const [index, chunk] of chunks.entries()) {
    console.log(`\n🔄 Running chunk ${index + 1}/${chunks.length} (${chunk.length} files)...`)
    
    // Make paths relative for cleaner output
    const relativeFiles = chunk.map(f => relative(projectRoot, f))
    
    const proc = spawn(command, [...args, ...relativeFiles], { 
      cwd: projectRoot,
      env: { ...process.env, NODE_OPTIONS: '' },
      stdio: 'pipe'
    })
    
    let output = ''
    let errorOutput = ''
    
    proc.stdout.on('data', (data) => {
      output += data.toString()
      process.stdout.write(data)
    })
    
    proc.stderr.on('data', (data) => {
      errorOutput += data.toString()
      process.stderr.write(data)
    })
    
    const code = await new Promise<number>((resolve) => {
      proc.on('close', resolve)
    })
    
    if (code !== 0) {
      hasErrors = true
      // Try to count errors from output
      const errorMatches = [...output.matchAll(/error/gi), ...errorOutput.matchAll(/error/gi)]
      totalErrors += errorMatches.length
    }
  }
  
  return { command, hasErrors, errorCount: totalErrors }
}

/**
 * Main verification function
 */
async function main() {
  console.log('🔍 TypeScript and ESLint Chunk Verification Tool\n')
  
  try {
    // Find all TypeScript files
    const files = await getTypeScriptFiles(projectRoot)
    console.log(`✅ Found ${files.length} TypeScript files`)
    
    const results: CheckResult[] = []
    
    // Run TypeScript check
    console.log('\n' + '='.repeat(50))
    console.log('🔷 Running TypeScript Check')
    console.log('='.repeat(50))
    const tscResult = await runInChunks(
      'npx', 
      ['tsc', '--noEmit', '--noUnusedLocals', '--noUnusedParameters'], 
      files
    )
    results.push(tscResult)
    
    // Run ESLint check
    console.log('\n' + '='.repeat(50))
    console.log('🔶 Running ESLint Check')
    console.log('='.repeat(50))
    const eslintResult = await runInChunks(
      'npx', 
      ['eslint', '--max-warnings', '0'], 
      files
    )
    results.push(eslintResult)
    
    // Summary
    console.log('\n' + '='.repeat(50))
    console.log('📊 Verification Summary')
    console.log('='.repeat(50))
    
    let hasAnyErrors = false
    for (const result of results) {
      const status = result.hasErrors ? '❌ FAILED' : '✅ PASSED'
      console.log(`${status} ${result.command}`)
      if (result.hasErrors) {
        hasAnyErrors = true
      }
    }
    
    if (hasAnyErrors) {
      console.error('\n❌ Verification failed - please fix all errors before committing')
      process.exit(1)
    } else {
      console.log('\n✅ All checks passed - ready to commit!')
      process.exit(0)
    }
    
  } catch (error) {
    console.error('\n❌ Error running verification:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error)
}

export { main, getTypeScriptFiles, runInChunks }