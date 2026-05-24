import React from 'react';
import {View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Text} from '@/components/ui/Text';
import {TieStepDetail} from '@/features/home/types/TieStepDetail';

type StepOverviewProps = {
  step: TieStepDetail;
};

export function StepOverview({step}: StepOverviewProps) {
  const {styles} = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>
        {step.title}
      </Text>
      <Text variant="bodyLarge" color="onSurfaceVariant" style={styles.description}>
        {step.short}
      </Text>
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    width: '100%',
    maxWidth: 480,
    minHeight: 130,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  title: {
    textAlign: 'center',
    fontWeight: '600',
  },
  description: {
    textAlign: 'center',
  },
}));
