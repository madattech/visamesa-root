import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import WebView from 'react-native-webview';

import {RootStackParamList} from '@/navigation/types';
import {getWebViewUserAgent} from '@/webViewInjection/webViewDefaults';
import {useWebsiteWebViewScreen} from '@/webViewInjection/useWebsiteWebViewScreen';

type WebsiteWebViewRouteProp = RouteProp<RootStackParamList, 'WebsiteWebView'>;

const WebsiteWebViewScreen = () => {
  const route = useRoute<WebsiteWebViewRouteProp>();
  const {
    webViewRef,
    webViewSource,
    onLoadEnd,
    onNavigationStateChange,
    onMessage,
    onError,
    onHttpError,
  } = useWebsiteWebViewScreen(route);

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webViewRef}
        source={webViewSource}
        userAgent={getWebViewUserAgent()}
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
