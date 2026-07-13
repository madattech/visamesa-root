import React from 'react'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslation } from 'react-i18next'
import {
  LANGUAGE_NATIVE_NAMES,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from '@visamesa/content/i18n'

import { CollapsingHeaderScreen } from '@/components/layout/CollapsingHeaderScreen'
import { Icon } from '@/components/ui/Icon'
import { SelectField } from '@/components/ui/SelectField'
import { Text } from '@/components/ui/Text'
import { useAppLocale } from '@/contexts/LocaleContext'

const SettingsScreen = () => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation('settings')
  const { locale, changeLocale } = useAppLocale()

  const languageOptions = SUPPORTED_LANGUAGES.map((language) => ({
    label: LANGUAGE_NATIVE_NAMES[language],
    value: language,
  }))

  return (
    <CollapsingHeaderScreen title={t('title')}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Icon name="language" size="md" color="primary" />
          <Text variant="labelLarge" color="onSurfaceVariant" style={styles.sectionTitle}>
            {t('languageSectionTitle')}
          </Text>
        </View>
        <Text variant="bodyMedium" color="onSurfaceVariant">
          {t('languageSectionDescription')}
        </Text>
        <SelectField
          label={t('languageSectionTitle')}
          hideLabel
          value={locale}
          options={languageOptions}
          onChange={(value) => {
            changeLocale(value as SupportedLanguage).catch(() => {})
          }}
        />
      </View>
    </CollapsingHeaderScreen>
  )
}

const stylesheet = createStyleSheet(theme => ({
  section: {
    gap: theme.spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    flex: 1,
  },
}))

export default SettingsScreen
