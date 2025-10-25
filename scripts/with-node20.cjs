#!/usr/bin/env node
const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

const commandArgs = process.argv.slice(2)
if (commandArgs.length === 0) {
  console.error('with-node20.cjs: missing command')
  process.exit(2)
}

const nvmDir = process.env.NVM_DIR
if (!nvmDir) {
  console.error('Run: nvm use 20')
  process.exit(1)
}

const nvmScript = path.join(nvmDir, 'nvm.sh')
if (!fs.existsSync(nvmScript)) {
  console.error('Run: nvm use 20')
  process.exit(1)
}

const appCwd = path.resolve(__dirname, '..', 'apps', 'cryptiq-mindmap-demo')
const timeoutMs = Number(process.env.DD_DEV_TIMEOUT_MS || 120000)

const escapedArgs = commandArgs
  .map((arg) => `'${arg.replace(/'/g, "'\\''")}'`)
  .join(' ')

const shellCommand = `. "${nvmScript}" >/dev/null 2>&1 || { echo 'Run: nvm use 20'; exit 1; }; nvm use 20 >/dev/null || { echo 'Run: nvm use 20'; exit 1; }; ${escapedArgs}`

const child = spawn('bash', ['-lc', shellCommand], {
  cwd: appCwd,
  stdio: 'inherit',
})

const timer = setTimeout(() => {
  try {
    process.stderr.write('[with-node20] timeout reached — sending SIGINT\n')
    child.kill('SIGINT')
    setTimeout(() => {
      if (!child.killed) {
        process.stderr.write('[with-node20] forcing SIGKILL\n')
        child.kill('SIGKILL')
      }
    }, 2500)
  } catch (error) {
    process.stderr.write(`[with-node20] timeout cleanup error: ${error.message}\n`)
  }
}, timeoutMs)

child.on('exit', (code, signal) => {
  clearTimeout(timer)
  if (signal) {
    process.exit(code ?? 128)
  }
  process.exit(code ?? 1)
})
