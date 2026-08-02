import React from 'react';
import {View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {useTranslation} from 'react-i18next';

import {CollapsingHeaderScreen} from '@/components/layout/CollapsingHeaderScreen';
import {DetailLinkRow} from '@/components/ui/DetailLinkRow';
import {Text} from '@/components/ui/Text';
import {useLegalScreen} from '@/features/legal/hooks/useLegalScreen';

const LegalScreen = () => {
  const {styles} = useStyles(stylesheet);
  const {t} = useTranslation('profile');
  const {
    hasPrivacyConsent,
    hasTermsConsent,
    isExporting,
    isDeleting,
    onExportDataPress,
    onDeleteAccountPress,
    onOpenDocument,
  } = useLegalScreen();

  return (
    <CollapsingHeaderScreen title={t('legalTitle')}>
      <Text variant="bodyMedium" color="onSurfaceVariant">
        {t('legalDocument.hubIntro')}
      </Text>

      <View style={styles.section}>
        <Text variant="labelLarge" color="onSurfaceVariant">
          {t('account.documentsSection')}
        </Text>
        <DetailLinkRow
          title={t('account.privacyPolicyTitle')}
          description={
            hasPrivacyConsent
              ? t('legalDocument.privacyAcceptedDescription')
              : t('legalDocument.privacyPendingDescription')
          }
          status={hasPrivacyConsent ? 'done' : 'notDone'}
          onPress={() => onOpenDocument('privacy')}
        />
        <DetailLinkRow
          title={t('account.termsTitle')}
          description={
            hasTermsConsent
              ? t('legalDocument.termsAcceptedDescription')
              : t('legalDocument.termsPendingDescription')
          }
          status={hasTermsConsent ? 'done' : 'notDone'}
          onPress={() => onOpenDocument('terms')}
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
          onPress={onExportDataPress}
          disabled={isExporting}
        />
        <DetailLinkRow
          title={t('account.deleteAccountTitle')}
          description={
            isDeleting
              ? t('account.deletingDescription')
              : t('account.deleteAccountDescription')
          }
          onPress={onDeleteAccountPress}
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
}));

export default LegalScreen;
