import React from 'react';

import {Dialog} from '@/components/ui/Dialog';
import {
  COMPLETE_PROFILE_DIALOG_TITLE,
  COMPLETE_PROFILE_DIALOG_MESSAGE,
  COMPLETE_PROFILE_DIALOG_NOT_NOW_BUTTON,
  COMPLETE_PROFILE_DIALOG_ACTION_BUTTON,
} from '@/components/data/completeProfileDialogContent';

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
  return (
    <Dialog
      visible={visible}
      onClose={onClose}
      title={COMPLETE_PROFILE_DIALOG_TITLE}
      actions={[
        {
          label: COMPLETE_PROFILE_DIALOG_NOT_NOW_BUTTON,
          onPress: onClose,
          variant: 'outline',
        },
        {
          label: COMPLETE_PROFILE_DIALOG_ACTION_BUTTON,
          onPress: onCompleteProfile,
          variant: 'primary',
        },
      ]}>
      {COMPLETE_PROFILE_DIALOG_MESSAGE}
    </Dialog>
  );
}
