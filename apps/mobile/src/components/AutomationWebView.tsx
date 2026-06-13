import React from 'react';
import WebView, {WebViewMessageEvent} from 'react-native-webview';

import type {WebViewInjectionRule} from '../webViewInjection/scriptRegistry';
import {useWebViewInjection} from '../webViewInjection/useWebViewInjection';

type NativeWebViewProps = React.ComponentProps<typeof WebView>;

export interface AutomationWebViewMessageContext {
  raw: string;
  event: WebViewMessageEvent;
}

export interface AutomationWebViewProps
  extends Omit<
    NativeWebViewProps,
    'source' | 'onMessage' | 'onNavigationStateChange' | 'onLoadEnd'
  > {
  sourceUrl: string;
  initialUrl?: string | null;
  rules: WebViewInjectionRule[];
  onAutomationMessage?: (
    message: unknown,
    context: AutomationWebViewMessageContext,
  ) => void;
  onNonJsonMessage?: (context: AutomationWebViewMessageContext) => void;
}

const AutomationWebView: React.FC<AutomationWebViewProps> = ({
  sourceUrl,
  initialUrl = sourceUrl,
  rules,
  onAutomationMessage,
  onNonJsonMessage,
  javaScriptEnabled = true,
  domStorageEnabled = true,
  startInLoadingState = true,
  ...webViewProps
}) => {
  const webViewRef = React.useRef<React.ElementRef<typeof WebView>>(null);
  const {
    handleMessage: handleInjectionMessage,
    onLoadEnd,
    onNavigationStateChange,
  } = useWebViewInjection(webViewRef, {
    initialUrl,
    rules,
  });

  const handleMessage = React.useCallback(
    (event: WebViewMessageEvent) => {
      const raw = event.nativeEvent.data;

      if (handleInjectionMessage(raw)) {
        return;
      }

      const context = {raw, event};

      try {
        onAutomationMessage?.(JSON.parse(raw), context);
      } catch {
        onNonJsonMessage?.(context);
      }
    },
    [handleInjectionMessage, onAutomationMessage, onNonJsonMessage],
  );

  return (
    <WebView
      {...webViewProps}
      ref={webViewRef}
      source={{uri: sourceUrl}}
      javaScriptEnabled={javaScriptEnabled}
      domStorageEnabled={domStorageEnabled}
      startInLoadingState={startInLoadingState}
      onNavigationStateChange={onNavigationStateChange}
      onLoadEnd={onLoadEnd}
      onMessage={handleMessage}
    />
  );
};

export default AutomationWebView;
