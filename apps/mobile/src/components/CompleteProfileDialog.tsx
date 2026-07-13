import React from 'react';
import {useTranslation} from 'react-i18next';

import {Dialog} from '@/components/ui/Dialog';

type CompleteProfileDialogProps = {
  visible: boolean;
  onClose: () => void;
  onCompleteProfile: () => void;
};

export function CompleteProfileDialog({
  visible,
  onClose,
  onCompleteProfile,
}: CompleteProfileDialogProps) {
  const {t} = useTranslation('profile');

  return (
    <Dialog
      visible={visible}
      onClose={onClose}
      title={t('completeProfileDialog.title')}
      actions={[
        {
          label: t('completeProfileDialog.notNow'),
          onPress: onClose,
          variant: 'outline',
        },
        {
          label: t('completeProfileDialog.action'),
          onPress: onCompleteProfile,
          variant: 'primary',
        },
      ]}>
      {t('completeProfileDialog.message')}
    </Dialog>
  );
}
