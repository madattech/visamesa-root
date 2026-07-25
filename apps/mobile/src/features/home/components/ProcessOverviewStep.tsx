import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Icon} from '@/components/ui/Icon';
import {Text} from '@/components/ui/Text';
import {
  type ProcessOverviewBadgeLabels,
  type ProcessOverviewStepContent,
  type ProcessOverviewVisamesaBadge,
} from '@visamesa/content/processOverview';

type ProcessOverviewBadgeProps = {
  label: string;
  variant: 'visamesa' | 'inPerson';
};

function ProcessOverviewBadge({label, variant}: ProcessOverviewBadgeProps) {
  const {styles} = useStyles(badgeStylesheet);

  return (
    <View
      style={[
        styles.badge,
        variant === 'visamesa' ? styles.visamesaBadge : styles.inPersonBadge,
      ]}>
      <Text
        variant="labelSmall"
        color={variant === 'visamesa' ? 'onPrimaryContainer' : 'onSurfaceVariant'}>
        {label}
      </Text>
    </View>
  );
}

function getVisamesaBadgeLabel(
  visamesa: ProcessOverviewVisamesaBadge,
  badgeLabels: ProcessOverviewBadgeLabels,
): string {
  return visamesa === 'book' ? badgeLabels.helpBook : badgeLabels.helpFill;
}

function buildStepAccessibilityLabel(
  step: ProcessOverviewStepContent,
  stepNumber: number,
  badgeLabels: ProcessOverviewBadgeLabels,
  showCompleteIcon: boolean,
  formatStepLabel: (number: number, title: string) => string,
): string {
  const title = showCompleteIcon
    ? step.title
    : formatStepLabel(stepNumber, step.title);
  const badgeParts = [
    step.visamesa ? getVisamesaBadgeLabel(step.visamesa, badgeLabels) : null,
    step.inPerson ? badgeLabels.inPerson : null,
  ].filter((value): value is string => value != null);

  return [title, step.description, ...badgeParts].join('. ');
}

type ProcessOverviewStepProps = {
  stepNumber: number;
  step: ProcessOverviewStepContent;
  badgeLabels: ProcessOverviewBadgeLabels;
  isLast: boolean;
  showCompleteIcon?: boolean;
};

export function ProcessOverviewStep({
  stepNumber,
  step,
  badgeLabels,
  isLast,
  showCompleteIcon = false,
}: ProcessOverviewStepProps) {
  const {styles} = useStyles(stylesheet);
  const {t} = useTranslation('processOverview');
  const accessibilityLabel = buildStepAccessibilityLabel(
    step,
    stepNumber,
    badgeLabels,
    showCompleteIcon,
    (number, title) => t('stepLabel', {number, title}),
  );

  return (
    <View
      style={[styles.container, !isLast && styles.withDivider]}
      accessible
      accessibilityLabel={accessibilityLabel}>
      <View
        style={styles.numberBadge}
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden>
        {showCompleteIcon ? (
          <Icon name="check-circle" size="md" color="primary" />
        ) : (
          <Text variant="labelLarge" color="primary">
            {stepNumber}
          </Text>
        )}
      </View>
      <View style={styles.content} importantForAccessibility="no">
        <Text variant="titleMedium">{step.title}</Text>
        <Text variant="bodyMedium" color="onSurfaceVariant">
          {step.description}
        </Text>
        {step.visamesa || step.inPerson ? (
          <View style={styles.badges}>
            {step.visamesa ? (
              <ProcessOverviewBadge
                label={getVisamesaBadgeLabel(step.visamesa, badgeLabels)}
                variant="visamesa"
              />
            ) : null}
            {step.inPerson ? (
              <ProcessOverviewBadge
                label={badgeLabels.inPerson}
                variant="inPerson"
              />
            ) : null}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const badgeStylesheet = createStyleSheet(theme => ({
  badge: {
    borderRadius: theme.radii.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
  },
  visamesaBadge: {
    backgroundColor: theme.colors.primaryContainer,
  },
  inPersonBadge: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
}));

const stylesheet = createStyleSheet(theme => ({
  container: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
  },
  withDivider: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  numberBadge: {
    width: theme.sizes.touchTargetMin,
    height: theme.sizes.touchTargetMin,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    paddingTop: theme.spacing.xs / 2,
  },
}));
