#!/usr/bin/env node
/* eslint-env node */
/* global document, window */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { setTimeout as delay } from 'node:timers/promises';
import { spawn } from 'node:child_process';
import http from 'node:http';
import puppeteer from 'puppeteer';

const DEFAULT_BASE_URL = 'http://localhost:3000';
const DEFAULT_PATH = '/quiz/archetype-v1';
const DEFAULT_WAIT_MS = 20000;

function parseArgs(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) continue;
    const [rawKey, rawValue] = arg.includes('=') ? arg.slice(2).split(/=(.*)/, 2) : [arg.slice(2), undefined];
    const key = rawKey.replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
    if (rawValue !== undefined) {
      options[key] = rawValue;
      continue;
    }
    const next = argv[i + 1];
    if (next && !next.startsWith('--')) {
      options[key] = next;
      i += 1;
    } else {
      options[key] = true;
    }
  }
  return options;
}

function getDateTag() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function buildUrl(baseUrl, pathname, urlParams, explicitUrl) {
  if (explicitUrl) {
    if (urlParams) {
      const glue = explicitUrl.includes('?') ? '&' : '?';
      return `${explicitUrl}${glue}${urlParams.replace(/^\?/, '')}`;
    }
    return explicitUrl;
  }
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const base = `${normalizedBase}${normalizedPath}`;
  if (!urlParams) return base;
  const glue = base.includes('?') ? '&' : '?';
  return `${base}${glue}${urlParams.replace(/^\?/, '')}`;
}

function toJsonl(entries) {
  return entries.map((entry) => JSON.stringify(entry)).join('\n');
}

function hasNonZeroByKey(input, keyword) {
  if (!input || typeof input !== 'object') return false;
  if (Array.isArray(input)) {
    return input.some((item) => hasNonZeroByKey(item, keyword));
  }
  return Object.entries(input).some(([key, value]) => {
    if (key.toLowerCase().includes(keyword)) {
      if (typeof value === 'number') return value > 0;
      if (typeof value === 'object' && value !== null) return hasNonZeroByKey(value, keyword);
    }
    if (typeof value === 'object' && value !== null) {
      return hasNonZeroByKey(value, keyword);
    }
    return false;
  });
}

function findValueByKey(input, key) {
  if (!input || typeof input !== 'object') return undefined;
  if (Array.isArray(input)) {
    for (const item of input) {
      const result = findValueByKey(item, key);
      if (result !== undefined) return result;
    }
    return undefined;
  }
  for (const [k, value] of Object.entries(input)) {
    if (k === key) return value;
    if (value && typeof value === 'object') {
      const result = findValueByKey(value, key);
      if (result !== undefined) return result;
    }
  }
  return undefined;
}

async function gotoWithRetry(page, url, attempts = 4, delayMs = 3000) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
      return;
    } catch (error) {
      lastError = error;
      await delay(delayMs);
    }
  }
  throw lastError ?? new Error(`Failed to navigate to ${url}`);
}

function relativize(targetPath, baseDir) {
  return path.relative(baseDir, targetPath) || path.basename(targetPath);
}

function sanitizeMode(mode) {
  return mode === 'visibility' ? 'visibility' : mode === 'telemetry' ? 'telemetry' : 'generic';
}

async function waitForServerReady(url, timeoutMs = 60000, intervalMs = 500) {
  const start = Date.now();
  // Prefer base root for liveness
  const target = url.endsWith('/') ? url : `${url}/`;
  let lastErr;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const ok = await new Promise((resolve) => {
        const req = http.get(target, (res) => {
          resolve(res.statusCode >= 200 && res.statusCode < 500);
        });
        req.on('error', () => resolve(false));
        req.setTimeout(3000, () => {
          try { req.destroy(); } catch {}
          resolve(false);
        });
      });
      if (ok) return Date.now() - start;
    } catch (err) {
      lastErr = err;
    }
    if (Date.now() - start > timeoutMs) {
      const reason = lastErr instanceof Error ? `${lastErr.message}` : 'timeout';
      throw new Error(`Dev server not ready at ${target} within ${timeoutMs}ms (${reason})`);
    }
    await delay(intervalMs);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const cwd = process.cwd();
  const outDir = args.out ? path.resolve(cwd, args.out) : path.resolve(cwd, 'docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs');
  const mode = sanitizeMode(args.mode ?? 'telemetry');
  const baseUrl = args.baseUrl ?? DEFAULT_BASE_URL;
  const routePath = args.path ?? DEFAULT_PATH;
  const url = buildUrl(baseUrl, routePath, args.urlParams, args.url);
  const waitMs = Number.parseInt(args.waitMs ?? DEFAULT_WAIT_MS, 10);
  const dateTag = getDateTag();
  const docsRoot = outDir;
  const assetsDir = path.join(docsRoot, 'assets');
  const assetSlug = mode === 'telemetry' ? 'telemetry' : mode;
  const screenshotPath = path.join(assetsDir, `${dateTag}-${assetSlug}-capture.png`);
  const consolePath = path.join(assetsDir, `${dateTag}-${assetSlug}-console.jsonl`);

  await ensureDir(assetsDir);

  const summary = {
    status: 'ok',
    mode,
    dateTag,
    url,
    waitMs,
    outputs: {},
    gates: {
      promotionObserved: false,
      aSimUv89441: false,
      buffersNonZero: false,
      samplesNonZero: false,
    },
    notes: [],
  };

  const consoleEntries = [];
  const vertexEntries = [];
  let captureResult;
  let captureError;
  let devProc;

  // Start dev server if requested (default true)
  const autoDev = args.autoDev !== 'false' && args.autoDev !== false;
  if (autoDev) {
    devProc = spawn('pnpm', ['--filter', 'cryptiq-mindmap-demo', 'dev'], {
      cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env },
    });
    // Wait for server ready on base URL
    try {
      await waitForServerReady(baseUrl, 60000, 500);
    } catch (err) {
      try { devProc.kill('SIGTERM'); } catch {}
      throw err;
    }
  }

  const browser = await puppeteer.launch({
    headless: 'shell',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  });

  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(60000);
    page.on('console', (msg) => {
      const entry = {
        timestamp: new Date().toISOString(),
        type: msg.type(),
        text: msg.text(),
      };
      const location = msg.location();
      if (location && location.url) {
        entry.location = location;
      }
      if (entry.text.includes('\n')) {
        entry.lines = entry.text.split('\n');
      }
      entry.isVertex = entry.text.includes('[vertex]');
      consoleEntries.push(entry);
      if (entry.isVertex) {
        vertexEntries.push(entry);
      }
      if (!summary.gates.promotionObserved && entry.isVertex && entry.text.includes('telemetry-promote')) {
        summary.gates.promotionObserved = true;
      }
      if (!summary.gates.aSimUv89441 && entry.text.includes('aSimUv') && entry.text.includes('89441')) {
        summary.gates.aSimUv89441 = true;
      }
      if (!summary.gates.buffersNonZero && entry.text.toLowerCase().includes('buffers')) {
        summary.gates.buffersNonZero = /\b(?!0\b)\d+/.test(entry.text);
      }
      if (!summary.gates.samplesNonZero && entry.text.toLowerCase().includes('samples')) {
        summary.gates.samplesNonZero = /\b(?!0\b)\d+/.test(entry.text);
      }
    });

    await gotoWithRetry(page, url);
    await page.waitForFunction(() => document.readyState === 'complete', { timeout: 60000 }).catch(() => {});
    if (waitMs > 0) {
      await page.waitForTimeout(waitMs);
    }

    const hasCapture = await page.evaluate(() => {
      return typeof window.vertexTelemetry?.capture === 'function';
    });

    if (hasCapture) {
      try {
        captureResult = await page.evaluate(async () => {
          const result = await window.vertexTelemetry.capture();
          return result;
        });
      } catch (error) {
        captureError = error instanceof Error ? { message: error.message, stack: error.stack } : { message: String(error) };
      }
    } else {
      summary.notes.push('vertexTelemetry.capture not available');
    }

    if (captureResult) {
      if (!summary.gates.promotionObserved) {
        const promote = findValueByKey(captureResult, 'telemetryPromote');
        if (promote) {
          summary.gates.promotionObserved = true;
        }
      }
      if (!summary.gates.aSimUv89441) {
        const val = findValueByKey(captureResult, 'aSimUv');
        if (Number(val) === 89441) {
          summary.gates.aSimUv89441 = true;
        }
      }
      if (!summary.gates.buffersNonZero && hasNonZeroByKey(captureResult, 'buffer')) {
        summary.gates.buffersNonZero = true;
      }
      if (!summary.gates.samplesNonZero && hasNonZeroByKey(captureResult, 'sample')) {
        summary.gates.samplesNonZero = true;
      }
    }

    await page.screenshot({ path: screenshotPath, fullPage: true });
    summary.outputs.screenshot = relativize(screenshotPath, cwd);

    if (consoleEntries.length > 0) {
      const jsonlContent = `${toJsonl(consoleEntries)}\n`;
      await fs.writeFile(consolePath, jsonlContent, 'utf8');
      summary.outputs.consoleLog = relativize(consolePath, cwd);
    }

    if (vertexEntries.length > 0) {
      const vertexLogPath = path.join(docsRoot, `${dateTag}-vertex.log`);
      const vertexContent = vertexEntries.map((entry) => `[${entry.timestamp}] ${entry.text}`).join('\n');
      await fs.writeFile(vertexLogPath, `${vertexContent}\n`, 'utf8');
      summary.outputs.vertexLog = relativize(vertexLogPath, cwd);
    }

    summary.capture = {
      available: Boolean(hasCapture),
      error: captureError ?? null,
      keys: captureResult ? Object.keys(captureResult) : [],
    };

    if (captureResult && typeof captureResult === 'object') {
      const simSummary = findValueByKey(captureResult, 'simMetrics');
      if (simSummary) {
        summary.capture.simMetrics = simSummary;
      }
    }
  } catch (error) {
    summary.status = 'error';
    summary.error = error instanceof Error ? { message: error.message, stack: error.stack } : { message: String(error) };
  } finally {
    await browser.close().catch(() => {});
    if (devProc) {
      try {
        devProc.kill('SIGTERM');
      } catch { /* noop */ }
    }
  }

  const cwdRelative = relativize(outDir, cwd);
  summary.outputs.docsRoot = cwdRelative || '.';
  summary.timestamp = new Date().toISOString();

  if (summary.status !== 'ok') {
    summary.notes.push('Harness encountered an error. Inspect error payload.');
  }

  process.stdout.write(`${JSON.stringify(summary)}\n`);
}

main().catch((error) => {
  const fallback = {
    status: 'error',
    timestamp: new Date().toISOString(),
    error: error instanceof Error ? { message: error.message, stack: error.stack } : { message: String(error) },
  };
  process.stdout.write(`${JSON.stringify(fallback)}\n`);
});
