/**
 * VisaMesa brand colors mapped to Material Design 3 token structure.
 * Light palette aligned with visamesa_fe (navy primary, orange secondary).
 */

export const lightColors: ColorTokens = {
  primary: '#00215E',
  onPrimary: '#FFFFFF',
  primaryContainer: '#D6E3FF',
  onPrimaryContainer: '#001B3F',

  secondary: '#FC4101',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#FFDBCE',
  onSecondaryContainer: '#3A0B00',

  tertiary: '#735B0F',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#FFDF9D',
  onTertiaryContainer: '#251A00',

  error: '#BA1A1A',
  onError: '#FFFFFF',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#410002',

  surface: '#FEFBFF',
  onSurface: '#1B1B1F',
  surfaceVariant: '#E1E2EC',
  onSurfaceVariant: '#44464F',

  outline: '#75777F',
  outlineVariant: '#C5C6D0',

  background: '#FAFAFA',
  onBackground: '#1B1B1F',

  shadow: '#000000',
  scrim: '#000000',
};

export const darkColors: ColorTokens = {
  primary: '#A8C7FA',
  onPrimary: '#002F65',
  primaryContainer: '#00458F',
  onPrimaryContainer: '#D6E3FF',

  secondary: '#FFB59D',
  onSecondary: '#5C1900',
  secondaryContainer: '#832600',
  onSecondaryContainer: '#FFDBCE',

  tertiary: '#E5C16E',
  onTertiary: '#3E2E00',
  tertiaryContainer: '#584400',
  onTertiaryContainer: '#FFDF9D',

  error: '#FFB4AB',
  onError: '#690005',
  errorContainer: '#93000A',
  onErrorContainer: '#FFDAD6',

  surface: '#1B1B1F',
  onSurface: '#E4E2E6',
  surfaceVariant: '#44464F',
  onSurfaceVariant: '#C5C6D0',

  outline: '#8F9099',
  outlineVariant: '#44464F',

  background: '#1B1B1F',
  onBackground: '#E4E2E6',

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
