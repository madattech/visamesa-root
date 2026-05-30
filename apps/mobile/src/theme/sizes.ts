/**
 * Shared dimension tokens for icons, touch targets, and layout constants.
 */

export type Sizes = typeof sizes;

export const sizes = {
  touchTargetMin: 44,
  icon: {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    hero: 48,
  },
  stepper: {
    itemWidth: 72,
  },
  contentMaxWidth: 480,
} as const;
