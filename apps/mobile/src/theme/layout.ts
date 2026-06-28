import {spacing} from '@visamesa/design-tokens/spacing';

/**
 * Layout spacing constants for consistent screen structure
 */
export const layout = {
  /** Horizontal padding for screen content */
  screenPaddingX: spacing.md,
  /** Gap between title and content sections */
  titleGap: spacing.sm,
  /** Gap between major content sections */
  sectionGap: spacing.lg,
} as const;

export type Layout = typeof layout;
