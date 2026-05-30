import React from 'react';
import {ScrollView, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Icon} from '@/components/ui/Icon';
import {Surface} from '@/components/ui/Surface';
import {Text} from '@/components/ui/Text';
import {useDashboardScreen} from '@/features/dashboard/hooks/useDashboardScreen';
import {useTabBarInset} from '@/navigation/useTabBarInset';

const DashboardScreen = () => {
  const {styles, theme} = useStyles(stylesheet);
  const tabBarInset = useTabBarInset();
  const {emptyTitle, emptySubtitle, emptyIcon} = useDashboardScreen();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: theme.spacing.xl + tabBarInset},
        ]}
        showsVerticalScrollIndicator={false}>
        <Surface variant="elevated" elevation={2} style={styles.card}>
          <View style={styles.iconWrap}>
            <Icon name={emptyIcon} size="hero" color="primary" />
          </View>
          <Text variant="headlineSmall" style={styles.title}>
            {emptyTitle}
          </Text>
          <Text variant="bodyLarge" color="onSurfaceVariant" style={styles.subtitle}>
            {emptySubtitle}
          </Text>
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
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

export default DashboardScreen;
