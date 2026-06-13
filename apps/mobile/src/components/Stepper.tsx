import React from 'react';
import {ScrollView, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Button} from '@/components/ui/Button';
import {Icon} from '@/components/ui/Icon';
import {Text} from '@/components/ui/Text';
import {TieStepDetail} from '@/features/home/types/TieStepDetail';
import {getStepShortLabel} from '@/utils/stepLabel';

type StepperProps = {
  steps: TieStepDetail[];
  activeStepId: number;
  completedStepIds?: number[];
  isStepPressable?: (stepId: number) => boolean;
  compact?: boolean;
  onStepPress: (stepId: number) => void;
};

export function Stepper({
  steps,
  activeStepId,
  completedStepIds = [],
  isStepPressable,
  compact = false,
  onStepPress,
}: StepperProps) {
  const {styles} = useStyles(stylesheet);
  const completedSet = new Set(completedStepIds);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        styles.scrollContent,
        compact && styles.scrollContentCompact,
      ]}
      accessibilityRole="tablist">
      {steps.map(step => {
        const isActive = step.id === activeStepId;
        const isCompleted = completedSet.has(step.id);
        const pressable = isStepPressable?.(step.id) ?? true;

        const variant = isCompleted
          ? 'tonal'
          : isActive
            ? 'primary'
            : 'outline';

        return (
          <View key={step.id} style={styles.item}>
            <Button
              size="icon"
              variant={variant}
              disabled={!pressable}
              accessibilityRole="tab"
              accessibilityState={{
                selected: isActive,
                disabled: !pressable,
                checked: isCompleted,
              }}
              accessibilityLabel={`Step ${step.id}: ${step.title}${
                isCompleted ? ', completed' : ''
              }`}
              onPress={() => onStepPress(step.id)}
              style={[
                styles.stepButton,
                !isActive && !isCompleted && styles.stepButtonInactive,
                isCompleted && styles.stepButtonCompleted,
                !pressable && styles.stepButtonDisabled,
              ]}>
              {isCompleted ? (
                <Icon name="check" size="md" color="success" />
              ) : (
                <Text
                  variant="labelLarge"
                  color={isActive ? 'onPrimary' : 'onSurfaceVariant'}
                  style={styles.stepNumber}>
                  {step.id}
                </Text>
              )}
            </Button>
            <Text
              variant="labelSmall"
              color={
                isActive ? 'primary' : isCompleted ? 'success' : 'onSurfaceVariant'
              }
              style={[styles.stepLabel, !pressable && styles.stepLabelDisabled]}
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
  scrollContentCompact: {
    paddingTop: theme.spacing.xs,
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
  stepButtonCompleted: {
    backgroundColor: theme.colors.successContainer,
  },
  stepButtonDisabled: {
    opacity: 0.45,
  },
  stepNumber: {
    textAlign: 'center',
  },
  stepLabel: {
    textAlign: 'center',
    maxWidth: theme.sizes.stepper.itemWidth,
  },
  stepLabelDisabled: {
    opacity: 0.45,
  },
}));
