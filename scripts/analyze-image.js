#!/usr/bin/env node
/* eslint-env node */
import process from 'node:process';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import sharp from 'sharp';

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

function toNumber(value, fallback) {
  const num = Number.parseFloat(value);
  return Number.isFinite(num) ? num : fallback;
}

function summarize(data, info, threshold) {
  const { width, height, channels } = info;
  const pixelCount = width * height;
  let nonBlack = 0;
  let sum = 0;
  let sumSquares = 0;
  let maxLuminance = 0;

  for (let index = 0; index < pixelCount; index += 1) {
    const base = index * channels;
    const r = data[base] ?? 0;
    const g = data[base + 1] ?? 0;
    const b = data[base + 2] ?? 0;
    const a = channels > 3 ? data[base + 3] ?? 255 : 255;
    const alpha = a / 255;
    const luminance = ((0.2126 * r) + (0.7152 * g) + (0.0722 * b)) / 255;
    const effectiveLum = luminance * alpha;
    if (effectiveLum > threshold) {
      nonBlack += 1;
    }
    sum += effectiveLum;
    sumSquares += effectiveLum * effectiveLum;
    if (effectiveLum > maxLuminance) {
      maxLuminance = effectiveLum;
    }
  }

  const mean = sum / pixelCount;
  const variance = Math.max(sumSquares / pixelCount - mean * mean, 0);
  const stddev = Math.sqrt(variance);

  return {
    width,
    height,
    channels,
    pixelCount,
    nonBlackPixels: nonBlack,
    nonBlackPercent: pixelCount > 0 ? (nonBlack / pixelCount) * 100 : 0,
    averageLuminance: mean,
    luminanceStddev: stddev,
    maxLuminance,
    threshold,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = args.input ?? args.file ?? args.image;
  if (!inputPath) {
    process.stderr.write('Usage: node scripts/analyze-image.js --input <imagePath> [--out <jsonPath>] [--nonBlackThreshold <0-1>]\n');
    process.exitCode = 1;
    return;
  }
  const resolvedInput = path.resolve(process.cwd(), inputPath);
  const threshold = Math.min(Math.max(toNumber(args.nonBlackThreshold, 0.01), 0), 1);

  try {
    const { data, info } = await sharp(resolvedInput).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const summary = summarize(data, info, threshold);
    summary.source = path.relative(process.cwd(), resolvedInput) || path.basename(resolvedInput);
    const output = JSON.stringify(summary);
    if (args.out) {
      const outPath = path.resolve(process.cwd(), args.out);
      await fs.mkdir(path.dirname(outPath), { recursive: true });
      await fs.writeFile(outPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
      process.stdout.write(`${output}\n`);
    } else {
      process.stdout.write(`${output}\n`);
    }
  } catch (error) {
    const payload = error instanceof Error ? { message: error.message, stack: error.stack } : { message: String(error) };
    process.stdout.write(`${JSON.stringify({ status: 'error', error: payload })}\n`);
    process.exitCode = 1;
  }
}

main();
