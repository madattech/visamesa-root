/**
 * Material Design 3 elevation tokens.
 * Android uses elevation; iOS uses shadow properties from theme.colors.shadow.
 */

import {Platform, ViewStyle} from 'react-native';

import {type ColorTokens} from '@visamesa/design-tokens/colors';

export type ElevationLevel = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Scrim opacity for modals and overlays (Material Design 3 standard)
 */
export const SCRIM_OPACITY = 0.32;

const IOS_ELEVATION: Record<
  ElevationLevel,
  Pick<ViewStyle, 'shadowOffset' | 'shadowOpacity' | 'shadowRadius'>
> = {
  0: {shadowOffset: {width: 0, height: 0}, shadowOpacity: 0, shadowRadius: 0},
  1: {shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.12, shadowRadius: 3},
  2: {shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.16, shadowRadius: 6},
  3: {shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.18, shadowRadius: 10},
  4: {shadowOffset: {width: 0, height: 6}, shadowOpacity: 0.2, shadowRadius: 14},
  5: {shadowOffset: {width: 0, height: 8}, shadowOpacity: 0.22, shadowRadius: 18},
};

export function createElevationStyle(
  level: ElevationLevel,
  colors: ColorTokens,
): ViewStyle {
  if (Platform.OS === 'android') {
    return {elevation: level};
  }

  const iosShadow = IOS_ELEVATION[level];

  return {
    shadowColor: colors.shadow,
    ...iosShadow,
  };
}
