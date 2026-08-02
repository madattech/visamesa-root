import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Dialog} from '@/components/ui/Dialog';
import {Text} from '@/components/ui/Text';
import {PrerequisitesChecklist} from '@/features/dashboard/components/PrerequisitesChecklist';
import {ProcessReadinessMissing} from '@/hooks/useProcessReadiness';

type PrerequisitesDialogProps = {
  visible: boolean;
  missing: ProcessReadinessMissing[];
  onClose: () => void;
  onGoToProfile: () => void;
};

export function PrerequisitesDialog({
  visible,
  missing,
  onClose,
  onGoToProfile,
}: PrerequisitesDialogProps) {
  const {styles} = useStyles(stylesheet);
  const {t} = useTranslation('dashboard');

  return (
    <Dialog
      visible={visible}
      onClose={onClose}
      title={t('readinessTitle')}
      actions={[
        {
          label: t('prerequisitesDialog.notNow'),
          onPress: onClose,
          variant: 'outline',
        },
        {
          label: t('prerequisitesDialog.action'),
          onPress: onGoToProfile,
          variant: 'primary',
        },
      ]}>
      <View style={styles.content}>
        <Text variant="bodyMedium" color="onSurfaceVariant">
          {t('readinessDescription')}
        </Text>
        <PrerequisitesChecklist missing={missing} />
      </View>
    </Dialog>
  );
}

const stylesheet = createStyleSheet(theme => ({
  content: {
    gap: theme.spacing.md,
  },
}));
