import React from 'react'
import { ActivityIndicator, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Stepper } from '@/components/Stepper'
import { ButtonGroup } from '@/components/ui/ButtonGroup'
import { Text } from '@/components/ui/Text'
import { HeroSection } from '@/features/home/components/HeroSection'
import { StepOverview } from '@/features/home/components/StepOverview'
import { useHomeScreen } from '@/features/home/hooks/useHomeScreen'
import { RootStackParamList } from '@/navigation/RootNavigator'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen = ({navigation}: HomeScreenProps) => {
  const {styles, theme} = useStyles(stylesheet);
  const {
    steps,
    isLoading,
    error,
    activeStepId,
    activeStep,
    onStepPress,
    onPrimaryPress,
    onSecondaryPress,
  } = useHomeScreen(navigation);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text variant="bodyLarge" color="error">
            {error.message}
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <HeroSection />
          <Stepper
            steps={steps}
            activeStepId={activeStepId}
            onStepPress={onStepPress}
          />
          {activeStep ? <StepOverview step={activeStep} /> : null}
          <ButtonGroup
            primaryButton={{
              label: 'Do It All for Me',
              onPress: onPrimaryPress,
            }}
            secondaryButton={{
              label: 'Learn More',
              onPress: onSecondaryPress,
            }}
          />
        </ScrollView>
      )}
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
    paddingBottom: theme.spacing.xxxl,
    gap: theme.spacing.lg,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
}));

export default HomeScreen;
