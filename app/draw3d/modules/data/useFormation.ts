import { promises as fs } from 'node:fs';

const formationCache = new Map<string, Float32Array>();

function fallbackFormation(count = 8): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    arr[i * 3] = Math.cos(angle);
    arr[i * 3 + 1] = Math.sin(angle);
    arr[i * 3 + 2] = 0;
  }
  return arr;
}

async function fetchFormation(name: string): Promise<Float32Array> {
  const url = `/formations/${name}.json`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const data = Array.isArray(json) ? json : json.positions;
    return new Float32Array(data);
  } catch {
    try {
      // Node fallback: read from disk when running outside browser
      const file = await fs.readFile(`apps/cryptiq-mindmap-demo/public${url}`, 'utf8');
      const json = JSON.parse(file);
      const data = Array.isArray(json) ? json : json.positions;
      return new Float32Array(data);
    } catch {
      return fallbackFormation();
    }
  }
}

export async function useFormation(name: string): Promise<Float32Array> {
  if (formationCache.has(name)) return formationCache.get(name)!;
  const arr = await fetchFormation(name);
  formationCache.set(name, arr);
  return arr;
}
