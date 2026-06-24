/**
 * Theme Configuration for React Native Unistyles v2
 *
 * Exports theme tokens (colors, spacing, typography) and Unistyles configuration.
 */

import {
  lightColors,
  darkColors,
  type ColorTokens,
} from '@visamesa/design-tokens/colors';
import { radii } from '@visamesa/design-tokens/radii';
import { sizes } from '@visamesa/design-tokens/sizes';
import { spacing } from '@visamesa/design-tokens/spacing';
import { typography } from '@visamesa/design-tokens/typography';

import { motion } from './motion';

export type AppTheme = {
  colors: ColorTokens;
  spacing: typeof spacing;
  typography: typeof typography;
  radii: typeof radii;
  sizes: typeof sizes;
  motion: typeof motion;
};

export const lightTheme: AppTheme = {
  colors: lightColors,
  spacing,
  typography,
  radii,
  sizes,
  motion,
};

export const darkTheme: AppTheme = {
  colors: darkColors,
  spacing,
  typography,
  radii,
  sizes,
  motion,
};

declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    light: AppTheme;
    dark: AppTheme;
  }
}

export {lightColors, darkColors, spacing, typography, radii, sizes, motion};
export * from '@visamesa/design-tokens/colors';
export * from './elevation';
export * from './fonts';
export * from './motion';
