import React from 'react';

import {Dialog} from '@/components/ui/Dialog';
import {
  PROFILE_ALREADY_PAID_DIALOG_MESSAGE,
  PROFILE_ALREADY_PAID_DIALOG_TITLE,
  PROFILE_ALREADY_PAID_OK,
  PROFILE_ALREADY_PAID_SEE_STATUS,
} from '@visamesa/content/checkout';

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
  return (
    <Dialog
      visible={visible}
      onClose={onClose}
      title={PROFILE_ALREADY_PAID_DIALOG_TITLE}
      actions={[
        {
          label: PROFILE_ALREADY_PAID_OK,
          onPress: onClose,
          variant: 'outline',
        },
        {
          label: PROFILE_ALREADY_PAID_SEE_STATUS,
          onPress: onSeeStatus,
          variant: 'primary',
        },
      ]}>
      {PROFILE_ALREADY_PAID_DIALOG_MESSAGE}
    </Dialog>
  );
}
