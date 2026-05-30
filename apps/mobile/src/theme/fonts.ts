/**
 * Brand typography — Plus Jakarta Sans static faces per weight.
 *
 * iOS synthesizes faux-bold when fontWeight is applied on top of a single
 * PostScript name. Use resolveBrandFontFamily() and omit fontWeight in styles.
 *
 * Android uses the same PostScript-style names (filename without .ttf).
 */

import {TextStyle} from 'react-native';

import {FontWeightToken} from './typography';

export const brandFontFace = {
  regular: 'PlusJakartaSans-Regular',
  medium: 'PlusJakartaSans-Medium',
  semibold: 'PlusJakartaSans-SemiBold',
  bold: 'PlusJakartaSans-Bold',
} as const;

export type BrandFontFace = keyof typeof brandFontFace;

const weightToFace: Record<FontWeightToken, BrandFontFace> = {
  '400': 'regular',
  '500': 'medium',
  '600': 'semibold',
  '700': 'bold',
};

export function resolveBrandFontFamily(fontWeight: FontWeightToken): string {
  return brandFontFace[weightToFace[fontWeight] ?? 'regular'];
}

/** Apply brand font tokens without triggering iOS faux-bold. */
export function brandFontStyle(
  fontWeight: FontWeightToken,
  fontSize: number,
  lineHeight: number,
): Pick<TextStyle, 'fontFamily' | 'fontSize' | 'lineHeight'> {
  return {
    fontFamily: resolveBrandFontFamily(fontWeight),
    fontSize,
    lineHeight,
  };
}
