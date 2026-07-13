import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Button} from '@/components/ui/Button';
import {Icon} from '@/components/ui/Icon';
import {Surface} from '@/components/ui/Surface';
import {Text} from '@/components/ui/Text';
import {DASHBOARD_EMPTY_ICON} from '@/features/dashboard/data/dashboardContent';

type DashboardUnauthenticatedProps = {
  onSignInPress: () => void;
};

export function DashboardUnauthenticated({
  onSignInPress,
}: DashboardUnauthenticatedProps) {
  const {styles} = useStyles(stylesheet);
  const {t: tDashboard} = useTranslation('dashboard');
  const {t: tCommon} = useTranslation('common');

  return (
    <View style={styles.container}>
      <Surface variant="elevated" elevation={2} style={styles.card}>
        <View style={styles.iconWrap}>
          <Icon name={DASHBOARD_EMPTY_ICON} size="hero" color="primary" />
        </View>
        <Text variant="headlineSmall" style={styles.title}>
          {tDashboard('emptyTitle')}
        </Text>
        <Text variant="bodyLarge" color="onSurfaceVariant" style={styles.subtitle}>
          {tDashboard('emptySubtitle')}
        </Text>
        <Button
          label={tCommon('actions.signIn')}
          onPress={onSignInPress}
          fullWidth
        />
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
