#!/usr/bin/env node

#!/usr/bin/env node

import { readFile, writeFile } from 'fs/promises'
import { forgeGraph, type RawMemory } from '../dist/index.js'
import { z } from 'zod'

/**
 * CLI argument schema
 */
const CLIArgsSchema = z.object({
  source: z.string(),
  output: z.string().optional(),
  seed: z.number().int().optional(),
  iterations: z.number().int().positive().optional(),
  pretty: z.boolean().optional(),
})

/**
 * Parse command line arguments
 */
function parseArgs(): z.infer<typeof CLIArgsSchema> {
  const args = process.argv.slice(2)
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp()
    process.exit(0)
  }
  
  const parsed: Record<string, unknown> = {}
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    
    if (arg === '--source' || arg === '-s') {
      parsed.source = args[++i]
    } else if (arg === '--output' || arg === '-o') {
      parsed.output = args[++i]
    } else if (arg === '--seed') {
      parsed.seed = parseInt(args[++i], 10)
    } else if (arg === '--iterations') {
      parsed.iterations = parseInt(args[++i], 10)
    } else if (arg === '--pretty') {
      parsed.pretty = true
    } else if (!arg.startsWith('-') && !parsed.source) {
      // First non-flag argument is the source
      parsed.source = arg
    }
  }
  
  try {
    return CLIArgsSchema.parse(parsed)
  } catch (error) {
    console.error('Invalid arguments:', error)
    showHelp()
    process.exit(1)
  }
}

/**
 * Show help message
 */
function showHelp(): void {
  console.log(`
graph-forge - Generate deterministic graph layouts for the Refinery SDK

Usage:
  graph-forge [options] <source>

Options:
  -s, --source <path>      Source JSON file with RawMemory array
  -o, --output <path>      Output file path (default: stdout)
  --seed <number>          Random seed for deterministic layout (default: 42)
  --iterations <number>    Force simulation iterations (default: 300)
  --pretty                 Pretty print JSON output
  -h, --help               Show this help message

Input format:
  The source file should contain a JSON array of RawMemory objects:
  [
    {
      "id": "mem_001",
      "content": "Example memory",
      "connections": ["mem_002"],
      "cluster": "work",
      "metadata": {}
    }
  ]

Examples:
  graph-forge memories.json
  graph-forge memories.json --output graph.json
  graph-forge memories.json --seed 123 --iterations 500
`)
}

/**
 * Main CLI function
 */
async function main(): Promise<void> {
  const args = parseArgs()
  
  try {
    // Read input file
    console.error(`Loading memories from ${args.source}...`)
    const content = await readFile(args.source, 'utf-8')
    
    let rawMemories: RawMemory[]
    try {
      const parsed = JSON.parse(content)
      // Support both array format and object with 'memories' key
      rawMemories = Array.isArray(parsed) ? parsed : parsed.memories || []
    } catch (error) {
      console.error('Error: Invalid JSON in source file')
      process.exit(1)
    }
    
    console.error(`Found ${rawMemories.length} memories`)
    
    // Generate graph layout
    const startTime = Date.now()
    const result = await forgeGraph(rawMemories, {
      seed: args.seed,
      ...(args.iterations && {
        simulation: {
          iterations: args.iterations,
        },
      }),
    })
    const elapsed = Date.now() - startTime
    
    // Log statistics to stderr
    console.error('\nLayout generation complete:')
    console.error(`  Time: ${elapsed}ms`)
    console.error(`  Nodes: ${result.nodes.length}`)
    console.error(`  Edges: ${result.edges.length}`)
    console.error(`  Seed: ${args.seed || 42}`)
    console.error(`  Iterations: ${args.iterations || 300}`)
    
    // Prepare output
    const output = JSON.stringify(result, null, args.pretty ? 2 : 0)
    
    if (args.output) {
      await writeFile(args.output, output, 'utf-8')
      console.error(`\nWritten to ${args.output}`)
    } else {
      console.log(output)
    }
    
    process.exit(0)
  } catch (error) {
    console.error('\nUnexpected error:', error)
    process.exit(1)
  }
}

// Run the CLI
main().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})