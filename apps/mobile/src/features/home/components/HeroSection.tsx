import React from 'react';
import {View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Text} from '@/components/ui/Text';

export function HeroSection() {
  const {styles} = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Paperwork,{' '}
        <Text variant="headlineMedium" color="secondary">
          all in one
        </Text>
        .
      </Text>
      <Text variant="bodyLarge" color="onSurfaceVariant" style={styles.subtitle}>
        Manage your TIE, forms, and appointments
      </Text>
      <Text variant="titleLarge" style={styles.sectionTitle}>
        Your TIE Process, Step by Step
      </Text>
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  title: {
    textAlign: 'center',
    fontWeight: '700',
  },
  subtitle: {
    textAlign: 'center',
  },
  sectionTitle: {
    textAlign: 'center',
    fontWeight: '600',
  },
}));
