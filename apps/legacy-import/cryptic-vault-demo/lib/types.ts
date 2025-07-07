export interface MemoryData {
  id: string;
  content: string;
  position: [number, number, number];
  cluster: string;
  connections: string[];
  metadata: {
    contact: string;
    date: string;
    topics: string[];
    isSecret?: boolean;
    signature?: string;
    originalCategory?: string;
  };
}

export interface LODLevel {
  NEAR: 'NEAR';
  MID: 'MID';
  FAR: 'FAR';
  BRAIN: 'BRAIN';
}

export const LOD_THRESHOLDS = {
  NEAR: 800,
  MID: 2000,
  FAR: 3000,
  BRAIN: 3000,
} as const;

export type LODState = keyof typeof LOD_THRESHOLDS;

export interface ClusterColors {
  [key: string]: string;
}

export const CLUSTER_COLORS: ClusterColors = {
  // Old clusters (kept for compatibility)
  onboarding: '#10B981', // emerald
  product: '#3B82F6', // blue
  engineering: '#8B5CF6', // violet
  design: '#F59E0B', // amber
  meetings: '#EF4444', // red
  planning: '#6366F1', // indigo
  research: '#06B6D4', // cyan
  
  // New Cryptic clusters
  relationships: '#EC4899', // pink
  personal: '#10B981', // emerald 
  career: '#3B82F6', // blue
  health: '#F59E0B', // amber
  spiritual: '#8B5CF6', // violet
  general: '#6B7280', // gray
};
