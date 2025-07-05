#!/usr/bin/env node

import { forgeGraph, ForgeError } from '../src/index.js'
import { z } from 'zod'

/**
 * CLI argument schema
 */
const CLIArgsSchema = z.object({
  source: z.string(),
  format: z.enum(['json', 'yaml', 'csv', 'graphml']).optional(),
  output: z.string().optional(),
  maxNodes: z.number().int().positive().optional(),
  maxEdges: z.number().int().positive().optional(),
  noValidate: z.boolean().optional(),
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
    } else if (arg === '--format' || arg === '-f') {
      parsed.format = args[++i]
    } else if (arg === '--output' || arg === '-o') {
      parsed.output = args[++i]
    } else if (arg === '--max-nodes') {
      parsed.maxNodes = parseInt(args[++i], 10)
    } else if (arg === '--max-edges') {
      parsed.maxEdges = parseInt(args[++i], 10)
    } else if (arg === '--no-validate') {
      parsed.noValidate = true
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
graph-forge - Load and validate graphs for the Refinery SDK

Usage:
  graph-forge [options] <source>

Options:
  -s, --source <path>      Source file path (can also be provided as first argument)
  -f, --format <format>    Input format: json, yaml, csv, graphml (default: json)
  -o, --output <path>      Output file path (default: stdout)
  --max-nodes <number>     Maximum number of nodes to load
  --max-edges <number>     Maximum number of edges to load
  --no-validate            Skip schema validation
  -h, --help               Show this help message

Examples:
  graph-forge graph.json
  graph-forge --source graph.yaml --format yaml
  graph-forge --source data.csv --format csv --output graph.json
`)
}

/**
 * Main CLI function
 */
async function main(): Promise<void> {
  const args = parseArgs()
  
  try {
    console.error(`Loading graph from ${args.source}...`)
    
    const result = await forgeGraph({
      source: args.source,
      format: args.format || 'json',
      validate: !args.noValidate,
      maxNodes: args.maxNodes,
      maxEdges: args.maxEdges,
    })
    
    // Log warnings to stderr
    if (result.warnings.length > 0) {
      console.error('\nWarnings:')
      result.warnings.forEach(warning => {
        console.error(`  - ${warning}`)
      })
    }
    
    // Log metadata to stderr
    console.error('\nMetadata:')
    console.error(`  Load time: ${result.metadata.loadTime}ms`)
    console.error(`  Nodes: ${result.metadata.nodeCount}`)
    console.error(`  Edges: ${result.metadata.edgeCount}`)
    console.error(`  Format: ${result.metadata.format}`)
    
    // Output the graph
    const output = JSON.stringify(result.graph, null, 2)
    
    if (args.output) {
      // TODO: Write to file
      console.error(`\nWriting to ${args.output} (not implemented yet)`)
      console.log(output)
    } else {
      console.log(output)
    }
    
    process.exit(0)
  } catch (error) {
    if (error instanceof ForgeError) {
      console.error(`\nError: ${error.message}`)
      console.error(`Code: ${error.code}`)
      if (error.details) {
        console.error('Details:', error.details)
      }
    } else {
      console.error('\nUnexpected error:', error)
    }
    process.exit(1)
  }
}

// Run the CLI
main().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})