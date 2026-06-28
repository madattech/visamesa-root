import React from 'react'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Text } from '@/components/ui/Text'
import { TieStepDetail } from '@/features/home/types/TieStepDetail'

type StepOverviewProps = {
  step: TieStepDetail;
};

export function StepOverview({step}: StepOverviewProps) {
  const {styles} = useStyles(stylesheet);

  return (
    <View style={styles.content} key={step.id}>
      <Text variant="titleMedium" style={styles.title}>
        {step.title}
      </Text>
      <Text
        variant="bodyLarge"
        color="onSurfaceVariant"
        style={styles.description}>
        {step.short}
      </Text>
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  content: {
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
}));
