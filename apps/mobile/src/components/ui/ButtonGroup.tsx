import React from 'react';
import {View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Button} from '@/components/ui/Button';

export type ButtonGroupProps = {
  primaryButton: {
    label: string;
    onPress: () => void;
    disabled?: boolean;
  };
  secondaryButton: {
    label: string;
    onPress: () => void;
    disabled?: boolean;
  };
};

export function ButtonGroup({primaryButton, secondaryButton}: ButtonGroupProps) {
  const {styles} = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <Button
        label={primaryButton.label}
        onPress={primaryButton.onPress}
        disabled={primaryButton.disabled}
        fullWidth
        style={styles.button}
      />
      <Button
        label={secondaryButton.label}
        onPress={secondaryButton.onPress}
        disabled={secondaryButton.disabled}
        variant="outline"
        fullWidth
        style={styles.button}
      />
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm + 4,
  },
  button: {
    width: '100%',
  },
}));
