import React from 'react';
import {Pressable, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Icon} from '@/components/ui/Icon';
import {StatusIndicator} from '@/components/ui/StatusIndicator';
import {Surface} from '@/components/ui/Surface';
import {Text} from '@/components/ui/Text';

type DetailLinkRowProps = {
  title: string;
  description?: string;
  variant?: 'default' | 'compact';
  onPress: () => void;
  accessibilityLabel?: string;
  /** Optional status indicator (before chevron) */
  status?: 'done' | 'notDone';
  disabled?: boolean;
};

export function DetailLinkRow({
  title,
  description,
  variant = 'default',
  onPress,
  accessibilityLabel,
  status,
  disabled = false,
}: DetailLinkRowProps) {
  const {styles, theme} = useStyles(stylesheet);

  if (variant === 'compact') {
    return (
      <Pressable
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        android_ripple={{color: theme.colors.primaryContainer}}
        onPress={onPress}
        style={({pressed}) => [
          styles.compactPressable,
          pressed && styles.pressed,
          disabled && styles.disabled,
        ]}>
        <Text variant="labelLarge" color="primary">
          {title}
        </Text>
        {status ? <StatusIndicator status={status} size="sm" /> : null}
        <Icon name="chevron-right" size="sm" color="primary" />
      </Pressable>
    );
  }

  return (
    <Surface
      variant="elevated"
      elevation={2}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.lg,
        },
      ]}>
      <Pressable
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        android_ripple={{color: theme.colors.primaryContainer}}
        onPress={onPress}
        style={({pressed}) => [
          styles.pressable,
          pressed && styles.pressed,
          disabled && styles.disabled,
        ]}>
        <View style={styles.textBlock}>
          <Text variant="titleMedium">{title}</Text>
          {description ? (
            <Text
              variant="bodySmall"
              color="onSurfaceVariant"
              numberOfLines={1}
              ellipsizeMode="tail">
              {description}
            </Text>
          ) : null}
        </View>
        {status ? <StatusIndicator status={status} size="md" /> : null}
        <Icon name="chevron-right" size="md" color="onSurfaceVariant" />
      </Pressable>
    </Surface>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {},
  pressable: {
    minHeight: theme.sizes.touchTargetMin + theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  compactPressable: {
    minHeight: theme.sizes.touchTargetMin,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
  },
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.6,
  },
  textBlock: {
    flex: 1,
    gap: theme.spacing.xs / 2,
  },
}));
