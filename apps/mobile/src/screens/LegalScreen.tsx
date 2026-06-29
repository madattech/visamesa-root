import React, {useState} from 'react';
import {Alert, Linking, Platform, Share, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {useNavigation} from '@react-navigation/native';

import {CollapsingHeaderScreen} from '@/components/layout/CollapsingHeaderScreen';
import {DetailLinkRow} from '@/components/ui/DetailLinkRow';
import {Text} from '@/components/ui/Text';
import {WEBSITE_BASE_URL} from '@/config/website';
import {useAuth} from '@/contexts/AuthContext';
import {
  OFFICIAL_SOURCES_INTRO,
  OFFICIAL_SOURCES_SECTION_TITLE,
  SERVICE_DISCLAIMER_MASTER_PARAGRAPHS,
  SERVICE_DISCLAIMER_SECTION_TITLE,
} from '@/features/legal/data/legalDisclaimerContent';
import {selectOfficialInformationSources} from '@/features/home/selectors/selectOfficialInformationSources';
import {useProfileData} from '@/features/profile/context/ProfileDataContext';
import {accountService} from '@/services/accountService';

const LegalScreen = () => {
  const {styles} = useStyles(stylesheet);
  const navigation = useNavigation();
  const {logout} = useAuth();
  const {profileData} = useProfileData();
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const officialSources = selectOfficialInformationSources();

  const handleOpenLink = (path: string) => {
    const url = `${WEBSITE_BASE_URL}${path}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open the link');
    });
  };

  const handleExportData = async () => {
    setIsExporting(true);

    try {
      // Get backend data
      const backendData = await accountService.exportData();

      // Decrypt and include client-side encrypted profile if available
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
        note: 'Client-side profile can only be decrypted on this device',
      };

      const jsonString = JSON.stringify(exportData, null, 2);

      // Share the data
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        await Share.share({
          message: jsonString,
          title: 'VisaMesa Data Export',
        });
      } else {
        Alert.alert('Export Data', jsonString);
      }
    } catch (error) {
      Alert.alert(
        'Export Failed',
        error instanceof Error ? error.message : 'Could not export your data',
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all associated data. This action cannot be undone.\n\nYour data will be deleted from our servers and your device.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: confirmDeleteAccount,
        },
      ],
    );
  };

  const confirmDeleteAccount = async () => {
    setIsDeleting(true);

    try {
      await accountService.deleteAccount();

      Alert.alert(
        'Account Deleted',
        'Your account and all data have been permanently deleted.',
        [
          {
            text: 'OK',
            onPress: async () => {
              await logout();
              navigation.navigate('Profile' as never);
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        'Deletion Failed',
        error instanceof Error
          ? error.message
          : 'Could not delete your account. Please try again.',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <CollapsingHeaderScreen title="Legal & Privacy">
      <View style={styles.section}>
        <Text variant="labelLarge" color="onSurfaceVariant">
          {SERVICE_DISCLAIMER_SECTION_TITLE}
        </Text>
        {SERVICE_DISCLAIMER_MASTER_PARAGRAPHS.map(paragraph => (
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
          {OFFICIAL_SOURCES_SECTION_TITLE}
        </Text>
        <Text variant="bodyMedium" color="onSurfaceVariant">
          {OFFICIAL_SOURCES_INTRO}
        </Text>
        {officialSources.map(source => (
          <DetailLinkRow
            key={source.url}
            title={source.label}
            description={source.url}
            onPress={() => Linking.openURL(source.url).catch(() => {
              Alert.alert('Error', 'Could not open the link');
            })}
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text variant="labelLarge" color="onSurfaceVariant">
          Legal Documents
        </Text>
        <DetailLinkRow
          title="Privacy Policy"
          description="How we handle your data"
          onPress={() => handleOpenLink('/privacy')}
        />
        <DetailLinkRow
          title="Terms of Service"
          description="Terms and conditions"
          onPress={() => handleOpenLink('/terms')}
        />
      </View>

      <View style={styles.section}>
        <Text variant="labelLarge" color="onSurfaceVariant">
          Your Data Rights
        </Text>
        <DetailLinkRow
          title="Export My Data"
          description={
            isExporting ? 'Exporting...' : 'Download all your information'
          }
          onPress={handleExportData}
          disabled={isExporting}
        />
        <DetailLinkRow
          title="Delete My Account"
          description={
            isDeleting
              ? 'Deleting...'
              : 'Permanently delete your account and data'
          }
          onPress={handleDeleteAccount}
          disabled={isDeleting}
        />
      </View>

      <View style={styles.section}>
        <Text variant="bodySmall" color="onSurfaceVariant">
          Your personal data is encrypted on your device. We follow EU GDPR
          regulations and provide tools to manage your privacy rights.
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
