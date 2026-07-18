import React, {useMemo, useState} from 'react';
import {Platform, Share, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {CollapsingHeaderScreen} from '@/components/layout/CollapsingHeaderScreen';
import {DetailLinkRow} from '@/components/ui/DetailLinkRow';
import {Text} from '@/components/ui/Text';
import {useAppDialog} from '@/contexts/AppDialogContext';
import {useWebsiteLink} from '@/hooks/useWebsiteLink';
import {useAuth} from '@/contexts/AuthContext';
import {useProfileData} from '@/features/profile/context/ProfileDataContext';
import {accountService} from '@/services/accountService';
import {openWebsiteUrl} from '@/utils/openWebsiteUrl';

type OfficialSourceItem = {
  label: string;
  url: string;
};

const LegalScreen = () => {
  const {styles} = useStyles(stylesheet);
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

  const handleExportData = async () => {
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
  };

  const handleDeleteAccount = () => {
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
  };

  const confirmDeleteAccount = async () => {
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
  };

  return (
    <CollapsingHeaderScreen title={t('legalTitle')}>
      <View style={styles.section}>
        <Text variant="labelLarge" color="onSurfaceVariant">
          {tLegal('disclaimer.sectionTitle')}
        </Text>
        {disclaimerParagraphs.map(paragraph => (
          <Text
            key={paragraph}
            variant="bodyMedium"
            color="onSurfaceVariant"
            style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text variant="labelLarge" color="onSurfaceVariant">
          {tLegal('officialSources.sectionTitle')}
        </Text>
        <Text variant="bodyMedium" color="onSurfaceVariant">
          {tLegal('officialSources.intro')}
        </Text>
        {officialSources.map(source => (
          <DetailLinkRow
            key={source.url}
            title={source.label}
            description={source.url}
            onPress={() => {
              openWebsiteUrl(source.url).then(opened => {
                if (!opened) {
                  showAlert(tCommon('errors.title'), tCommon('errors.openLink'));
                }
              });
            }}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text variant="labelLarge" color="onSurfaceVariant">
          {t('account.documentsSection')}
        </Text>
        <DetailLinkRow
          title={t('account.privacyPolicyTitle')}
          description={t('account.privacyPolicyDescription')}
          onPress={() => openWebsitePath('/privacy')}
        />
        <DetailLinkRow
          title={t('account.termsTitle')}
          description={t('account.termsDescription')}
          onPress={() => openWebsitePath('/terms')}
        />
      </View>

      <View style={styles.section}>
        <Text variant="labelLarge" color="onSurfaceVariant">
          {t('account.dataRightsSection')}
        </Text>
        <DetailLinkRow
          title={t('account.exportTitle')}
          description={
            isExporting ? t('account.exportingDescription') : t('account.exportDescription')
          }
          onPress={handleExportData}
          disabled={isExporting}
        />
        <DetailLinkRow
          title={t('account.deleteAccountTitle')}
          description={
            isDeleting
              ? t('account.deletingDescription')
              : t('account.deleteAccountDescription')
          }
          onPress={handleDeleteAccount}
          disabled={isDeleting}
        />
      </View>

      <View style={styles.section}>
        <Text variant="bodySmall" color="onSurfaceVariant">
          {t('account.gdprFooter')}
        </Text>
      </View>
    </CollapsingHeaderScreen>
  );
};

const stylesheet = createStyleSheet(theme => ({
  section: {
    gap: theme.spacing.sm,
  },
  paragraph: {
    lineHeight: 22,
  },
}));

export default LegalScreen;
