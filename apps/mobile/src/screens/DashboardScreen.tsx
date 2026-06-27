import React from 'react';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {CompositeNavigationProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {Stepper} from '@/components/Stepper';
import {DetailLinkRow} from '@/components/ui/DetailLinkRow';
import {Text} from '@/components/ui/Text';
import {DashboardHeader} from '@/features/dashboard/components/DashboardHeader';
import {DashboardUnauthenticated} from '@/features/dashboard/components/DashboardUnauthenticated';
import {RequirementsChecklist} from '@/features/dashboard/components/RequirementsChecklist';
import {StepActionFooter} from '@/features/dashboard/components/StepActionFooter';
import {DASHBOARD_STEP_DETAIL_LABEL} from '@/features/dashboard/data/dashboardContent';
import {useDashboardScreen} from '@/features/dashboard/hooks/useDashboardScreen';
import {ProcessPrerequisitesModal} from '@/features/home/components/ProcessPrerequisitesModal';
import {useTabBarInset} from '@/navigation/useTabBarInset';
import {DashboardStackParamList, RootStackParamList} from '@/navigation/types';

type DashboardScreenNavigation = CompositeNavigationProp<
  NativeStackNavigationProp<DashboardStackParamList, 'Dashboard'>,
  NativeStackNavigationProp<RootStackParamList>
>;

type DashboardScreenProps = {
  navigation: DashboardScreenNavigation;
};

const DashboardScreen = ({navigation}: DashboardScreenProps) => {
  const {styles, theme} = useStyles(stylesheet);
  const tabBarInset = useTabBarInset();
  const {
    isAuthLoading,
    isAuthenticated,
    isLoading,
    error,
    steps,
    currentStepId,
    currentStep,
    completedStepIds,
    isCurrentStepCompleted,
    canCompleteStep,
    canInteractWithRequirements,
    stepActionDisabledHint,
    stepActionLabel,
    currentStepRequirements,
    canStartProcess,
    processMissing,
    showPrerequisitesModal,
    onSignInPress,
    onStepPress,
    onStepDetailPress,
    onCompleteStep,
    onSelfDeclaredToggle,
    onAutomationPress,
    onViewAppointmentPress,
    onClearAutomationPress,
    onFormPress,
    onClosePrerequisitesModal,
    onGetServicePress,
    onCompleteProfilePress,
  } = useDashboardScreen(navigation);

  if (isAuthLoading || (isAuthenticated && isLoading)) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <DashboardUnauthenticated onSignInPress={onSignInPress} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.centered}>
          <Text variant="bodyLarge" color="error">
            {error.message}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentStep) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.layout}>
        <View style={styles.stickyHeader}>
          <DashboardHeader />
          <View style={styles.stepSection}>
            <Stepper
              steps={steps}
              activeStepId={currentStepId}
              completedStepIds={completedStepIds}
              compact
              onStepPress={onStepPress}
            />
          </View>
        </View>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.stepHeader}>
            <Text variant="titleLarge">{currentStep.title}</Text>
            <DetailLinkRow
              title={DASHBOARD_STEP_DETAIL_LABEL}
              variant="compact"
              onPress={onStepDetailPress}
            />
          </View>
          <RequirementsChecklist
            requirements={currentStepRequirements}
            interactive={canInteractWithRequirements}
            onSelfDeclaredToggle={onSelfDeclaredToggle}
            onAutomationPress={onAutomationPress}
            onViewAppointmentPress={onViewAppointmentPress}
            onClearAutomationPress={onClearAutomationPress}
            onFormPress={onFormPress}
          />
        </ScrollView>
        <View
          style={[
            styles.footer,
            {paddingBottom: theme.spacing.md + tabBarInset},
          ]}>
          <StepActionFooter
            label={stepActionLabel}
            disabled={!canCompleteStep}
            completed={isCurrentStepCompleted}
            disabledHint={stepActionDisabledHint}
            canStartProcess={canStartProcess}
            onPress={onCompleteStep}
          />
        </View>
      </View>
      <ProcessPrerequisitesModal
        visible={showPrerequisitesModal}
        missing={processMissing}
        onClose={onClosePrerequisitesModal}
        onGetServicePress={onGetServicePress}
        onCompleteProfilePress={onCompleteProfilePress}
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
  stickyHeader: {
    backgroundColor: theme.colors.background,
  },
  stepSection: {
    marginHorizontal: theme.spacing.md,
    maxWidth: theme.sizes.contentMaxWidth,
    alignSelf: 'center',
    width: '100%',
    overflow: 'hidden',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    gap: theme.spacing.lg,
  },
  stepHeader: {
    gap: theme.spacing.xs,
    maxWidth: theme.sizes.contentMaxWidth,
    alignSelf: 'center',
    width: '100%',
  },
  footer: {
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
}));

export default DashboardScreen;
