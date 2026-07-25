import React from 'react';
import {View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Surface} from '@/components/ui/Surface';
import {Text} from '@/components/ui/Text';
import {ProcessOverviewStep} from '@/features/home/components/ProcessOverviewStep';
import type {ProcessOverviewPhaseView} from '@/features/home/hooks/useProcessOverview';
import {
  PROCESS_OVERVIEW_DONE_PHASE_ID,
  type ProcessOverviewBadgeLabels,
} from '@visamesa/content/processOverview';

type ProcessOverviewPhaseProps = {
  phase: ProcessOverviewPhaseView;
  badgeLabels: ProcessOverviewBadgeLabels;
};

export function ProcessOverviewPhase({
  phase,
  badgeLabels,
}: ProcessOverviewPhaseProps) {
  const {styles, theme} = useStyles(stylesheet);
  const isDonePhase = phase.id === PROCESS_OVERVIEW_DONE_PHASE_ID;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text
          variant="labelLarge"
          color="primary"
          style={styles.title}
          accessibilityRole="header">
          {phase.title}
        </Text>
        {phase.tabHint ? (
          <Text variant="bodySmall" color="onSurfaceVariant">
            {phase.tabHint}
          </Text>
        ) : null}
      </View>
      <Surface
        variant="elevated"
        elevation={2}
        style={[styles.card, {backgroundColor: theme.colors.surface}]}>
        {phase.steps.map((step, index) => (
          <ProcessOverviewStep
            key={`${phase.id}-step-${index}`}
            stepNumber={index + 1}
            step={step}
            badgeLabels={badgeLabels}
            isLast={index === phase.steps.length - 1}
            showCompleteIcon={isDonePhase}
          />
        ))}
      </Surface>
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    gap: theme.spacing.sm,
  },
  header: {
    gap: theme.spacing.xs / 2,
  },
  title: {},
  card: {
    paddingHorizontal: theme.spacing.md,
  },
}));
