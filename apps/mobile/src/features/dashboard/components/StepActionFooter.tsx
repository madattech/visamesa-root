import React from 'react';
import {View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Button} from '@/components/ui/Button';
import {Text} from '@/components/ui/Text';

type StepActionFooterProps = {
  label: string;
  disabled: boolean;
  completed: boolean;
  disabledHint?: string;
  onPress: () => void;
};

export function StepActionFooter({
  label,
  disabled,
  completed,
  disabledHint,
  onPress,
}: StepActionFooterProps) {
  const {styles} = useStyles(stylesheet);

  if (completed) {
    return (
      <View style={styles.container}>
        <Text variant="labelLarge" color="success" style={styles.completedLabel}>
          Step completed
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {disabled && disabledHint ? (
        <Text variant="bodySmall" color="onSurfaceVariant" style={styles.hint}>
          {disabledHint}
        </Text>
      ) : null}
      <Button
        label={label}
        onPress={onPress}
        disabled={disabled}
        fullWidth
        accessibilityLabel={label}
      />
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    gap: theme.spacing.sm,
    maxWidth: theme.sizes.contentMaxWidth,
    alignSelf: 'center',
    width: '100%',
  },
  completedLabel: {
    textAlign: 'center',
    paddingVertical: theme.spacing.sm,
  },
  hint: {
    textAlign: 'center',
  },
}));
