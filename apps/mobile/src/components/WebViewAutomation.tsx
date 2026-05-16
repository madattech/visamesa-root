import React, {useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import {Case, AutomationProgress, AppointmentSlot} from '../types';
import {
  buildCitaPreviaAutomationProfileFromCase,
  buildCitaPreviaInjectionRules,
} from '../scripts/cita-previa';
import {useWebViewInjection} from '../webViewInjection/useWebViewInjection';

interface WebViewAutomationProps {
  caseData: Case;
  onProgress: (progress: AutomationProgress) => void;
  onSlotsFound: (slots: AppointmentSlot[]) => void;
  onBookingComplete: (success: boolean, details?: any) => void;
  onError: (error: string) => void;
}

const WebViewAutomation: React.FC<WebViewAutomationProps> = ({
  caseData,
  onProgress,
  onSlotsFound,
  onBookingComplete,
  onError,
}) => {
  const webViewRef = useRef<WebView>(null);
  const automationProfile = buildCitaPreviaAutomationProfileFromCase(caseData);
  const injectionRules = buildCitaPreviaInjectionRules(automationProfile);

  const GOVERNMENT_WEBSITE_URL =
    'https://sede.administracionespublicas.gob.es/pagina/index/directorio/icpplus';
  const {
    handleMessage: handleInjectionMessage,
    onLoadEnd,
    onNavigationStateChange,
  } = useWebViewInjection(webViewRef, {
    initialUrl: GOVERNMENT_WEBSITE_URL,
    rules: injectionRules,
  });

  const handleMessage = (event: WebViewMessageEvent) => {
    if (handleInjectionMessage(event.nativeEvent.data)) {
      return;
    }

    try {
      const message = JSON.parse(event.nativeEvent.data);

      switch (message.type) {
        case 'progress':
          onProgress(message.data);
          break;

        case 'slots_found':
          onSlotsFound(message.data);
          onProgress({
            stage: 'checking',
            message: `Found ${message.data.length} available slot(s)`,
            slotsFound: message.data,
          });
          break;

        case 'booking_complete':
          onBookingComplete(message.data.success, message.data);
          break;

        case 'error':
          onError(message.data.error);
          break;

        case 'debug':
          console.debug('[WebView debug]', message.data);
          break;

        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Failed to parse WebView message:', error);
      onError('Failed to communicate with automation script');
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{uri: GOVERNMENT_WEBSITE_URL}}
        onNavigationStateChange={onNavigationStateChange}
        onLoadEnd={onLoadEnd}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onError={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          onError(`WebView error: ${nativeEvent.description}`);
        }}
        onHttpError={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          onError(`HTTP error: ${nativeEvent.statusCode}`);
        }}
        // Hide the WebView from user (runs in background)
        style={styles.hidden}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  hidden: {
    opacity: 0,
  },
});

export default WebViewAutomation;
