import React from 'react';
import {View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Button} from '@/components/ui/Button';
import {Icon} from '@/components/ui/Icon';
import {Surface} from '@/components/ui/Surface';
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
      <Surface variant="elevated" elevation={2} style={styles.card}>
        <View style={styles.iconWrap}>
          <Icon name="person-outline" size="hero" color="primary" />
        </View>
        <Text variant="headlineSmall" style={styles.title}>
          Welcome to VisaMesa
        </Text>
        <Text variant="bodyMedium" color="onSurfaceVariant" style={styles.subtitle}>
          Sign in with your email to view your profile and continue.
        </Text>
        <Button label="Sign In" onPress={onSignInPress} fullWidth />
      </Surface>
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  card: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.md,
    maxWidth: theme.sizes.contentMaxWidth,
    alignSelf: 'center',
    width: '100%',
  },
  iconWrap: {
    width: theme.sizes.touchTargetMin + theme.spacing.xl,
    height: theme.sizes.touchTargetMin + theme.spacing.xl,
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
}));
