/**
 * Motion tokens — durations and animation presets (M3 motion guidelines).
 */

export type Motion = typeof motion;

export const motion = {
  duration: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
  layout: {
    preset: 'easeInEaseOut' as const,
  },
} as const;
