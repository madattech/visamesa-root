import React from 'react';
import {Pressable, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Icon} from '@/components/ui/Icon';
import {Surface} from '@/components/ui/Surface';
import {Text} from '@/components/ui/Text';

type DetailLinkRowProps = {
  title: string;
  description?: string;
  variant?: 'default' | 'compact';
  onPress: () => void;
  accessibilityLabel?: string;
};

export function DetailLinkRow({
  title,
  description,
  variant = 'default',
  onPress,
  accessibilityLabel,
}: DetailLinkRowProps) {
  const {styles, theme} = useStyles(stylesheet);

  if (variant === 'compact') {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        android_ripple={{color: theme.colors.primaryContainer}}
        onPress={onPress}
        style={({pressed}) => [styles.compactPressable, pressed && styles.pressed]}>
        <Text variant="labelLarge" color="primary">
          {title}
        </Text>
        <Icon name="chevron-right" size="sm" color="primary" />
      </Pressable>
    );
  }

  return (
    <Surface variant="outlined" style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        android_ripple={{color: theme.colors.primaryContainer}}
        onPress={onPress}
        style={({pressed}) => [styles.pressable, pressed && styles.pressed]}>
        <View style={styles.textBlock}>
          <Text variant="titleMedium">{title}</Text>
          {description ? (
            <Text variant="bodySmall" color="onSurfaceVariant">
              {description}
            </Text>
          ) : null}
        </View>
        <Icon name="chevron-right" size="md" color="onSurfaceVariant" />
      </Pressable>
    </Surface>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    overflow: 'hidden',
  },
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
  textBlock: {
    flex: 1,
    gap: theme.spacing.xs / 2,
  },
}));
