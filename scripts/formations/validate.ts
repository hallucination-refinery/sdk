import fs from 'node:fs';
import path from 'node:path';

const formations = [
  'house',
  'cat',
  'car',
  'tree',
  'cup',
  'phone',
  'boat',
  'bird',
  'fish',
  'balloon',
  'unknown'
];

const dir = path.resolve('public/formations');
let hasError = false;

for (const name of formations) {
  const file = path.join(dir, `${name}.json`);
  const raw = fs.readFileSync(file, 'utf8');
  const data = JSON.parse(raw);
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
