import React from 'react'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslation } from 'react-i18next'

import { Text } from '@/components/ui/Text'

export function HeroSection() {
  const {styles} = useStyles(stylesheet);
  const {t} = useTranslation('marketing');

  return (
    <View style={styles.wrapper}>
      <View style={styles.band}>
        <Text variant="headlineMedium" style={styles.title}>
          {t('hero.titlePrefix')}{' '}
          <Text variant="headlineMedium" color="secondary">
            {t('hero.titleAccent')}
          </Text>
          .
        </Text>
        <Text
          variant="bodyLarge"
          color="onSurfaceVariant"
          style={styles.subtitle}>
          {t('hero.subtitle')}
        </Text>
      </View>
      <Text variant="titleLarge" style={styles.sectionTitle}>
        {t('process.sectionTitle')}
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
