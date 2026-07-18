import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Text} from '@/components/ui/Text';

type ServiceDisclaimerShortProps = {
  centered?: boolean;
};

export function ServiceDisclaimerShort({
  centered = false,
}: ServiceDisclaimerShortProps) {
  const {styles} = useStyles(stylesheet);
  const {t} = useTranslation('legal');

  return (
    <View style={styles.wrapper}>
      <Text
        variant="bodySmall"
        color="onSurfaceVariant"
        style={centered ? styles.centered : undefined}>
        {t('disclaimer.short')}
      </Text>
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  wrapper: {
    paddingHorizontal: theme.spacing.md,
  },
  centered: {
    textAlign: 'center',
  },
}));
