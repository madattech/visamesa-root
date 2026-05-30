import React from 'react';
import {View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Button} from '@/components/ui/Button';

type ProfileActionsProps = {
  onSignOutPress: () => void;
  disabled?: boolean;
};

export function ProfileActions({
  onSignOutPress,
  disabled = false,
}: ProfileActionsProps) {
  const {styles} = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <Button
        label="Sign Out"
        variant="outline"
        onPress={onSignOutPress}
        disabled={disabled}
        fullWidth
      />
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
}));
