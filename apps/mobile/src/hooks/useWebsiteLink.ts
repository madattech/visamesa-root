import {useAppDialog} from '@/contexts/AppDialogContext';
import {getWebsiteUrl} from '@/config/website';
import {openWebsiteUrl} from '@/utils/openWebsiteUrl';
import {useTranslation} from 'react-i18next';

export function useWebsiteLink() {
  const {showAlert} = useAppDialog();
  const {t} = useTranslation('common');

  const openWebsitePath = async (path: string) => {
    const opened = await openWebsiteUrl(getWebsiteUrl(path));
    if (!opened) {
      showAlert(t('errors.title'), t('errors.openLink'));
    }
  };

  return {openWebsitePath};
}
