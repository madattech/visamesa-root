import React from 'react';
import {View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {CollapsingHeaderScreen} from '@/components/layout/CollapsingHeaderScreen';
import {Text} from '@/components/ui/Text';
import {ProcessOverviewPhase} from '@/features/home/components/ProcessOverviewPhase';
import {useProcessOverview} from '@/features/home/hooks/useProcessOverview';

const ProcessOverviewScreen = () => {
  const {styles} = useStyles(stylesheet);
  const {screenTitle, intro, phases, badgeLabels} = useProcessOverview();

  return (
    <CollapsingHeaderScreen title={screenTitle}>
      <Text variant="bodyLarge" color="onSurfaceVariant" style={styles.intro}>
        {intro}
      </Text>
      <View style={styles.phases}>
        {phases.map(phase => (
          <ProcessOverviewPhase
            key={phase.id}
            phase={phase}
            badgeLabels={badgeLabels}
          />
        ))}
      </View>
    </CollapsingHeaderScreen>
  );
};

const stylesheet = createStyleSheet(theme => ({
  intro: {
    marginBottom: theme.spacing.xs,
  },
  phases: {
    gap: theme.spacing.lg,
  },
}));

export default ProcessOverviewScreen;
