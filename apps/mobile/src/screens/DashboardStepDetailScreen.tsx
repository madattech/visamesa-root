import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {RouteProp} from '@react-navigation/native';

import {InternalDetailScreenLayout} from '@/components/layout/InternalDetailScreenLayout';
import {Text} from '@/components/ui/Text';
import {StepDetailContent} from '@/features/dashboard/components/StepDetailContent';
import {useDashboardStepDetailScreen} from '@/features/dashboard/hooks/useDashboardStepDetailScreen';
import {DashboardStackParamList} from '@/navigation/types';

type DashboardStepDetailScreenProps = {
  route: RouteProp<DashboardStackParamList, 'StepDetail'>;
};

const DashboardStepDetailScreen = ({route}: DashboardStepDetailScreenProps) => {
  const {styles, theme} = useStyles(stylesheet);
  const {step, isLoading, error} = useDashboardStepDetailScreen(route);

  if (isLoading) {
    return (
      <InternalDetailScreenLayout>
        <View style={styles.centered}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      </InternalDetailScreenLayout>
    );
  }

  if (error || !step) {
    return (
      <InternalDetailScreenLayout>
        <Text variant="bodyMedium" color="error" style={styles.error}>
          {error?.message ?? 'Step not found'}
        </Text>
      </InternalDetailScreenLayout>
    );
  }

  return (
    <InternalDetailScreenLayout>
      <Text variant="bodyLarge" color="onSurfaceVariant">
        {step.short}
      </Text>
      <StepDetailContent step={step} />
    </InternalDetailScreenLayout>
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
