import {useCallback, useState} from 'react';
import {Platform, Share} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import type {LegalDocumentId} from '@visamesa/content/legalBlocks';

import {useAppDialog} from '@/contexts/AppDialogContext';
import {useAuth} from '@/contexts/AuthContext';
import {useConsent} from '@/contexts/ConsentContext';
import {useProfileData} from '@/features/profile/context/ProfileDataContext';
import {accountService} from '@/features/legal/services/accountService';
import {ProfileStackParamList} from '@/navigation/types';
import {getAxiosApiErrorMessage} from '@/services/apiErrors';

type LegalNavigation = NativeStackNavigationProp<ProfileStackParamList, 'Legal'>;

export type UseLegalScreenResult = {
  hasPrivacyConsent: boolean;
  hasTermsConsent: boolean;
  isExporting: boolean;
  isDeleting: boolean;
  onExportDataPress: () => Promise<void>;
  onDeleteAccountPress: () => void;
  onOpenDocument: (documentId: LegalDocumentId) => void;
};

export function useLegalScreen(): UseLegalScreenResult {
  const navigation = useNavigation<LegalNavigation>();
  const {logout} = useAuth();
  const {profileData} = useProfileData();
  const {hasPrivacyConsent, hasTermsConsent} = useConsent();
  const {showAlert} = useAppDialog();
  const {t} = useTranslation('profile');
  const {t: tCommon} = useTranslation('common');
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const onOpenDocument = useCallback(
    (documentId: LegalDocumentId) => {
      navigation.navigate('LegalDocument', {documentId});
    },
    [navigation],
  );

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
        getAxiosApiErrorMessage(error, 'profile:account.exportFailedMessage'),
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
              navigation.navigate('Profile');
            },
          },
        ],
      );
    } catch (error) {
      showAlert(
        t('account.deletionFailedTitle'),
        getAxiosApiErrorMessage(error, 'profile:account.deletionFailedMessage'),
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

  return {
    hasPrivacyConsent,
    hasTermsConsent,
    isExporting,
    isDeleting,
    onExportDataPress,
    onDeleteAccountPress,
    onOpenDocument,
  };
}
