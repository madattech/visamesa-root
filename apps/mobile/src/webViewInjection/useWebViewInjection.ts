import React from 'react';
import {
  resolveInjectedJavaScript,
  resolveWebViewInjectionRule,
  type WebViewInjectionRule,
} from './scriptRegistry';

export interface WebViewNavigationState {
  url?: string | null;
}

export interface WebViewInjectionHandle {
  injectJavaScript: (script: string) => void;
}

interface UseWebViewInjectionOptions {
  initialUrl?: string | null;
  rules?: WebViewInjectionRule[];
}

export interface UseWebViewInjectionResult {
  activeRule: WebViewInjectionRule | null;
  activeScript: string | null;
  currentUrl: string | null;
  onLoadEnd: () => void;
  onNavigationStateChange: (state: WebViewNavigationState) => void;
}

export const useWebViewInjection = (
  webViewRef: React.RefObject<WebViewInjectionHandle>,
  options: UseWebViewInjectionOptions = {},
): UseWebViewInjectionResult => {
  const {initialUrl = null, rules} = options;
  const [currentUrl, setCurrentUrl] = React.useState<string | null>(initialUrl);

  const activeRule = resolveWebViewInjectionRule(currentUrl, rules);
  const activeScript = activeRule?.script ?? null;

  const onNavigationStateChange = React.useCallback(
    ({url}: WebViewNavigationState) => {
      setCurrentUrl(url ?? null);
    },
    [],
  );

  const onLoadEnd = React.useCallback(() => {
    const injectedJavaScript = resolveInjectedJavaScript(currentUrl, rules);

    if (!injectedJavaScript) {
      console.debug('[WebViewInjection] No matching rule for current URL', {
        currentUrl,
      });
      return;
    }

    webViewRef.current?.injectJavaScript(injectedJavaScript);
  }, [currentUrl, rules, webViewRef]);

  return {
    activeRule,
    activeScript,
    currentUrl,
    onLoadEnd,
    onNavigationStateChange,
  };
};
