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

export function normalizeLabel(
  raw: string,
  topK: Array<{ label: string; confidence: number }> = [],
): string {
  const normalize = (label: string): string => {
    const lc = label.toLowerCase();
    return ALIASES[lc] ?? lc;
  };

  const primary = normalize(raw);
  if (CURATED.has(primary)) return primary;

  for (const { label } of topK) {
    const mapped = normalize(label);
    if (CURATED.has(mapped)) return mapped;
  }

  return 'unknown';
}
