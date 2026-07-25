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
};

function PrerequisitesChecklistItem({
  label,
  isComplete,
}: PrerequisitesChecklistItemProps) {
  const {styles} = useStyles(stylesheet);

  return (
    <View style={styles.item}>
      <StatusIndicator
        status={isComplete ? 'done' : 'notDone'}
        size="md"
      />
      <Text
        variant="bodyMedium"
        color={isComplete ? 'onSurface' : 'onSurfaceVariant'}>
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

  return (
    <View style={styles.container}>
      {PREREQUISITE_ITEMS.map(item => (
        <PrerequisitesChecklistItem
          key={item}
          label={labels[item]}
          isComplete={!missing.includes(item)}
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
