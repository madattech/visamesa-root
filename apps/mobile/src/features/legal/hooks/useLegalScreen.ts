import {useCallback, useMemo, useState} from 'react';
import {Platform, Share} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {useAppDialog} from '@/contexts/AppDialogContext';
import {useAuth} from '@/contexts/AuthContext';
import {useProfileData} from '@/features/profile/context/ProfileDataContext';
import {useWebsiteLink} from '@/hooks/useWebsiteLink';
import {accountService} from '@/features/legal/services/accountService';
import {openWebsiteUrl} from '@/utils/openWebsiteUrl';

type OfficialSourceItem = {
  label: string;
  url: string;
};

export type UseLegalScreenResult = {
  disclaimerParagraphs: string[];
  officialSources: OfficialSourceItem[];
  isExporting: boolean;
  isDeleting: boolean;
  onExportDataPress: () => Promise<void>;
  onDeleteAccountPress: () => void;
  onOfficialSourcePress: (url: string) => void;
  openWebsitePath: (path: string) => void;
};

export function useLegalScreen(): UseLegalScreenResult {
  const navigation = useNavigation();
  const {logout} = useAuth();
  const {profileData} = useProfileData();
  const {openWebsitePath} = useWebsiteLink();
  const {showAlert} = useAppDialog();
  const {t} = useTranslation('profile');
  const {t: tLegal} = useTranslation('legal');
  const {t: tCommon} = useTranslation('common');
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const disclaimerParagraphs = useMemo(() => {
    const paragraphs = tLegal('disclaimer.masterParagraphs', {returnObjects: true});

    return Array.isArray(paragraphs) ? paragraphs : [];
  }, [tLegal]);

  const officialSources = useMemo(() => {
    const items = tLegal('officialSources.items', {returnObjects: true});

    return Array.isArray(items) ? (items as OfficialSourceItem[]) : [];
  }, [tLegal]);

  const onExportDataPress = useCallback(async () => {
    setIsExporting(true);

    try {
      const backendData = await accountService.exportData();

      let decryptedProfile = null;
      if (profileData?.personal) {
        try {
          decryptedProfile = profileData.personal;
        } catch (error) {
          console.warn('Could not decrypt profile for export:', error);
        }
      }

      const exportData = {
        ...backendData,
        clientSideProfile: decryptedProfile,
        exportedAt: new Date().toISOString(),
        note: t('account.exportNote'),
      };

      const jsonString = JSON.stringify(exportData, null, 2);

      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        await Share.share({
          message: jsonString,
          title: t('account.exportShareTitle'),
        });
      } else {
        showAlert(t('account.exportDialogTitle'), jsonString);
      }
    } catch (error) {
      showAlert(
        t('account.exportFailedTitle'),
        error instanceof Error ? error.message : t('account.exportFailedMessage'),
      );
    } finally {
      setIsExporting(false);
    }
  }, [profileData?.personal, showAlert, t]);

  const confirmDeleteAccount = useCallback(async () => {
    setIsDeleting(true);

    try {
      await accountService.deleteAccount();

      showAlert(
        t('account.deletedTitle'),
        t('account.deletedMessage'),
        [
          {
            text: tCommon('actions.ok'),
            onPress: async () => {
              await logout();
              navigation.navigate('Profile' as never);
            },
          },
        ],
      );
    } catch (error) {
      showAlert(
        t('account.deletionFailedTitle'),
        error instanceof Error
          ? error.message
          : t('account.deletionFailedMessage'),
      );
    } finally {
      setIsDeleting(false);
    }
  }, [logout, navigation, showAlert, t, tCommon]);

  const onDeleteAccountPress = useCallback(() => {
    showAlert(
      t('account.deleteTitle'),
      t('account.deleteMessage'),
      [
        {text: tCommon('actions.cancel'), style: 'cancel'},
        {
          text: tCommon('actions.delete'),
          style: 'destructive',
          onPress: confirmDeleteAccount,
        },
      ],
      {dismissable: false},
    );
  }, [confirmDeleteAccount, showAlert, t, tCommon]);

  const onOfficialSourcePress = useCallback(
    (url: string) => {
      openWebsiteUrl(url).then(opened => {
        if (!opened) {
          showAlert(tCommon('errors.title'), tCommon('errors.openLink'));
        }
      });
    },
    [showAlert, tCommon],
  );

  return {
    disclaimerParagraphs,
    officialSources,
    isExporting,
    isDeleting,
    onExportDataPress,
    onDeleteAccountPress,
    onOfficialSourcePress,
    openWebsitePath,
  };
}
