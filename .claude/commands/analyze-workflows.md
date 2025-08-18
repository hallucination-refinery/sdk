# Analyze Workflows

Run the meta-workflow agent to analyze execution history and optimize the documentation pipeline.

## What it does

1. Analyzes all workflow artifacts in `.clmem/`
2. Identifies patterns, bottlenecks, and failures
3. Tracks quality trends over time
4. Generates optimization recommendations
5. Creates reusable patterns and configurations

## When to run

- Automatically after each slash command (built into workflows)
- Manually when you want deeper analysis
- After multiple workflow executions
- When performance degrades

## Output

- `.clmem/workflows/meta-analysis-[timestamp].md` - Full analysis report
- `.clmem/config/optimized-settings.json` - Optimized configurations
- `.clmem/patterns/` - Reusable search patterns
- `.clmem/knowledge/` - Accumulated learnings

## Usage

Simply run `/analyze-workflows` or it will run automatically after other commands.