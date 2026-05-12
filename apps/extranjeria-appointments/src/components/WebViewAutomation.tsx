import React, {useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import {Case, AutomationProgress, AppointmentSlot} from '../types';

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

  // The government website URL
  const GOVERNMENT_WEBSITE_URL =
    'https://sede.administracionespublicas.gob.es/pagina/index/directorio/icpplus';

  // This is the JavaScript code that will be injected into the WebView
  // Your co-worker will develop and refine this script
  const injectedJavaScript = `
    (function() {
      // Placeholder injection script
      // Your co-worker will replace this with the actual automation logic
      
      console.log('VisaMesa Automation Script Loaded');
      
      // Helper function to send messages back to React Native
      function sendMessage(type, data) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: type,
          data: data
        }));
      }
      
      // Case data from React Native
      const caseData = ${JSON.stringify(caseData)};
      
      sendMessage('progress', { 
        stage: 'loading', 
        message: 'Script injected successfully' 
      });
      
      // TODO: Your co-worker will implement the actual automation logic here:
      // 1. Navigate through the website
      // 2. Fill in forms with caseData.profile information
      // 3. Check for available appointment slots
      // 4. Report found slots using: sendMessage('slots_found', slotsArray)
      // 5. Book an appointment if slots are available
      // 6. Report booking result using: sendMessage('booking_complete', resultObject)
      
      // Example placeholder behavior (remove when actual script is ready):
      setTimeout(() => {
        sendMessage('progress', { 
          stage: 'checking', 
          message: 'Waiting for automation script from co-worker...' 
        });
      }, 2000);
      
      // Handle errors
      window.onerror = function(message, source, lineno, colno, error) {
        sendMessage('error', { 
          error: 'Script error: ' + message 
        });
      };
      
    })();
    true; // Required by React Native WebView
  `;

  const handleMessage = (event: WebViewMessageEvent) => {
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
        injectedJavaScript={injectedJavaScript}
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
