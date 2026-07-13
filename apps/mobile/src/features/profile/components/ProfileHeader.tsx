import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Text} from '@/components/ui/Text';

export function ProfileHeader() {
  const {styles} = useStyles(stylesheet);
  const {t} = useTranslation('common');

  return (
    <View style={styles.container}>
      <Text variant="titleMedium">{t('tabs.profile')}</Text>
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
    backgroundColor: theme.colors.background,
  },
}));
