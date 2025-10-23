#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function flatten(input: unknown): number[] {
  const out: number[] = [];
  const walk = (arr: unknown): void => {
    if (Array.isArray(arr)) {
      for (const item of arr) walk(item);
    } else {
      out.push(arr as number);
    }
  };
  walk(input);
  return out;
}

async function main() {
  const dir = path.resolve(__dirname, '../../public/formations');
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json') && f !== 'unknown.json');
  let failed = false;
  for (const file of files) {
    const fp = path.join(dir, file);
    try {
      const raw = fs.readFileSync(fp, 'utf8');
      const data = JSON.parse(raw);
      if (!Array.isArray(data.positions)) throw new Error('missing positions');
      const flat = flatten(data.positions);
      if (flat.length % 3 !== 0) throw new Error(`length ${flat.length} not multiple of 3`);
      for (const n of flat) {
        if (typeof n !== 'number' || !Number.isFinite(n)) throw new Error('non-number value');
        if (n < -1 || n > 1) throw new Error('value out of range [-1,1]');
      }
      console.log(`${file}: OK (${flat.length / 3} points)`);
    } catch (err) {
      failed = true;
      console.error(`${file}: ${(err as Error).message}`);
    }
  }
  if (failed) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
