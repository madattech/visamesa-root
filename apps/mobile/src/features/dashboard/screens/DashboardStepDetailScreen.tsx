import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {RouteProp} from '@react-navigation/native';

import {CollapsingHeaderScreen} from '@/components/layout/CollapsingHeaderScreen';
import {Text} from '@/components/ui/Text';
import {StepDetailContent} from '@/features/dashboard/components/StepDetailContent';
import {useDashboardStepDetailScreen} from '@/features/dashboard/hooks/useDashboardStepDetailScreen';
import {DashboardStackParamList} from '@/navigation/types';
import {getStepShortLabel} from '@/utils/stepLabel';

type DashboardStepDetailScreenProps = {
  route: RouteProp<DashboardStackParamList, 'StepDetail'>;
};

const DashboardStepDetailScreen = ({route}: DashboardStepDetailScreenProps) => {
  const {styles, theme} = useStyles(stylesheet);
  const {t} = useTranslation('tieSteps');
  const {step, isLoading, error} = useDashboardStepDetailScreen(route);

  const title = step
    ? t('stepDetailHeading', {
        stepId: step.id,
        title: getStepShortLabel(step.title),
      })
    : t('stepDetailTitle');

  if (isLoading) {
    return (
      <CollapsingHeaderScreen title={title}>
        <View style={styles.centered}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      </CollapsingHeaderScreen>
    );
  }

  if (error || !step) {
    return (
      <CollapsingHeaderScreen title={title}>
        <Text variant="bodyMedium" color="error" style={styles.error}>
          {error?.message ?? t('stepNotFound')}
        </Text>
      </CollapsingHeaderScreen>
    );
  }

  return (
    <CollapsingHeaderScreen title={title}>
      <Text variant="bodyLarge" color="onSurfaceVariant">
        {step.short}
      </Text>
      <StepDetailContent step={step} />
    </CollapsingHeaderScreen>
  );
};

const stylesheet = createStyleSheet(theme => ({
  centered: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  error: {
    textAlign: 'center',
  },
}));

export default DashboardStepDetailScreen;
