const CURATED_LIST: Array<[string, ...string[]]> = [
  ['house', 'home', 'building'],
  ['cat', 'kitty', 'kitten', 'feline'],
  ['circle', 'round', 'ring'],
  ['triangle', 'pyramid', 'delta'],
  ['star', 'asterisk'],
  ['face', 'smile', 'smiley', 'head', 'emoji'],
  ['apple'],
  ['balloon'],
  ['bird'],
  ['boat', 'ship'],
  ['book'],
  ['car'],
  ['cup', 'mug'],
  ['fish'],
  ['flower', 'leaf'],
  ['glasses', 'eyeglasses'],
  ['heart'],
  ['moon'],
  ['phone', 'cellphone', 'mobile', 'telephone'],
  ['plane', 'airplane'],
  ['shoe'],
  ['sun'],
  ['tree'],
  ['umbrella'],
];

export const CURATED = new Set<string>(CURATED_LIST.map(([primary]) => primary));

export const ALIASES: Record<string, string> = Object.fromEntries(
  CURATED_LIST.flatMap(([primary, ...aliases]) =>
    aliases.map((alias) => [alias, primary]),
  ),
);

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
