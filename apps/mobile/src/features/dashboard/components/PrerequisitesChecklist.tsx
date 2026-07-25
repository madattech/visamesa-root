import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {StatusIndicator} from '@/components/ui/StatusIndicator';
import {Text} from '@/components/ui/Text';
import {ProcessReadinessMissing, PROCESS_READINESS_ITEM_ORDER} from '@/hooks/processReadinessTypes';

type PrerequisitesChecklistItemProps = {
  label: string;
  isComplete: boolean;
  completeLabel: string;
  incompleteLabel: string;
};

function PrerequisitesChecklistItem({
  label,
  isComplete,
  completeLabel,
  incompleteLabel,
}: PrerequisitesChecklistItemProps) {
  const {styles} = useStyles(stylesheet);
  const statusLabel = isComplete ? completeLabel : incompleteLabel;

  return (
    <View
      style={styles.item}
      accessible
      accessibilityLabel={`${label}. ${statusLabel}`}>
      <View
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden>
        <StatusIndicator
          status={isComplete ? 'done' : 'notDone'}
          size="md"
        />
      </View>
      <Text
        variant="bodyMedium"
        color={isComplete ? 'onSurface' : 'onSurfaceVariant'}
        importantForAccessibility="no">
        {label}
      </Text>
    </View>
  );
}

const PREREQUISITE_ITEMS = PROCESS_READINESS_ITEM_ORDER;

type PrerequisitesChecklistProps = {
  missing: ProcessReadinessMissing[];
};

export function PrerequisitesChecklist({missing}: PrerequisitesChecklistProps) {
  const {styles} = useStyles(stylesheet);
  const {t} = useTranslation('dashboard');

  const labels: Record<ProcessReadinessMissing, string> = {
    personalInformation: t('readinessPersonalInformation'),
    payment: t('readinessPayment'),
    legalPrivacy: t('readinessLegalPrivacy'),
  };
  const completeLabel = t('readinessItemComplete');
  const incompleteLabel = t('readinessItemIncomplete');

  return (
    <View style={styles.container}>
      {PREREQUISITE_ITEMS.map(item => (
        <PrerequisitesChecklistItem
          key={item}
          label={labels[item]}
          isComplete={!missing.includes(item)}
          completeLabel={completeLabel}
          incompleteLabel={incompleteLabel}
        />
      ))}
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    gap: theme.spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
}));
