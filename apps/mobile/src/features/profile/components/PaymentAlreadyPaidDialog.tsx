import React from 'react';
import {useTranslation} from 'react-i18next';

import {Dialog} from '@/components/ui/Dialog';

type PaymentAlreadyPaidDialogProps = {
  visible: boolean;
  onClose: () => void;
  onSeeStatus: () => void;
};

export function PaymentAlreadyPaidDialog({
  visible,
  onClose,
  onSeeStatus,
}: PaymentAlreadyPaidDialogProps) {
  const {t} = useTranslation(['checkout', 'common']);

  return (
    <Dialog
      visible={visible}
      onClose={onClose}
      title={t('checkout:profileAlreadyPaid.dialogTitle')}
      actions={[
        {
          label: t('common:actions.ok'),
          onPress: onClose,
          variant: 'outline',
        },
        {
          label: t('common:actions.seeStatus'),
          onPress: onSeeStatus,
          variant: 'primary',
        },
      ]}>
      {t('checkout:profileAlreadyPaid.dialogMessage')}
    </Dialog>
  );
}
