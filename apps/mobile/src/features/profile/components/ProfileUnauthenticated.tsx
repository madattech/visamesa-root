import React from 'react';
import {View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Button} from '@/components/ui/Button';
import {Text} from '@/components/ui/Text';

type ProfileUnauthenticatedProps = {
  onSignInPress: () => void;
};

export function ProfileUnauthenticated({
  onSignInPress,
}: ProfileUnauthenticatedProps) {
  const {styles} = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        Welcome to VisaMesa
      </Text>
      <Text variant="bodyMedium" color="onSurfaceVariant" style={styles.subtitle}>
        Sign in with your email to view your profile and continue.
      </Text>
      <Button label="Sign In" onPress={onSignInPress} fullWidth />
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  title: {
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
}));
