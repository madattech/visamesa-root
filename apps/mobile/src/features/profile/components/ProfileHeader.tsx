import React from 'react';
import {View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Text} from '@/components/ui/Text';

export function ProfileHeader() {
  const {styles} = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        Your Profile
      </Text>
      <Text variant="bodyMedium" color="onSurfaceVariant" style={styles.subtitle}>
        Complete your profile to speed up form filling across the platform
      </Text>
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingTop: theme.spacing.md,
  },
  title: {
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
}));
