import React from 'react';
import {Pressable, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Icon} from '@/components/ui/Icon';
import {Surface} from '@/components/ui/Surface';
import {Text} from '@/components/ui/Text';
import {ProfileSectionConfig} from '@/features/profile/data/profileSections';

type ProfileSectionRowProps = {
  section: ProfileSectionConfig;
  onPress: () => void;
};

export function ProfileSectionRow({section, onPress}: ProfileSectionRowProps) {
  const {styles, theme} = useStyles(stylesheet);

  return (
    <Surface variant="outlined" style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={section.title}
        android_ripple={{color: theme.colors.primaryContainer}}
        onPress={onPress}
        style={({pressed}) => [styles.pressable, pressed && styles.pressed]}>
        <View style={styles.textBlock}>
          <Text variant="titleMedium">{section.title}</Text>
          <Text variant="bodySmall" color="onSurfaceVariant">
            {section.description}
          </Text>
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
  pressed: {
    backgroundColor: theme.colors.surfaceContainer,
  },
  textBlock: {
    flex: 1,
    gap: theme.spacing.xs / 2,
  },
}));
