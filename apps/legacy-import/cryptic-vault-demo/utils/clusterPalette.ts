/**
 * Centralized color palette for cluster categories
 * Ensures consistency across all components
 */

// Map cluster IDs to colors - single source of truth
export const CLUSTER_COLORS: Record<string, string> = {
  cluster_bridge: '#AA96DA', // Catalysts - Purple
  cluster_value: '#4ECDC4', // Values - Teal
  cluster_emotion: '#FF6B6B', // Emotions - Red
  cluster_trait: '#FFE66D', // Traits - Yellow
  cluster_growth: '#95E1D3', // Goals - Mint
  cluster_coping: '#F38181', // Copes - Coral
  cluster_challenge: '#FCBAD3', // Outcomes - Pink
  default: '#C7CEEA', // Default - Lavender
};

// Category mappings for UI display
export const CATEGORY_MAPPINGS = [
  {
    label: 'Catalysts',
    clusterId: 'cluster_bridge',
    color: CLUSTER_COLORS.cluster_bridge,
  },
  {
    label: 'Values',
    clusterId: 'cluster_value',
    color: CLUSTER_COLORS.cluster_value,
  },
  {
    label: 'Emotions',
    clusterId: 'cluster_emotion',
    color: CLUSTER_COLORS.cluster_emotion,
  },
  {
    label: 'Traits',
    clusterId: 'cluster_trait',
    color: CLUSTER_COLORS.cluster_trait,
  },
  {
    label: 'Goals',
    clusterId: 'cluster_growth',
    color: CLUSTER_COLORS.cluster_growth,
  },
  {
    label: 'Copes',
    clusterId: 'cluster_coping',
    color: CLUSTER_COLORS.cluster_coping,
  },
  {
    label: 'Outcomes',
    clusterId: 'cluster_challenge',
    color: CLUSTER_COLORS.cluster_challenge,
  },
] as const;

/**
 * Get color for a cluster ID
 */
export function getClusterColor(clusterId: string): string {
  return CLUSTER_COLORS[clusterId] || CLUSTER_COLORS.default;
}

/**
 * Get all cluster IDs
 */
export function getAllClusterIds(): string[] {
  return CATEGORY_MAPPINGS.map((cat) => cat.clusterId);
}

// Special colors for highlighting
export const HIGHLIGHT_COLORS = {
  upstream: '#FFA500', // Orange for upstream nodes
  downstream: '#00FF00', // Green for downstream nodes
  selected: '#FFFF00', // Yellow for selected node
} as const;

// Link colors
export const LINK_COLORS = {
  default: '#ffffff',
  highlighted: '#00BFFF', // DeepSkyBlue
  upstream: '#FF8C00', // DarkOrange
  downstream: '#ADFF2F', // GreenYellow
  positive: '#2E8B57', // SeaGreen
  negative: '#DC143C', // Crimson
};

// Opacity values
export const OPACITY_VALUES = {
  full: 1.0,
  dimmed: 0.25,
  linkDimmed: 0.5,
  linkDefault: 1,
};

export const NODE_TYPE_COLORS: Record<string, string> = {
  catalyst: '#FFD700', // Gold
  value: '#DA70D6', // Orchid
  emotion: '#FF69B4', // HotPink
  trait: '#87CEEB', // SkyBlue
  goal: '#32CD32', // LimeGreen
  outcome: '#FFA07A', // LightSalmon
  default: '#000000', // White
};
