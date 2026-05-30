/**
 * Theme Configuration for React Native Unistyles v2
 *
 * Exports theme tokens (colors, spacing, typography) and Unistyles configuration.
 */

import {lightColors, darkColors} from './colors';
import {motion} from './motion';
import {radii} from './radii';
import {sizes} from './sizes';
import {spacing} from './spacing';
import {typography} from './typography';

export const lightTheme = {
  colors: lightColors,
  spacing,
  typography,
  radii,
  sizes,
  motion,
} as const;

export const darkTheme = {
  colors: darkColors,
  spacing,
  typography,
  radii,
  sizes,
  motion,
} as const;

export type AppTheme = typeof lightTheme;

declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    light: AppTheme;
    dark: AppTheme;
  }
}

export {lightColors, darkColors, spacing, typography, radii, sizes, motion};
export * from './colors';
export * from './elevation';
export * from './fonts';
export * from './motion';
export * from './radii';
export * from './sizes';
export * from './spacing';
export * from './typography';
