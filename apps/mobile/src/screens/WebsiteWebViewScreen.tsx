import React from 'react';
import {ActivityIndicator, SafeAreaView, StyleSheet, View} from 'react-native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import {ICP_PLUS_URL} from '../webViewInjection/scriptRegistry';
import {useWebViewInjection} from '../webViewInjection/useWebViewInjection';
import {
  buildCitaPreviaInjectionRules,
  citaPreviaPiiConfig,
} from '../scripts/cita-previa';

const WebsiteWebViewScreen = () => {
  const webViewRef = React.useRef<React.ElementRef<typeof WebView>>(null);
  const injectionRules = React.useMemo(
    () => buildCitaPreviaInjectionRules(citaPreviaPiiConfig),
    [],
  );
  const {
    handleMessage: handleInjectionMessage,
    onLoadEnd,
    onNavigationStateChange,
  } = useWebViewInjection(webViewRef, {
    initialUrl: ICP_PLUS_URL,
    rules: injectionRules,
  });

  const handleMessage = React.useCallback((event: WebViewMessageEvent) => {
    if (handleInjectionMessage(event.nativeEvent.data)) {
      return;
    }

    try {
      const message = JSON.parse(event.nativeEvent.data);

      if (message.type === 'debug') {
        console.debug('[WebView debug]', message.data);
      }
    } catch {
      // Ignore non-JSON messages from the page.
    }
  }, [handleInjectionMessage]);

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{uri: ICP_PLUS_URL}}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        onNavigationStateChange={onNavigationStateChange}
        onLoadEnd={onLoadEnd}
        onMessage={handleMessage}
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
