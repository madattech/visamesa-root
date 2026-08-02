import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';

import {useAppDialog} from '@/contexts/AppDialogContext';
import {resetUserProgress} from '@/features/dashboard/services/progressService';
import {useToast} from '@/components/Toast/ToastProvider';

export type UseSettingsScreenResult = {
  onResetProgressPress: () => void;
};

export function useSettingsScreen(): UseSettingsScreenResult {
  const {t} = useTranslation('settings');
  const {t: tCommon} = useTranslation('common');
  const {showToast} = useToast();
  const {showAlert} = useAppDialog();

  const onResetProgressPress = useCallback(() => {
    if (!__DEV__) {
      return;
    }

    showAlert(t('devResetProgressTitle'), t('devResetProgressMessage'), [
      {text: tCommon('actions.cancel'), style: 'cancel'},
      {
        text: t('devResetProgressConfirm'),
        style: 'destructive',
        onPress: async () => {
          await resetUserProgress();
          showToast(t('devResetProgressSuccess'));
        },
      },
    ]);
  }, [showAlert, showToast, t, tCommon]);

  return {onResetProgressPress};
}
