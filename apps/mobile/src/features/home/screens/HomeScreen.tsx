import React from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {Stepper} from '@/components/Stepper';
import {ButtonGroup} from '@/components/ui/ButtonGroup';
import {Surface} from '@/components/ui/Surface';
import {Text} from '@/components/ui/Text';
import {HeroSection} from '@/features/home/components/HeroSection';
import {StepOverview} from '@/features/home/components/StepOverview';
import {useHomeScreen} from '@/features/home/hooks/useHomeScreen';
import {PrerequisitesDialog} from '@/features/dashboard/components/PrerequisitesDialog';
import {ServiceDisclaimerShort} from '@/features/legal/components/ServiceDisclaimerShort';
import {HomeStackParamList} from '@/navigation/types';
import {useTabBarInset} from '@/navigation/useTabBarInset';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'Home'>;
};

const HomeScreen = ({navigation}: HomeScreenProps) => {
  const {styles, theme} = useStyles(stylesheet);
  const {t} = useTranslation('home');
  const tabBarInset = useTabBarInset();
  const {
    steps,
    isLoading,
    error,
    activeStepId,
    activeStep,
    onStepPress,
    onPrimaryPress,
    onSecondaryPress,
    showPrerequisitesDialog,
    readinessMissing,
    onClosePrerequisitesDialog,
    onGoToProfilePress,
  } = useHomeScreen(navigation);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
        <View style={styles.layout}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            <HeroSection />
            <Surface variant="filled" style={styles.stepSection}>
              <Stepper
                steps={steps}
                activeStepId={activeStepId}
                onStepPress={onStepPress}
              />
              {activeStep ? <StepOverview step={activeStep} /> : null}
            </Surface>
          </ScrollView>
          <View
            style={[
              styles.footer,
              {paddingBottom: theme.spacing.md + tabBarInset},
            ]}>
            <ServiceDisclaimerShort centered />
            <ButtonGroup
              primaryButton={{
                label: t('primaryCta'),
                onPress: onPrimaryPress,
              }}
              secondaryButton={{
                label: t('secondaryCta'),
                onPress: onSecondaryPress,
              }}
            />
          </View>
        </View>
      )}
      <PrerequisitesDialog
        visible={showPrerequisitesDialog}
        missing={readinessMissing}
        onClose={onClosePrerequisitesDialog}
        onGoToProfile={onGoToProfilePress}
      />
    </SafeAreaView>
  );
};

const stylesheet = createStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  layout: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  stepSection: {
    marginHorizontal: theme.spacing.md,
    maxWidth: theme.sizes.contentMaxWidth,
    alignSelf: 'center',
    width: '100%',
    gap: 0,
    overflow: 'hidden',
  },
  footer: {
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    gap: theme.spacing.sm,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
}));

export default HomeScreen;
