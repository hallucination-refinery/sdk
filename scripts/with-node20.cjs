#!/usr/bin/env node
const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

const commandArgs = process.argv.slice(2)
if (commandArgs.length === 0) {
  console.error('with-node20.cjs: missing command')
  process.exit(2)
}

const nvmDir =
  process.env.NVM_DIR ||
  (process.env.HOME ? path.join(process.env.HOME, '.nvm') : undefined)
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
const localBin = path.join(appCwd, 'node_modules', '.bin')
const envPath = process.env.PATH || ''
const childEnv = {
  ...process.env,
  NVM_DIR: nvmDir,
  PATH: `${localBin}${path.delimiter}${envPath}`,
}

const escapedArgs = commandArgs
  .map((arg) => `'${arg.replace(/'/g, "'\\''")}'`)
  .join(' ')

const escapedNvmDir = `'${nvmDir.replace(/'/g, "'\\''")}'`
const sourceNvm = `. "${nvmScript}"; command -v nvm > /dev/null || { echo 'Run: nvm use 20'; exit 1; }`
const useNode = `nvm use 20 > /dev/null || { echo 'Run: nvm use 20'; exit 1; }`
const shellCommand = `export NVM_DIR=${escapedNvmDir}; ${sourceNvm}; ${useNode}; ${escapedArgs}`

const child = spawn('bash', ['-lc', shellCommand], {
  cwd: appCwd,
  stdio: 'inherit',
  env: childEnv,
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
