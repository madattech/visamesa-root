import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import WebView, {WebViewMessageEvent} from 'react-native-webview';

import {RootStackParamList} from '@/navigation/types';
import {
  buildCitaPreviaInjectionRules,
  CITA_PREVIA_START_URL,
  citaPreviaPiiConfig,
} from '@/scripts/cita-previa';
import {
  buildEmpadronamientoInjectionRules,
  empadronamientoPiiConfig,
  EMPADRONAMIENTO_HOME_URL,
} from '@/scripts/empadronamiento';
import {useWebViewInjection} from '@/webViewInjection/useWebViewInjection';
import {MOBILE_SAFARI_USER_AGENT} from '@/webViewInjection/webViewDefaults';

type WebsiteWebViewRouteProp = RouteProp<RootStackParamList, 'WebsiteWebView'>;

const WebsiteWebViewScreen = () => {
  const route = useRoute<WebsiteWebViewRouteProp>();
  const automation = route.params?.automation ?? 'cita-previa';
  const webViewRef = React.useRef<React.ElementRef<typeof WebView>>(null);

  const startUrl =
    route.params?.url ??
    (automation === 'empadronamiento'
      ? EMPADRONAMIENTO_HOME_URL
      : CITA_PREVIA_START_URL);

  const injectionRules = React.useMemo(
    () =>
      automation === 'empadronamiento'
        ? buildEmpadronamientoInjectionRules(empadronamientoPiiConfig)
        : buildCitaPreviaInjectionRules(citaPreviaPiiConfig),
    [automation],
  );

  const {
    handleMessage: handleInjectionMessage,
    onLoadEnd,
    onNavigationStateChange,
  } = useWebViewInjection(webViewRef, {
    initialUrl: startUrl,
    rules: injectionRules,
  });

  const handleMessage = React.useCallback(
    (event: WebViewMessageEvent) => {
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
    },
    [handleInjectionMessage],
  );

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{uri: startUrl}}
        userAgent={MOBILE_SAFARI_USER_AGENT}
        applicationNameForUserAgent="VisaMesa"
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        cacheEnabled
        startInLoadingState
        setSupportMultipleWindows={false}
        onNavigationStateChange={onNavigationStateChange}
        onLoadEnd={onLoadEnd}
        onMessage={handleMessage}
        onError={syntheticEvent => {
          console.warn('[WebView] Load error', {
            automation,
            url: startUrl,
            ...syntheticEvent.nativeEvent,
          });
        }}
        onHttpError={syntheticEvent => {
          console.warn('[WebView] HTTP error', {
            automation,
            url: startUrl,
            statusCode: syntheticEvent.nativeEvent.statusCode,
          });
        }}
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
