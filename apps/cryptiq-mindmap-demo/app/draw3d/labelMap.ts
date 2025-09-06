export const labels = [
  'frontal lobe',
  'parietal lobe',
  'temporal lobe',
  'occipital lobe',
  'cerebellum',
  'brainstem',
  'hypothalamus',
  'thalamus',
  'hippocampus',
  'amygdala',
  'corpus callosum',
  'pituitary gland',
  'pineal gland',
  'midbrain',
  'pons',
  'medulla oblongata',
  'basal ganglia',
  'broca area',
  'wernicke area',
  'somatosensory cortex',
  'motor cortex',
  'visual cortex',
  'auditory cortex',
  'olfactory bulb',
  'cingulate gyrus',
  'insula',
  'nucleus accumbens',
  'substantia nigra',
  'cerebral cortex',
  'unknown',
] as const;

export type Label = (typeof labels)[number];

export const labelToFormationId: Record<Label, number> = labels.reduce(
  (acc, label, index) => {
    acc[label] = label === 'unknown' ? 0 : index + 1;
    return acc;
  },
  {} as Record<Label, number>
);

export function getFormationId(label: string): number {
  return labelToFormationId[label as Label] ?? labelToFormationId['unknown'];
}
