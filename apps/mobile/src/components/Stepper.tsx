import React from 'react'
import { ScrollView, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Button } from '@/components/ui/Button'
import { Text } from '@/components/ui/Text'
import { TieStepDetail } from '@/features/home/types/TieStepDetail'
import { getStepShortLabel } from '@/utils/stepLabel'

type StepperProps = {
  steps: TieStepDetail[];
  activeStepId: number;
  onStepPress: (stepId: number) => void;
};

export function Stepper({steps, activeStepId, onStepPress}: StepperProps) {
  const {styles} = useStyles(stylesheet);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      accessibilityRole="tablist">
      {steps.map(step => {
        const isActive = step.id === activeStepId;

        return (
          <View key={step.id} style={styles.item}>
            <Button
              size="icon"
              variant={isActive ? 'primary' : 'outline'}
              accessibilityRole="tab"
              accessibilityState={{selected: isActive}}
              accessibilityLabel={`Step ${step.id}: ${step.title}`}
              onPress={() => onStepPress(step.id)}
              style={[
                styles.stepButton,
                !isActive && styles.stepButtonInactive,
              ]}>
              <Text
                variant="labelLarge"
                color={isActive ? 'onPrimary' : 'onSurfaceVariant'}
                style={styles.stepNumber}>
                {step.id}
              </Text>
            </Button>
            <Text
              variant="labelSmall"
              color={isActive ? 'primary' : 'onSurfaceVariant'}
              style={styles.stepLabel}
              numberOfLines={1}>
              {getStepShortLabel(step.title)}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const stylesheet = createStyleSheet(theme => ({
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xs,
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '100%',
  },
  item: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  stepButton: {
    minWidth: theme.sizes.touchTargetMin,
    minHeight: theme.sizes.touchTargetMin,
  },
  stepButtonInactive: {
    borderColor: theme.colors.outlineVariant,
  },
  stepNumber: {
    textAlign: 'center',
  },
  stepLabel: {
    textAlign: 'center',
    maxWidth: theme.sizes.stepper.itemWidth,
  },
}));
