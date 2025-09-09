#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { svgToFormation } from '../../app/draw3d/modules/content/svgToFormation';

interface Args {
  inDir: string;
  outDir: string;
  points: number;
  fill: boolean;
}

function parseArgs(): Args {
  const args: Args = { inDir: '', outDir: '', points: 256, fill: false };
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--in') args.inDir = argv[++i];
    else if (a === '--out') args.outDir = argv[++i];
    else if (a === '--points') args.points = parseInt(argv[++i], 10);
    else if (a === '--fill') args.fill = true;
  }
  if (!args.inDir || !args.outDir) {
    console.error('usage: node svgToFormation.ts --in <dir> --out <dir> [--points N] [--fill]');
    process.exit(1);
  }
  return args;
}

async function main() {
  const { inDir, outDir, points, fill } = parseArgs();
  const inPath = path.resolve(inDir);
  const outPath = path.resolve(outDir);
  fs.mkdirSync(outPath, { recursive: true });
  const files = fs.readdirSync(inPath).filter((f) => f.endsWith('.svg'));
  for (const file of files) {
    const raw = fs.readFileSync(path.join(inPath, file), 'utf8');
    const { positions } = svgToFormation(raw, { points, fill });
    const rounded = Array.from(positions, (n) => +n.toFixed(5));
    const json = JSON.stringify({ positions: rounded });
    fs.writeFileSync(path.join(outPath, file.replace(/\.svg$/, '.json')), json);
    console.log(`wrote ${file.replace(/\.svg$/, '.json')}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
