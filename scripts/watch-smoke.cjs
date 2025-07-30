#!/usr/bin/env node

/**
 * Watch-Dog Smoke-screen Runner
 * 
 * Watches for file changes and runs smoke tests to ensure graph health.
 * Can be integrated with guard hooks for continuous validation.
 * 
 * Note: This version uses file watching and Jest tests.
 * For full browser automation, install Playwright and uncomment the browser sections.
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Configuration
const WATCH_PATHS = [
  'packages/canvas-r3f/src',
  'apps/legacy-import/cryptic-vault-demo/components',
  'apps/legacy-import/cryptic-vault-demo/app/debug'
];

const DEBOUNCE_MS = 1000;
const TEST_COMMAND = 'pnpm';
const TEST_ARGS = ['test', 'ForceGraphAdapter.smoke'];
const TEST_CWD = path.join(__dirname, '..', 'packages', 'canvas-r3f');

// Colors for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

// State
let isRunning = false;
let pendingRun = false;
let debounceTimer = null;

/**
 * Log with color and timestamp
 */
function log(message, color = 'reset') {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${colors[color]}[${timestamp}] ${message}${colors.reset}`);
}

/**
 * Run TypeScript compilation check
 */
function runTypeScriptCheck() {
  return new Promise((resolve) => {
    log('Running TypeScript check...', 'blue');
    
    const tsc = spawn('pnpm', ['exec', 'tsc', '--noEmit'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe'
    });

    let output = '';
    tsc.stdout.on('data', (data) => { output += data; });
    tsc.stderr.on('data', (data) => { output += data; });

    tsc.on('close', (code) => {
      if (code === 0) {
        log('✓ TypeScript compilation passed', 'green');
        resolve(true);
      } else {
        log('✗ TypeScript compilation failed', 'red');
        if (output.trim()) {
          console.log(output);
        }
        resolve(false);
      }
    });
  });
}

/**
 * Run smoke test
 */
function runSmokeTest() {
  return new Promise((resolve) => {
    log('Running ForceGraphAdapter smoke test...', 'blue');
    
    const test = spawn(TEST_COMMAND, TEST_ARGS, {
      cwd: TEST_CWD,
      stdio: 'pipe'
    });

    let output = '';
    let hasError = false;

    test.stdout.on('data', (data) => {
      output += data;
      // Check for test failures
      if (data.toString().includes('FAIL')) {
        hasError = true;
      }
    });

    test.stderr.on('data', (data) => {
      output += data;
      hasError = true;
    });

    test.on('close', (code) => {
      if (code === 0 && !hasError) {
        log('✓ Smoke test passed', 'green');
        resolve(true);
      } else {
        log('✗ Smoke test failed', 'red');
        console.log(output);
        resolve(false);
      }
    });
  });
}

/**
 * Run all checks
 */
async function runAllChecks() {
  if (isRunning) {
    pendingRun = true;
    return false;
  }

  isRunning = true;
  log('Starting watch-dog checks...', 'magenta');
  let allPassed = false;

  try {
    // Run TypeScript check first
    const tsResult = await runTypeScriptCheck();
    
    // Only run smoke test if TypeScript passes
    if (tsResult) {
      const testResult = await runSmokeTest();
      
      if (testResult) {
        log('✓ All checks passed! Graph is healthy.', 'green');
        allPassed = true;
        
        // TODO: Uncomment when Playwright is installed
        /*
        log('Opening browser to verify visually...', 'blue');
        const browser = await playwright.chromium.launch({ headless: false });
        const page = await browser.newPage();
        
        // Monitor console errors
        page.on('console', msg => {
          if (msg.type() === 'error') {
            log(`Browser console error: ${msg.text()}`, 'red');
          }
        });
        
        await page.goto('http://localhost:3000/debug/fg-repro');
        await page.waitForTimeout(5000);
        
        // Check for window.__FG
        const hasFG = await page.evaluate(() => {
          return typeof window.__FG !== 'undefined' && 
                 typeof window.__FG.refresh === 'function';
        });
        
        if (hasFG) {
          log('✓ window.__FG is available with refresh method', 'green');
        } else {
          log('✗ window.__FG not found or missing refresh method', 'red');
          allPassed = false;
        }
        
        await browser.close();
        */
      } else {
        log('✗ Smoke test failed. Fix issues before continuing.', 'red');
      }
    } else {
      log('✗ TypeScript check failed. Fix type errors first.', 'red');
    }
  } catch (error) {
    log(`Error during checks: ${error.message}`, 'red');
  } finally {
    isRunning = false;
    
    // Run pending check if one was queued
    if (pendingRun) {
      pendingRun = false;
      setTimeout(runAllChecks, 100);
    }
  }
  
  return allPassed;
}

/**
 * Watch for file changes
 */
function watchFiles() {
  log('Watch-dog started. Monitoring for changes...', 'yellow');
  log(`Watching: ${WATCH_PATHS.join(', ')}`, 'yellow');
  
  // Run initial check
  runAllChecks();

  // Set up file watchers
  WATCH_PATHS.forEach(watchPath => {
    const fullPath = path.join(__dirname, '..', watchPath);
    
    if (!fs.existsSync(fullPath)) {
      log(`Warning: Path does not exist: ${watchPath}`, 'yellow');
      return;
    }

    fs.watch(fullPath, { recursive: true }, (eventType, filename) => {
      // Ignore non-source files
      if (!filename || 
          filename.includes('node_modules') || 
          filename.includes('.git') ||
          (!filename.endsWith('.ts') && 
           !filename.endsWith('.tsx') && 
           !filename.endsWith('.js') && 
           !filename.endsWith('.jsx'))) {
        return;
      }

      // Debounce multiple changes
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      debounceTimer = setTimeout(() => {
        log(`File changed: ${filename}`, 'yellow');
        runAllChecks();
      }, DEBOUNCE_MS);
    });
  });

  // Handle exit
  process.on('SIGINT', () => {
    log('\nWatch-dog stopped.', 'yellow');
    process.exit(0);
  });
}

// Integration with guard hooks
if (process.argv.includes('--once')) {
  // Run once mode for integration with pre-push hooks
  runAllChecks().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(() => {
    // Exit with 1 for failure on error
    process.exit(1);
  });
} else {
  // Start watching
  watchFiles();
}