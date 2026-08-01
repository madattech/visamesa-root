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
  const {t: tLegal} = useTranslation('legal');
  const {
    disclaimerParagraphs,
    officialSources,
    isExporting,
    isDeleting,
    onExportDataPress,
    onDeleteAccountPress,
    onOfficialSourcePress,
    openWebsitePath,
  } = useLegalScreen();

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
            onPress={() => onOfficialSourcePress(source.url)}
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
  paragraph: {
    lineHeight: 22,
  },
}));

export default LegalScreen;
