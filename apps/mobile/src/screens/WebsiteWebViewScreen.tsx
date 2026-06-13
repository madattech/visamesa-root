import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import AutomationWebView from '../components/AutomationWebView'
import {
  buildCitaPreviaInjectionRules,
  citaPreviaPiiConfig
} from '../scripts/cita-previa'
import { ICP_PLUS_URL } from '../webViewInjection/scriptRegistry'

const WebsiteWebViewScreen = () => {
  const injectionRules = React.useMemo(
    () => buildCitaPreviaInjectionRules(citaPreviaPiiConfig),
    [],
  );

  const handleAutomationMessage = React.useCallback((message: any) => {
    if (message.type === 'debug') {
      console.debug('[WebView debug]', message.data);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <AutomationWebView
        sourceUrl={ICP_PLUS_URL}
        rules={injectionRules}
        originWhitelist={['*']}
        onAutomationMessage={handleAutomationMessage}
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#1A73E8" />
          </View>
        )}
        style={styles.webView}
      />
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
});

export default WebsiteWebViewScreen;
