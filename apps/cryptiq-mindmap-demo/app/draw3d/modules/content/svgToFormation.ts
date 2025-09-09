export interface SvgToFormationOptions {
  points?: number;
  fill?: boolean;
}

interface Point { x: number; y: number; }

function parseNumbers(str: string): number[] {
  return str
    .trim()
    .split(/[\s,]+/)
    .map(Number)
    .filter((n) => !Number.isNaN(n));
}

function samplePolygon(poly: Point[], count: number): Point[] {
  // compute perimeter
  const segLengths: number[] = [];
  let perimeter = 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    segLengths.push(len);
    perimeter += len;
  }
  const step = perimeter / count;
  const result: Point[] = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const len = segLengths[i];
    const n = Math.max(1, Math.round(len / step));
    for (let j = 0; j < n; j++) {
      const t = j / n;
      result.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    }
  }
  return result.slice(0, count);
}

function randomInPolygon(poly: Point[], bbox: { minX: number; maxX: number; minY: number; maxY: number }): Point {
  // rejection sampling
  while (true) {
    const x = bbox.minX + Math.random() * (bbox.maxX - bbox.minX);
    const y = bbox.minY + Math.random() * (bbox.maxY - bbox.minY);
    if (pointInPolygon({ x, y }, poly)) return { x, y };
  }
}

function pointInPolygon(p: Point, poly: Point[]): boolean {
  // ray casting
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x, yi = poly[i].y;
    const xj = poly[j].x, yj = poly[j].y;
    const intersect = yi > p.y !== yj > p.y && p.x < ((xj - xi) * (p.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function poissonFill(poly: Point[], count: number): Point[] {
  const pts: Point[] = [];
  const bbox = poly.reduce(
    (b, p) => ({
      minX: Math.min(b.minX, p.x),
      maxX: Math.max(b.maxX, p.x),
      minY: Math.min(b.minY, p.y),
      maxY: Math.max(b.maxY, p.y),
    }),
    { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity },
  );
  const minDist = Math.sqrt((bbox.maxX - bbox.minX) * (bbox.maxY - bbox.minY)) / Math.sqrt(count);
  while (pts.length < count) {
    const p = randomInPolygon(poly, bbox);
    let ok = true;
    for (const q of pts) {
      if (Math.hypot(p.x - q.x, p.y - q.y) < minDist) {
        ok = false;
        break;
      }
    }
    if (ok) pts.push(p);
  }
  return pts;
}

export function svgToFormation(svg: string, opts: SvgToFormationOptions = {}): { positions: Float32Array } {
  const target = opts.points ?? 256;
  const polygonMatch = svg.match(/<polygon[^>]*points="([^"]+)"/i);
  const rectMatch = svg.match(/<rect[^>]*x="([^"]+)"[^>]*y="([^"]+)"[^>]*width="([^"]+)"[^>]*height="([^"]+)"/i);
  const circleMatch = svg.match(/<circle[^>]*cx="([^"]+)"[^>]*cy="([^"]+)"[^>]*r="([^"]+)"/i);
  let points: Point[] = [];
  if (polygonMatch) {
    const nums = parseNumbers(polygonMatch[1]);
    for (let i = 0; i < nums.length; i += 2) points.push({ x: nums[i], y: nums[i + 1] });
  } else if (rectMatch) {
    const x = parseFloat(rectMatch[1]);
    const y = parseFloat(rectMatch[2]);
    const w = parseFloat(rectMatch[3]);
    const h = parseFloat(rectMatch[4]);
    points = [
      { x, y },
      { x: x + w, y },
      { x: x + w, y: y + h },
      { x, y: y + h },
    ];
  } else if (circleMatch) {
    const cx = parseFloat(circleMatch[1]);
    const cy = parseFloat(circleMatch[2]);
    const r = parseFloat(circleMatch[3]);
    for (let i = 0; i < target; i++) {
      const a = (i / target) * Math.PI * 2;
      points.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
    }
  } else {
    throw new Error('Unsupported SVG format');
  }

  if (circleMatch) {
    // already has target points
  } else {
    points = samplePolygon(points, target);
  }

  if (opts.fill) {
    const interior = poissonFill(points, Math.floor(target / 2));
    points = points.concat(interior);
  }

  // Thin Z slab and normalization
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const scale = 2 / Math.max(maxX - minX, maxY - minY);
  const arr = new Float32Array(points.length * 3);
  points.forEach((p, i) => {
    arr[i * 3] = (p.x - centerX) * scale;
    arr[i * 3 + 1] = (p.y - centerY) * scale;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 0.02 * scale;
  });
  return { positions: arr };
}
