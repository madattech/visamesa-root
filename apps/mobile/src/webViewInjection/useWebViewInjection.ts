import React from 'react'

import {
  resolveWebViewInjectionRule,
  WebViewInjectionRule
} from './scriptRegistry'

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

interface WebViewInjectionInternalMessage {
  __webViewInjection: true;
  type: 'ready-state';
  payload: {
    ready: boolean;
    ruleId: string;
    url: string;
    selector: string;
  };
}

export interface UseWebViewInjectionResult {
  activeRule: WebViewInjectionRule | null;
  activeScript: string | null;
  currentUrl: string | null;
  handleMessage: (messageData: string) => boolean;
  onLoadEnd: () => void;
  onNavigationStateChange: (state: WebViewNavigationState) => void;
}

const DEFAULT_READY_TIMEOUT_MS = 5000;
const DEFAULT_READY_POLL_INTERVAL_MS = 200;

const buildRuleKey = (rule: WebViewInjectionRule, url: string) =>
  `${rule.id}::${url}`;

const buildReadyProbeScript = (rule: WebViewInjectionRule, url: string) => `
  (function() {
    try {
      var ready = Boolean(window.document.querySelector(${JSON.stringify(
        rule.ready?.selector ?? '',
      )}));
      window.ReactNativeWebView.postMessage(JSON.stringify({
        __webViewInjection: true,
        type: 'ready-state',
        payload: {
          ready: ready,
          ruleId: ${JSON.stringify(rule.id)},
          url: ${JSON.stringify(url)},
          selector: ${JSON.stringify(rule.ready?.selector ?? '')},
        },
      }));
    } catch (error) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        __webViewInjection: true,
        type: 'ready-state',
        payload: {
          ready: false,
          ruleId: ${JSON.stringify(rule.id)},
          url: ${JSON.stringify(url)},
          selector: ${JSON.stringify(rule.ready?.selector ?? '')},
        },
      }));
    }
  })();
  true;
`;

const isWebViewInjectionInternalMessage = (
  value: unknown,
): value is WebViewInjectionInternalMessage => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const maybeMessage = value as Partial<WebViewInjectionInternalMessage>;
  return (
    maybeMessage.__webViewInjection === true &&
    maybeMessage.type === 'ready-state' &&
    typeof maybeMessage.payload?.ruleId === 'string' &&
    typeof maybeMessage.payload?.url === 'string' &&
    typeof maybeMessage.payload?.selector === 'string' &&
    typeof maybeMessage.payload?.ready === 'boolean'
  );
};

export const useWebViewInjection = (
  webViewRef: React.RefObject<WebViewInjectionHandle | null>,
  options: UseWebViewInjectionOptions = {},
): UseWebViewInjectionResult => {
  const {initialUrl = null, rules} = options;
  const [currentUrl, setCurrentUrl] = React.useState<string | null>(initialUrl);
  const lastInjectedRuleKeyRef = React.useRef<string | null>(null);
  const readinessTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const pendingReadyRuleKeyRef = React.useRef<string | null>(null);

  const activeRule = resolveWebViewInjectionRule(currentUrl, rules);
  const activeScript = activeRule?.script ?? null;

  const clearReadinessTimer = React.useCallback(() => {
    if (readinessTimerRef.current) {
      clearTimeout(readinessTimerRef.current);
      readinessTimerRef.current = null;
    }
  }, []);

  const resetReadinessState = React.useCallback(() => {
    clearReadinessTimer();
    pendingReadyRuleKeyRef.current = null;
  }, [clearReadinessTimer]);

  const injectRuleScript = React.useCallback(
    (rule: WebViewInjectionRule, url: string) => {
      const ruleKey = buildRuleKey(rule, url);

      if (lastInjectedRuleKeyRef.current === ruleKey) {
        return true;
      }

      webViewRef.current?.injectJavaScript(rule.script);
      lastInjectedRuleKeyRef.current = ruleKey;
      resetReadinessState();
      console.debug('[WebViewInjection] Injected rule for URL', {
        url,
        ruleId: rule.id,
      });
      return true;
    },
    [resetReadinessState, webViewRef],
  );

  const beginReadinessPolling = React.useCallback(
    (
      rule: WebViewInjectionRule,
      url: string,
      startedAt: number = Date.now(),
    ) => {
      const ready = rule.ready;

      if (!ready) {
        injectRuleScript(rule, url);
        return;
      }

      const ruleKey = buildRuleKey(rule, url);
      const timeoutMs = ready.timeoutMs ?? DEFAULT_READY_TIMEOUT_MS;
      const pollIntervalMs =
        ready.pollIntervalMs ?? DEFAULT_READY_POLL_INTERVAL_MS;
      const elapsedMs = Date.now() - startedAt;

      if (elapsedMs >= timeoutMs) {
        resetReadinessState();
        console.debug('[WebViewInjection] Readiness timed out', {
          currentUrl: url,
          ruleId: rule.id,
          selector: ready.selector,
          timeoutMs,
        });
        return;
      }

      pendingReadyRuleKeyRef.current = ruleKey;
      webViewRef.current?.injectJavaScript(buildReadyProbeScript(rule, url));
      clearReadinessTimer();
      readinessTimerRef.current = setTimeout(() => {
        if (pendingReadyRuleKeyRef.current !== ruleKey) {
          return;
        }

        beginReadinessPolling(rule, url, startedAt);
      }, pollIntervalMs);
    },
    [clearReadinessTimer, injectRuleScript, resetReadinessState, webViewRef],
  );

  const onNavigationStateChange = React.useCallback(
    ({url}: WebViewNavigationState) => {
      const nextUrl = url ?? null;
      const didUrlChange = nextUrl !== currentUrl;

      if (didUrlChange) {
        lastInjectedRuleKeyRef.current = null;
        resetReadinessState();
      }

      setCurrentUrl(nextUrl);
      console.debug('[WebViewInjection] Navigation state changed', {
        currentUrl: nextUrl,
        activeRuleId: resolveWebViewInjectionRule(nextUrl, rules)?.id ?? null,
      });
    },
    [currentUrl, resetReadinessState, rules],
  );

  const onLoadEnd = React.useCallback(() => {
    const activeRuleForUrl = resolveWebViewInjectionRule(currentUrl, rules);

    console.debug('[WebViewInjection] Load end', {
      currentUrl,
      activeRuleId: activeRuleForUrl?.id ?? null,
    });

    if (!currentUrl || !activeRuleForUrl) {
      console.debug('[WebViewInjection] No matching rule for current URL', {
        currentUrl,
      });
      return;
    }

    const ruleKey = buildRuleKey(activeRuleForUrl, currentUrl);

    if (lastInjectedRuleKeyRef.current === ruleKey) {
      console.debug('[WebViewInjection] Rule already injected for current URL', {
        currentUrl,
        ruleId: activeRuleForUrl.id,
      });
      return;
    }

    if (pendingReadyRuleKeyRef.current === ruleKey) {
      console.debug('[WebViewInjection] Readiness polling already active', {
        currentUrl,
        ruleId: activeRuleForUrl.id,
      });
      return;
    }

    if (!activeRuleForUrl.ready) {
      injectRuleScript(activeRuleForUrl, currentUrl);
      return;
    }

    beginReadinessPolling(activeRuleForUrl, currentUrl);
  }, [beginReadinessPolling, currentUrl, injectRuleScript, rules]);

  const handleMessage = React.useCallback(
    (messageData: string) => {
      let parsedMessage: unknown;

      try {
        parsedMessage = JSON.parse(messageData);
      } catch {
        return false;
      }

      if (!isWebViewInjectionInternalMessage(parsedMessage)) {
        return false;
      }

      const {payload} = parsedMessage;
      const pendingRuleKey = pendingReadyRuleKeyRef.current;
      const matchedRule = resolveWebViewInjectionRule(payload.url, rules);
      const activePendingRule =
        matchedRule && matchedRule.id === payload.ruleId ? matchedRule : null;
      const messageRuleKey = activePendingRule
        ? buildRuleKey(activePendingRule, payload.url)
        : null;

      if (!payload.ready || !messageRuleKey || pendingRuleKey !== messageRuleKey) {
        return true;
      }

      const readyRule = activePendingRule;

      if (!readyRule) {
        return true;
      }

      clearReadinessTimer();
      injectRuleScript(readyRule, payload.url);
      return true;
    },
    [clearReadinessTimer, injectRuleScript, rules],
  );

  React.useEffect(() => {
    return () => {
      clearReadinessTimer();
    };
  }, [clearReadinessTimer]);

  return {
    activeRule,
    activeScript,
    currentUrl,
    handleMessage,
    onLoadEnd,
    onNavigationStateChange,
  };
};
