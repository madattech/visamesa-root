import React from 'react';
import {View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Text} from '@/components/ui/Text';
import {SERVICE_DISCLAIMER_SHORT} from '@/features/legal/data/legalDisclaimerContent';

type ServiceDisclaimerShortProps = {
  centered?: boolean;
};

export function ServiceDisclaimerShort({
  centered = false,
}: ServiceDisclaimerShortProps) {
  const {styles} = useStyles(stylesheet);

  return (
    <View style={styles.wrapper}>
      <Text
        variant="bodySmall"
        color="onSurfaceVariant"
        style={centered ? styles.centered : undefined}>
        {SERVICE_DISCLAIMER_SHORT}
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
