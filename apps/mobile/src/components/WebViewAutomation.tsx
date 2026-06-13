import React from 'react'
import { StyleSheet, View } from 'react-native'

import {
  buildCitaPreviaAutomationProfileFromCase,
  buildCitaPreviaInjectionRules
} from '../scripts/cita-previa'
import { AppointmentSlot, AutomationProgress, Case } from '../types'
import AutomationWebView from './AutomationWebView'

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
  const automationProfile = React.useMemo(
    () => buildCitaPreviaAutomationProfileFromCase(caseData),
    [caseData],
  );
  const injectionRules = React.useMemo(
    () => buildCitaPreviaInjectionRules(automationProfile),
    [automationProfile],
  );

  const GOVERNMENT_WEBSITE_URL =
    'https://sede.administracionespublicas.gob.es/pagina/index/directorio/icpplus';

  const handleAutomationMessage = React.useCallback(
    (message: any) => {
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
    },
    [onBookingComplete, onError, onProgress, onSlotsFound],
  );

  const handleNonJsonMessage = React.useCallback(() => {
    onError('Failed to communicate with automation script');
  }, [onError]);

  return (
    <View style={styles.container}>
      <AutomationWebView
        sourceUrl={GOVERNMENT_WEBSITE_URL}
        rules={injectionRules}
        onAutomationMessage={handleAutomationMessage}
        onNonJsonMessage={handleNonJsonMessage}
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
