import React from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Text} from '@/components/ui/Text';
import {useDashboardScreen} from '@/features/dashboard/hooks/useDashboardScreen';

const DashboardScreen = () => {
  const {styles} = useStyles(stylesheet);
  const {title, message} = useDashboardScreen();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <Text variant="headlineSmall" style={styles.title}>
          {title}
        </Text>
        <Text variant="bodyMedium" color="onSurfaceVariant">
          {message}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  title: {
    fontWeight: '600',
    textAlign: 'center',
  },
}));

export default DashboardScreen;
