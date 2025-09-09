import fs from 'node:fs';
import path from 'node:path';
import { CURATED } from '../../apps/cryptiq-mindmap-demo/app/draw3d/modules/data/labelMap';

const dir = path.resolve('public/formations');
let hasError = false;

for (const name of CURATED) {
  const filePath = path.join(dir, `${name}.json`);
  const raw = fs.readFileSync(filePath, 'utf8');
  if (Buffer.byteLength(raw, 'utf8') > 10 * 1024) {
    console.error(`${name}.json: file exceeds 10KB`);
    hasError = true;
  }
  let data: any;
  try {
    data = JSON.parse(raw);
  } catch {
    console.error(`${name}.json: invalid JSON`);
    hasError = true;
    continue;
  }
  const positions = data.positions;
  if (!Array.isArray(positions)) {
    console.error(`${name}: positions is not an array`);
    hasError = true;
    continue;
  }
  if (positions.length % 3 !== 0) {
    console.error(`${name}: positions length ${positions.length} not divisible by 3`);
    hasError = true;
  }
  for (const n of positions) {
    if (typeof n !== 'number' || n < -1 || n > 1) {
      console.error(`${name}: value ${n} out of bounds`);
      hasError = true;
      break;
    }
  }
}

if (hasError) {
  process.exit(1);
}
