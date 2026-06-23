import React from 'react'
import { Pressable, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Text } from '@/components/ui/Text'
import { RequirementProgress } from '@/features/dashboard/types/UserProgress'
import { Requirement } from '@/features/home/types/TieStepDetail'

type RequirementItemProps = {
  requirement: Requirement;
  progress: RequirementProgress;
  hint?: string;
  isReferenced?: boolean;
  interactive?: boolean;
  onSelfDeclaredToggle?: () => void;
  onAutomationPress?: () => void;
  onViewAppointmentPress?: () => void;
  onClearAutomationPress?: () => void;
  onFormPress?: () => void;
};

export function RequirementItem({
  requirement,
  progress,
  hint,
  isReferenced = false,
  interactive = true,
  onSelfDeclaredToggle,
  onAutomationPress,
  onViewAppointmentPress,
  onClearAutomationPress,
  onFormPress,
}: RequirementItemProps) {
  const {styles, theme} = useStyles(stylesheet);
  const completed = progress.completed;
  const canToggle = interactive && !isReferenced;
  const automationSource =
    progress.source?.type === 'automation' ? progress.source : undefined;
  const hasConfirmedAppointment = Boolean(automationSource?.appointment);
  const canClearAutomation =
    canToggle &&
    requirement.type === 'automation' &&
    completed &&
    !hasConfirmedAppointment;
  const hasBookAction =
    canToggle &&
    !completed &&
    requirement.type === 'automation';
  const hasFormAction =
    canToggle &&
    !completed &&
    requirement.type === 'form';
  const hasAppointmentAction =
    requirement.type === 'automation' && completed;

  const checkbox = (
    <Icon
      name={completed ? 'check-circle' : 'radio-button-unchecked'}
      size="lg"
      color={completed ? 'success' : 'onSurfaceVariant'}
    />
  );

  const content = (
    <View style={styles.content}>
      <Text variant="bodyLarge">{requirement.label}</Text>
      {requirement.description ? (
        <Text variant="bodySmall" color="onSurfaceVariant">
          {requirement.description}
        </Text>
      ) : null}
      {hint ? (
        <Text variant="bodySmall" color="primary">
          {hint}
        </Text>
      ) : null}
    </View>
  );

  if (requirement.type === 'self_declared') {
    return (
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{checked: completed, disabled: !canToggle}}
        accessibilityLabel={requirement.label}
        disabled={!canToggle}
        android_ripple={
          canToggle ? {color: theme.colors.primaryContainer} : undefined
        }
        onPress={onSelfDeclaredToggle}
        style={({pressed}) => [
          styles.item,
          canToggle && pressed && styles.pressed,
        ]}>
        <View style={styles.headerRow}>
          {checkbox}
          {content}
        </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.item}>
      <View style={styles.headerRow}>
        {checkbox}
        {content}
      </View>
      {hasBookAction ? (
        <Button
          label="Book via VisaMesa"
          variant="tonal"
          onPress={onAutomationPress}
          accessibilityLabel={`Book ${requirement.label}`}
          style={styles.actionButton}
        />
      ) : null}
      {hasFormAction ? (
        <Button
          label="Review form filled by VisaMesa"
          variant="tonal"
          onPress={onFormPress}
          accessibilityLabel={`Review ${requirement.label}`}
          style={styles.actionButton}
        />
      ) : null}
      {hasAppointmentAction ? (
        <View style={styles.completedActions}>
          <Button
            label="View appointment"
            variant="tonal"
            onPress={onViewAppointmentPress}
            accessibilityLabel={`View appointment for ${requirement.label}`}
            style={styles.actionButton}
          />
          {canClearAutomation ? (
            <Button
              label="Mark as not booked"
              variant="outline"
              onPress={onClearAutomationPress}
              accessibilityLabel={`Mark ${requirement.label} as not booked`}
              style={styles.actionButton}
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  item: {
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    minHeight: theme.sizes.touchTargetMin,
  },
  content: {
    flex: 1,
    gap: theme.spacing.xs / 2,
    paddingTop: theme.spacing.xs / 2,
  },
  actionButton: {
    alignSelf: 'flex-start',
    marginLeft: theme.sizes.icon.lg + theme.spacing.sm,
  },
  completedActions: {
    gap: theme.spacing.xs,
  },
  pressed: {
    backgroundColor: theme.colors.surfaceContainer,
    marginHorizontal: -theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radii.sm,
  },
}));
