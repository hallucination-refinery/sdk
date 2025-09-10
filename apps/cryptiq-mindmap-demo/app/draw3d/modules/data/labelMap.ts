export const ALIASES: Record<string, string> = {
  ship: 'boat',
  cellphone: 'phone',
  mobile: 'phone',
  telephone: 'phone',
  mug: 'cup',
  leaf: 'flower',
  airplane: 'plane',
  eyeglasses: 'glasses',
};

export const CURATED = new Set<string>([
  'apple',
  'balloon',
  'bird',
  'boat',
  'book',
  'car',
  'cat',
  'cup',
  'fish',
  'flower',
  'glasses',
  'heart',
  'house',
  'moon',
  'phone',
  'plane',
  'shoe',
  'star',
  'sun',
  'tree',
  'umbrella',
]);

const TRACE =
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).has('trace');

export function normalizeLabel(
  raw: string,
  topK: Array<{ label: string; confidence: number }> = [],
): string {
  const normalize = (label: string): string => {
    const lc = label.toLowerCase();
    return ALIASES[lc] ?? lc;
  };

  const primary = normalize(raw);
  let chosen = 'unknown';

  if (CURATED.has(primary)) {
    chosen = primary;
  } else {
    for (const { label } of topK.slice(0, 5)) {
      const mapped = normalize(label);
      if (CURATED.has(mapped)) {
        chosen = mapped;
        break;
      }
    }
  }

  if (TRACE) console.debug('[labelMap]', { topK, chosen });
  return chosen;
}
