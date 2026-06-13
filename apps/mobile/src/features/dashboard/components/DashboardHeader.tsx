import React from 'react';
import {View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Text} from '@/components/ui/Text';
import {DASHBOARD_HEADER_TITLE} from '@/features/dashboard/data/dashboardContent';

export function DashboardHeader() {
  const {styles} = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <Text variant="titleMedium">{DASHBOARD_HEADER_TITLE}</Text>
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
    backgroundColor: theme.colors.background,
  },
}));
