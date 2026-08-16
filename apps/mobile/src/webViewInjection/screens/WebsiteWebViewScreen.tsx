import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text, View} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import {RootStackParamList} from '@/navigation/types';
import {getWebViewUserAgent} from '@/webViewInjection/webViewDefaults';
import {useWebsiteWebViewScreen} from '@/webViewInjection/useWebsiteWebViewScreen';

type WebsiteWebViewRouteProp = RouteProp<RootStackParamList, 'WebsiteWebView'>;

type AutomationStage = {
  label: string;
  detail: string;
  step: number;
  total: number;
};

const CITA_PREVIA_STAGES: Record<string, AutomationStage> = {
  'cita-previa-open-official-site': {
    label: 'Opening the official appointment site',
    detail: 'We are entering the government cita previa service.',
    step: 1,
    total: 7,
  },
  'cita-previa-select-province-gateway': {
    label: 'Selecting the province',
    detail: 'We are choosing the correct province for your appointment.',
    step: 2,
    total: 7,
  },
  'cita-previa-select-province': {
    label: 'Selecting the province',
    detail: 'We are choosing the correct province for your appointment.',
    step: 2,
    total: 7,
  },
  'cita-previa-enter-service': {
    label: 'Entering the appointment flow',
    detail: 'We are moving past the official information page.',
    step: 3,
    total: 7,
  },
  'cita-previa-fill-personal-details': {
    label: 'Filling your details',
    detail: 'We are securely entering the information needed for the appointment.',
    step: 4,
    total: 7,
  },
  'cita-previa-select-procedure': {
    label: 'Selecting the procedure',
    detail: 'We are selecting the fingerprint/TIE procedure.',
    step: 5,
    total: 7,
  },
  'cita-previa-request-appointment': {
    label: 'Checking appointment availability',
    detail: 'We are asking the official site for available appointments.',
    step: 6,
    total: 7,
  },
};

const EMPADRONAMIENTO_STAGES: Record<string, AutomationStage> = {
  'empadronamiento-home': {
    label: 'Opening Barcelona city services',
    detail: 'We are finding the empadronamiento appointment service.',
    step: 1,
    total: 10,
  },
  'empadronamiento-search-result': {
    label: 'Finding the empadronamiento service',
    detail: 'We are selecting the correct city service.',
    step: 2,
    total: 10,
  },
  'empadronamiento-start-tramit': {
    label: 'Starting the appointment request',
    detail: 'We are entering the city appointment form.',
    step: 3,
    total: 10,
  },
  'empadronamiento-tema': {
    label: 'Choosing the appointment topic',
    detail: 'We are selecting the empadronamiento appointment category.',
    step: 4,
    total: 10,
  },
  'empadronamiento-personal-info': {
    label: 'Filling your details',
    detail: 'We are securely entering the information needed for the appointment.',
    step: 5,
    total: 10,
  },
  'empadronamiento-personal-info-form': {
    label: 'Filling your details',
    detail: 'We are securely entering the information needed for the appointment.',
    step: 5,
    total: 10,
  },
  'empadronamiento-motive': {
    label: 'Adding the appointment reason',
    detail: 'We are completing the reason for your appointment request.',
    step: 6,
    total: 10,
  },
  'empadronamiento-motive-form': {
    label: 'Adding the appointment reason',
    detail: 'We are completing the reason for your appointment request.',
    step: 6,
    total: 10,
  },
  'empadronamiento-select-oficina': {
    label: 'Selecting an office',
    detail: 'We are selecting the city office for your appointment.',
    step: 7,
    total: 10,
  },
  'empadronamiento-select-oficina-form': {
    label: 'Selecting an office',
    detail: 'We are selecting the city office for your appointment.',
    step: 7,
    total: 10,
  },
  'empadronamiento-select-date': {
    label: 'Choosing an available date',
    detail: 'We are checking the calendar for available appointment dates.',
    step: 8,
    total: 10,
  },
  'empadronamiento-select-date-form': {
    label: 'Choosing an available date',
    detail: 'We are checking the calendar for available appointment dates.',
    step: 8,
    total: 10,
  },
  'empadronamiento-select-time': {
    label: 'Choosing an available time',
    detail: 'We are selecting an available appointment time.',
    step: 9,
    total: 10,
  },
  'empadronamiento-select-time-form': {
    label: 'Choosing an available time',
    detail: 'We are selecting an available appointment time.',
    step: 9,
    total: 10,
  },
  'empadronamiento-solicit': {
    label: 'Reviewing the request',
    detail: 'We are preparing the final appointment request.',
    step: 10,
    total: 10,
  },
  'empadronamiento-submit-final': {
    label: 'Submitting the appointment request',
    detail: 'We are sending the request to the city site.',
    step: 10,
    total: 10,
  },
};

function getInitialAutomationStage(
  automation: 'cita-previa' | 'empadronamiento',
): AutomationStage {
  return {
    label: 'Preparing automation',
    detail: 'We are loading the official website and waiting for the next step.',
    step: 1,
    total: automation === 'empadronamiento' ? 10 : 7,
  };
}

function shouldRevealWebViewForManualReview(
  automation: 'cita-previa' | 'empadronamiento',
  stage: AutomationStage,
) {
  if (!__DEV__) {
    return false;
  }

  return automation === 'empadronamiento'
    ? stage.step >= 9
    : stage.step >= 6;
}

function getAutomationResultCopy(status: string) {
  switch (status) {
    case 'no-appointments':
      return {
        icon: '⌛',
        eyebrow: 'Availability checked',
        title: 'No appointments found',
        detail:
          'The official cita previa site has no available slots right now. This is common. You can try again later.',
        hint:
          'We did not submit or book anything. Your requirement remains pending until an appointment is found.',
      };
    case 'session-expired':
      return {
        icon: '⏱️',
        eyebrow: 'Automation paused',
        title: 'Session expired',
        detail:
          'The official website ended the session before automation could continue.',
        hint: 'Return to the dashboard and try again later.',
      };
    case 'access-blocked':
      return {
        icon: '⚠️',
        eyebrow: 'Automation paused',
        title: 'Manual check required',
        detail:
          'The official website showed a security or access check that automation should not bypass.',
        hint: 'Return to the dashboard and try again later.',
      };
    case 'service-unavailable':
      return {
        icon: '🛠️',
        eyebrow: 'Automation paused',
        title: 'Official website unavailable',
        detail:
          'The official website appears to be unavailable or under maintenance.',
        hint: 'Return to the dashboard and try again later.',
      };
    default:
      return {
        icon: '⚠️',
        eyebrow: 'Automation paused',
        title: 'Automation could not continue',
        detail:
          'The official website showed an unexpected state. You can return to the dashboard and try again later.',
        hint: undefined,
      };
  }
}

function getKnownAutomationStage(
  automation: 'cita-previa' | 'empadronamiento',
  ruleId?: string,
): AutomationStage | null {
  if (!ruleId) {
    return null;
  }

  const stages =
    automation === 'empadronamiento'
      ? EMPADRONAMIENTO_STAGES
      : CITA_PREVIA_STAGES;

  return stages[ruleId] ?? null;
}

const WebsiteWebViewScreen = () => {
  const route = useRoute<WebsiteWebViewRouteProp>();
  const navigation = useNavigation();
  const {
    webViewRef,
    automation,
    webViewSource,
    injectedJavaScript,
    activeRule,
    automationResult,
    webViewError,
    onLoadEnd,
    onNavigationStateChange,
    onMessage,
    onError,
    onHttpError,
  } = useWebsiteWebViewScreen(route);
  const [stage, setStage] = useState(() =>
    getInitialAutomationStage(automation),
  );

  useEffect(() => {
    setStage(getInitialAutomationStage(automation));
  }, [automation]);

  useEffect(() => {
    const nextStage = getKnownAutomationStage(automation, activeRule?.id);

    if (!nextStage) {
      return;
    }

    setStage(currentStage => {
      if (nextStage.total !== currentStage.total) {
        return nextStage;
      }

      if (nextStage.step < currentStage.step) {
        return currentStage;
      }

      return nextStage;
    });
  }, [activeRule?.id, automation]);

  const resultCopy = automationResult
    ? getAutomationResultCopy(automationResult.status)
    : null;
  const hasTerminalOverlay = Boolean(webViewError) || Boolean(resultCopy);
  const revealWebViewForManualReview =
    !hasTerminalOverlay && shouldRevealWebViewForManualReview(automation, stage);

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webViewRef}
        source={webViewSource}
        userAgent={getWebViewUserAgent()}
        originWhitelist={['*']}
        javaScriptEnabled
        injectedJavaScript={injectedJavaScript}
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        cacheEnabled
        startInLoadingState
        setSupportMultipleWindows={false}
        onNavigationStateChange={onNavigationStateChange}
        onLoadEnd={onLoadEnd}
        onMessage={onMessage}
        onError={onError}
        onHttpError={onHttpError}
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#1A73E8" />
          </View>
        )}
        style={styles.webView}
      />
      {webViewError ? (
        <View style={styles.automationOverlay}>
          <View style={styles.overlayCard}>
            <Text style={styles.resultIcon}>⚠️</Text>
            <Text style={styles.overlayEyebrow}>Automation paused</Text>
            <Text style={styles.overlayTitle}>{webViewError.title}</Text>
            <Text style={styles.overlayDetail}>{webViewError.message}</Text>
            {webViewError.detail ? (
              <Text style={styles.overlayHint}>{webViewError.detail}</Text>
            ) : null}
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.primaryAction}
              accessibilityRole="button">
              <Text style={styles.primaryActionText}>Back to dashboard</Text>
            </Pressable>
          </View>
        </View>
      ) : resultCopy ? (
        <View style={styles.automationOverlay}>
          <View style={styles.overlayCard}>
            <Text style={styles.resultIcon}>{resultCopy.icon}</Text>
            <Text style={styles.overlayEyebrow}>{resultCopy.eyebrow}</Text>
            <Text style={styles.overlayTitle}>{resultCopy.title}</Text>
            <Text style={styles.overlayDetail}>{resultCopy.detail}</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, {width: '100%'}]} />
            </View>
            {resultCopy.hint ? (
              <Text style={styles.overlayHint}>{resultCopy.hint}</Text>
            ) : null}
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.primaryAction}
              accessibilityRole="button">
              <Text style={styles.primaryActionText}>Back to dashboard</Text>
            </Pressable>
          </View>
        </View>
      ) : revealWebViewForManualReview ? (
        <View style={styles.manualReviewBanner} pointerEvents="none">
          <Text style={styles.manualReviewTitle}>Manual review mode</Text>
          <Text style={styles.manualReviewText}>
            Automation reached the final test stage. Review the official page
            before confirming anything.
          </Text>
        </View>
      ) : (
        <View style={styles.automationOverlay}>
          <View style={styles.overlayCard}>
            <ActivityIndicator size="large" color="#1A73E8" />
            <Text style={styles.overlayEyebrow}>
              Step {stage.step} of {stage.total}
            </Text>
            <Text style={styles.overlayTitle}>{stage.label}</Text>
            <Text style={styles.overlayDetail}>{stage.detail}</Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {width: `${Math.round((stage.step / stage.total) * 100)}%`},
                ]}
              />
            </View>
            <Text style={styles.overlayHint}>
              Please keep this screen open. We will update the status as the
              official site moves through each step.
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webView: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  automationOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F7F9FC',
  },
  overlayCard: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    borderRadius: 24,
    padding: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 8},
    elevation: 4,
  },
  resultIcon: {
    fontSize: 36,
  },
  overlayEyebrow: {
    marginTop: 20,
    color: '#1A73E8',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  overlayTitle: {
    marginTop: 8,
    color: '#172033',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  overlayDetail: {
    marginTop: 10,
    color: '#536179',
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 8,
    marginTop: 24,
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: '#E6ECF5',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#1A73E8',
  },
  overlayHint: {
    marginTop: 18,
    color: '#6B7280',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  primaryAction: {
    width: '100%',
    alignItems: 'center',
    marginTop: 22,
    borderRadius: 999,
    paddingVertical: 14,
    backgroundColor: '#1A73E8',
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  manualReviewBanner: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    borderRadius: 16,
    padding: 14,
    backgroundColor: 'rgba(23, 32, 51, 0.92)',
  },
  manualReviewTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  manualReviewText: {
    marginTop: 4,
    color: '#DDE6F3',
    fontSize: 13,
    lineHeight: 18,
  },
});

export default WebsiteWebViewScreen;
