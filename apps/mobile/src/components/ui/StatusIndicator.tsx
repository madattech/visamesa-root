import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';

import {Icon} from '@/components/ui/Icon';

export type StatusIndicatorProps = {
  status: 'done' | 'notDone';
  size?: 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
};

/**
 * Read-only status indicator showing completion state.
 * - done: green check circle
 * - notDone: secondary error-outline icon
 */
export function StatusIndicator({
  status,
  size = 'md',
  style,
}: StatusIndicatorProps) {
  if (status === 'done') {
    return <Icon name="check-circle" size={size} color="success" style={style} />;
  }

  return <Icon name="error-outline" size={size} color="secondary" style={style} />;
}
