import {isEmpadronamientoCertificateValid} from '@visamesa/content/tieSteps/detail';
import React, {useEffect, useRef, useState} from 'react';
import {useFormContext, useWatch} from 'react-hook-form';

import {EmpadronamientoValidityDialog} from '@/features/profile/components/EmpadronamientoValidityDialog';

export function EmpadronamientoValidityWatcher() {
  const {control, setValue} = useFormContext();
  const hasEmpadronamiento = useWatch({control, name: 'hasEmpadronamiento'});
  const empadronamientoIssuedAt = useWatch({
    control,
    name: 'empadronamientoIssuedAt',
  });
  const [visible, setVisible] = useState(false);
  const lastPromptedDateRef = useRef<string | null>(null);

  useEffect(() => {
    const isExpiredCertificate =
      hasEmpadronamiento === 'yes' &&
      typeof empadronamientoIssuedAt === 'string' &&
      empadronamientoIssuedAt.length > 0 &&
      !isEmpadronamientoCertificateValid(empadronamientoIssuedAt);

    if (!isExpiredCertificate) {
      lastPromptedDateRef.current = null;
      setVisible(false);
      return;
    }

    if (lastPromptedDateRef.current === empadronamientoIssuedAt) {
      return;
    }

    lastPromptedDateRef.current = empadronamientoIssuedAt;
    setVisible(true);
  }, [empadronamientoIssuedAt, hasEmpadronamiento]);

  const onConfirmNo = () => {
    setValue('hasEmpadronamiento', 'no', {shouldValidate: true});
    setValue('empadronamientoIssuedAt', '', {shouldValidate: true});
    lastPromptedDateRef.current = null;
    setVisible(false);
  };

  const onChangeDate = () => {
    setVisible(false);
  };

  return (
    <EmpadronamientoValidityDialog
      visible={visible}
      onConfirmNo={onConfirmNo}
      onChangeDate={onChangeDate}
    />
  );
}
