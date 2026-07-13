import React from 'react'
import { Pressable, View } from 'react-native'
import { useTranslation } from 'react-i18next'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
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
  const {t} = useTranslation('dashboard');
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
    <Checkbox
      checked={completed}
      onToggle={onSelfDeclaredToggle || (() => {})}
      size="lg"
      disabled={!canToggle || !onSelfDeclaredToggle}
      accessibilityLabel={requirement.label}
    />
  );

  const titleRow = (
    <View style={styles.titleRow}>
      {checkbox}
      <Text variant="bodyLarge" style={styles.titleText}>
        {requirement.label}
      </Text>
    </View>
  );

  const details =
    requirement.description || hint ? (
      <View style={styles.details}>
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
    ) : null;

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
        {titleRow}
        {details}
      </Pressable>
    );
  }

  return (
    <View style={styles.item}>
      {titleRow}
      {details}
      {hasBookAction ? (
        <Button
          label={t('bookViaVisaMesa')}
          variant="tonal"
          onPress={onAutomationPress}
          accessibilityLabel={t('bookAccessibilityLabel', {
            label: requirement.label,
          })}
          style={styles.actionButton}
        />
      ) : null}
      {hasFormAction ? (
        <Button
          label={t('reviewForm')}
          variant="tonal"
          onPress={onFormPress}
          accessibilityLabel={t('reviewAccessibilityLabel', {
            label: requirement.label,
          })}
          style={styles.actionButton}
        />
      ) : null}
      {hasAppointmentAction ? (
        <View style={styles.completedActions}>
          <Button
            label={t('viewAppointment')}
            variant="tonal"
            onPress={onViewAppointmentPress}
            accessibilityLabel={t('viewAppointmentAccessibilityLabel', {
              label: requirement.label,
            })}
            style={styles.actionButton}
          />
          {canClearAutomation ? (
            <Button
              label={t('markAsNotBooked')}
              variant="outline"
              onPress={onClearAutomationPress}
              accessibilityLabel={t('markAsNotBookedAccessibilityLabel', {
                label: requirement.label,
              })}
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
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    minHeight: theme.sizes.touchTargetMin,
  },
  titleText: {
    flex: 1,
  },
  details: {
    marginLeft: theme.sizes.icon.lg + theme.spacing.sm,
    gap: theme.spacing.xs / 2,
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
