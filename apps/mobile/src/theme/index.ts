/**
 * Theme Configuration for React Native Unistyles v2
 * 
 * Exports theme tokens (colors, spacing, typography) and Unistyles configuration.
 */

import {lightColors, darkColors} from './colors';
import {spacing} from './spacing';
import {typography} from './typography';

// Define themes
export const lightTheme = {
  colors: lightColors,
  spacing,
  typography,
} as const;

export const darkTheme = {
  colors: darkColors,
  spacing,
  typography,
} as const;

// Theme type for TypeScript
export type AppTheme = typeof lightTheme;

// Declare Unistyles types for v2
declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    light: AppTheme;
    dark: AppTheme;
  }
}

// Export individual tokens for direct use if needed
export {lightColors, darkColors, spacing, typography};
export * from './colors';
export * from './spacing';
export * from './typography';
