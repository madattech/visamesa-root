/**
 * Material Design 3 Color System
 * 
 * Color tokens following MD3 conventions for light and dark themes.
 * Reference: https://m3.material.io/styles/color/the-color-system/tokens
 */

export const lightColors: ColorTokens = {
  // Primary colors - main brand color
  primary: '#1A73E8',
  onPrimary: '#FFFFFF',
  primaryContainer: '#D3E3FD',
  onPrimaryContainer: '#001D35',

  // Secondary colors - accents and less prominent components
  secondary: '#5A5D72',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#DFE1F9',
  onSecondaryContainer: '#171B2C',

  // Tertiary colors - contrasting accent
  tertiary: '#735B0F',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#FFDF9D',
  onTertiaryContainer: '#251A00',

  // Error colors
  error: '#BA1A1A',
  onError: '#FFFFFF',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#410002',

  // Surface colors - backgrounds
  surface: '#FEFBFF',
  onSurface: '#1B1B1F',
  surfaceVariant: '#E1E2EC',
  onSurfaceVariant: '#44464F',

  // Outline colors - borders and dividers
  outline: '#75777F',
  outlineVariant: '#C5C6D0',

  // Background
  background: '#FEFBFF',
  onBackground: '#1B1B1F',

  // Shadow and scrim
  shadow: '#000000',
  scrim: '#000000',
};

export const darkColors: ColorTokens = {
  // Primary colors
  primary: '#A8C7FA',
  onPrimary: '#003258',
  primaryContainer: '#004A77',
  onPrimaryContainer: '#D3E3FD',

  // Secondary colors
  secondary: '#C3C5DD',
  onSecondary: '#2C2F42',
  secondaryContainer: '#434659',
  onSecondaryContainer: '#DFE1F9',

  // Tertiary colors
  tertiary: '#E5C16E',
  onTertiary: '#3E2E00',
  tertiaryContainer: '#584400',
  onTertiaryContainer: '#FFDF9D',

  // Error colors
  error: '#FFB4AB',
  onError: '#690005',
  errorContainer: '#93000A',
  onErrorContainer: '#FFDAD6',

  // Surface colors
  surface: '#1B1B1F',
  onSurface: '#E4E2E6',
  surfaceVariant: '#44464F',
  onSurfaceVariant: '#C5C6D0',

  // Outline colors
  outline: '#8F9099',
  outlineVariant: '#44464F',

  // Background
  background: '#1B1B1F',
  onBackground: '#E4E2E6',

  // Shadow and scrim
  shadow: '#000000',
  scrim: '#000000',
};

export type ColorTokens = {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiary: string;
  onTertiary: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  background: string;
  onBackground: string;
  shadow: string;
  scrim: string;
};
