import React from 'react';
import {ActivityIndicator, SafeAreaView, StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';
import {
  getInjectedJavaScript,
  ICP_PLUS_URL,
} from '../webViewInjection/getInjectedJavaScript';

const WebsiteWebViewScreen = () => {
  const webViewRef = React.useRef<WebView>(null);
  const currentUrlRef = React.useRef<string | null>(ICP_PLUS_URL);

  return (
    <SafeAreaView style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{uri: ICP_PLUS_URL}}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        onNavigationStateChange={({url}) => {
          currentUrlRef.current = url ?? null;
        }}
        onLoadEnd={() => {
          const injectedJavaScript = getInjectedJavaScript(currentUrlRef.current);

          if (injectedJavaScript) {
            webViewRef.current?.injectJavaScript(injectedJavaScript);
          }
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
