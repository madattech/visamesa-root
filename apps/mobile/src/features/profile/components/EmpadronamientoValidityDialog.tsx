import React from 'react';
import {useTranslation} from 'react-i18next';

import {Dialog} from '@/components/ui/Dialog';
import {Text} from '@/components/ui/Text';

type EmpadronamientoValidityDialogProps = {
  visible: boolean;
  onConfirmNo: () => void;
  onChangeDate: () => void;
};

export function EmpadronamientoValidityDialog({
  visible,
  onConfirmNo,
  onChangeDate,
}: EmpadronamientoValidityDialogProps) {
  const {t} = useTranslation('profile');
  const {t: tCommon} = useTranslation('common');

  return (
    <Dialog
      visible={visible}
      onClose={onChangeDate}
      title={t('empadronamientoValidityDialog.title')}
      dismissable={false}
      actions={[
        {
          label: t('empadronamientoValidityDialog.changeDate'),
          onPress: onChangeDate,
          variant: 'outline',
        },
        {
          label: tCommon('actions.ok'),
          onPress: onConfirmNo,
          variant: 'primary',
        },
      ]}>
      <Text variant="bodyMedium" color="onSurfaceVariant">
        {t('empadronamientoValidityDialog.message')}
      </Text>
    </Dialog>
  );
}
