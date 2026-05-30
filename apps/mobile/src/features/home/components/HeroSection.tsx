import React from 'react';
import {View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Text} from '@/components/ui/Text';
import {
  HERO_SECTION_TITLE,
  HERO_SUBTITLE,
  HERO_TITLE_ACCENT,
  HERO_TITLE_PREFIX,
} from '@/features/home/data/heroContent';

export function HeroSection() {
  const {styles} = useStyles(stylesheet);

  return (
    <View style={styles.wrapper}>
      <View style={styles.band}>
        <Text variant="headlineMedium" style={styles.title}>
          {HERO_TITLE_PREFIX}{' '}
          <Text variant="headlineMedium" color="secondary">
            {HERO_TITLE_ACCENT}
          </Text>
          .
        </Text>
        <Text variant="bodyLarge" color="onSurfaceVariant" style={styles.subtitle}>
          {HERO_SUBTITLE}
        </Text>
      </View>
      <Text variant="titleLarge" style={styles.sectionTitle}>
        {HERO_SECTION_TITLE}
      </Text>
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  wrapper: {
    gap: theme.spacing.md,
  },
  band: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.md,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  sectionTitle: {
    textAlign: 'center',
    paddingHorizontal: theme.spacing.md,
  },
}));
