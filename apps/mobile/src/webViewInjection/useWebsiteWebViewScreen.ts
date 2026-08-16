import {ComponentProps, RefObject, useCallback, useMemo, useRef, useState} from 'react';
import {RouteProp} from '@react-navigation/native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';

import {RootStackParamList} from '@/navigation/types';
import {
  reportClientError,
  sanitizeUrlForReport,
  toNumericContextValue,
} from '@/services/clientErrorService';
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
import {
  useWebViewInjection,
  type WebViewReadinessTimeoutPayload,
} from '@/webViewInjection/useWebViewInjection';
import type {WebViewInjectionRule} from '@/webViewInjection/scriptRegistry';
import {
  buildCitaPreviaWebViewSource,
  buildEmpadronamientoWebViewSource,
} from '@/webViewInjection/webViewDefaults';

type WebsiteWebViewRoute = RouteProp<RootStackParamList, 'WebsiteWebView'>;

type WebViewHandle = React.ElementRef<typeof WebView>;
type WebViewProps = ComponentProps<typeof WebView>;

export type AutomationResultStatus =
  | 'no-appointments'
  | 'session-expired'
  | 'access-blocked'
  | 'service-unavailable';

export type AutomationResult = {
  automation: 'cita-previa' | 'empadronamiento';
  status: AutomationResultStatus;
  detectedText?: string;
};

export type AutomationWebViewError = {
  title: string;
  message: string;
  detail?: string;
};

const buildAutomationResultMonitorScript = (
  automation: 'cita-previa' | 'empadronamiento',
) => `
  (function() {
    if (window.__visaMesaAutomationResultMonitorInstalled) {
      return true;
    }
    window.__visaMesaAutomationResultMonitorInstalled = true;

    var automation = ${JSON.stringify(automation)};
    var resultGroups = [
      {
        status: 'session-expired',
        patterns: [
          'sesion caducada',
          'session expired',
          'su sesion ha caducado',
          'la sesion ha expirado',
          'tiempo de sesion agotado',
        ],
      },
      {
        status: 'access-blocked',
        patterns: [
          'captcha',
          'no soy un robot',
          'access denied',
          'acceso denegado',
          'forbidden',
          'demasiadas solicitudes',
          'too many requests',
        ],
      },
      {
        status: 'service-unavailable',
        patterns: [
          'servicio no disponible',
          'service unavailable',
          'temporalmente no disponible',
          'error interno',
          'internal server error',
          'mantenimiento',
        ],
      },
    ];

    if (automation === 'cita-previa') {
      resultGroups.unshift({
        status: 'no-appointments',
        patterns: [
          'no hay citas disponibles',
          'no existen citas disponibles',
          'en este momento no hay citas',
          'en este momento no existen citas',
          'no hay citas previas disponibles',
          'no existe disponibilidad',
        ],
      });
    }

    function normalize(value) {
      return String(value || '')
        .normalize('NFD')
        .replace(/[\\u0300-\\u036f]/g, '')
        .replace(/\\s+/g, ' ')
        .toLowerCase();
    }

    function postResult(status, detectedText) {
      if (window.__visaMesaAutomationResultPosted) {
        return;
      }
      window.__visaMesaAutomationResultPosted = true;

      try {
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
          __visaMesaAutomationResult: true,
          type: 'automation-result',
          payload: {
            automation: automation,
            status: status,
            detectedText: detectedText,
          },
        }));
      } catch (error) {}
    }

    function inspect() {
      var bodyText = normalize(document.body && document.body.innerText);
      if (!bodyText) {
        return false;
      }

      for (var groupIndex = 0; groupIndex < resultGroups.length; groupIndex += 1) {
        var group = resultGroups[groupIndex];
        var matched = group.patterns.find(function(pattern) {
          return bodyText.indexOf(pattern) !== -1;
        });

        if (matched) {
          postResult(group.status, matched);
          return true;
        }
      }

      return false;
    }

    if (inspect()) {
      return true;
    }

    var target = document.documentElement || document.body;
    if (target && typeof MutationObserver !== 'undefined') {
      var observer = new MutationObserver(function() {
        if (inspect()) {
          observer.disconnect();
        }
      });
      observer.observe(target, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return true;
  })();
  true;
`;

function isAutomationResultMessage(value: unknown): value is {
  __visaMesaAutomationResult: true;
  type: 'automation-result';
  payload: AutomationResult;
} {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const maybeMessage = value as {
    __visaMesaAutomationResult?: unknown;
    type?: unknown;
    payload?: Partial<AutomationResult>;
  };

  return (
    maybeMessage.__visaMesaAutomationResult === true &&
    maybeMessage.type === 'automation-result' &&
    (maybeMessage.payload?.automation === 'cita-previa' ||
      maybeMessage.payload?.automation === 'empadronamiento') &&
    (maybeMessage.payload?.status === 'no-appointments' ||
      maybeMessage.payload?.status === 'session-expired' ||
      maybeMessage.payload?.status === 'access-blocked' ||
      maybeMessage.payload?.status === 'service-unavailable')
  );
}

export type UseWebsiteWebViewScreenResult = {
  webViewRef: RefObject<WebViewHandle | null>;
  automation: 'cita-previa' | 'empadronamiento';
  startUrl: string;
  webViewSource: ReturnType<typeof buildCitaPreviaWebViewSource>;
  injectedJavaScript?: string;
  activeRule: WebViewInjectionRule | null;
  automationResult: AutomationResult | null;
  webViewError: AutomationWebViewError | null;
  currentUrl: string | null;
  onLoadEnd: () => void;
  onNavigationStateChange: ReturnType<
    typeof useWebViewInjection
  >['onNavigationStateChange'];
  onMessage: (event: WebViewMessageEvent) => void;
  onError: NonNullable<WebViewProps['onError']>;
  onHttpError: NonNullable<WebViewProps['onHttpError']>;
};

export function useWebsiteWebViewScreen(
  route: WebsiteWebViewRoute,
): UseWebsiteWebViewScreenResult {
  const automation = route.params?.automation ?? 'cita-previa';
  const webViewRef = useRef<WebViewHandle>(null);
  const [automationResult, setAutomationResult] = useState<AutomationResult | null>(null);
  const [webViewError, setWebViewError] = useState<AutomationWebViewError | null>(null);

  const startUrl =
    route.params?.url ??
    (automation === 'empadronamiento'
      ? EMPADRONAMIENTO_HOME_URL
      : CITA_PREVIA_START_URL);

  const webViewSource = useMemo(
    () =>
      automation === 'empadronamiento'
        ? buildEmpadronamientoWebViewSource(startUrl)
        : buildCitaPreviaWebViewSource(startUrl),
    [automation, startUrl],
  );

  const injectedJavaScript = useMemo(
    () => buildAutomationResultMonitorScript(automation),
    [automation],
  );

  const injectionRules = useMemo(
    () =>
      automation === 'empadronamiento'
        ? buildEmpadronamientoInjectionRules(empadronamientoPiiConfig)
        : buildCitaPreviaInjectionRules(citaPreviaPiiConfig),
    [automation],
  );

  const onReadinessTimeout = useCallback(
    (payload: WebViewReadinessTimeoutPayload) => {
      reportClientError('WEBVIEW_INJECTION_TIMEOUT', {
        automation,
        ruleId: payload.ruleId,
        url: sanitizeUrlForReport(payload.url),
        selector: payload.selector,
        timeoutMs: payload.timeoutMs,
      });
    },
    [automation],
  );

  const {
    activeRule,
    currentUrl,
    handleMessage: handleInjectionMessage,
    onLoadEnd,
    onNavigationStateChange,
  } = useWebViewInjection(webViewRef, {
    initialUrl: startUrl,
    rules: injectionRules,
    onReadinessTimeout,
  });

  const onMessage = useCallback(
    (event: WebViewMessageEvent) => {
      if (handleInjectionMessage(event.nativeEvent.data)) {
        return;
      }

      try {
        const message = JSON.parse(event.nativeEvent.data);

        if (isAutomationResultMessage(message)) {
          setAutomationResult(message.payload);
          return;
        }

        if (message.type === 'debug') {
          console.debug('[WebView debug]', message.data);
        }
      } catch {
        // Ignore non-JSON messages from the page.
      }
    },
    [handleInjectionMessage],
  );

  const onError = useCallback<NonNullable<WebViewProps['onError']>>(
    syntheticEvent => {
      console.warn('[WebView] Load error', {
        automation,
        requestedUrl: startUrl,
        ...syntheticEvent.nativeEvent,
      });

      setWebViewError({
        title: 'Automation could not continue',
        message:
          'The official website could not be loaded. You can return to the dashboard and try again later.',
        detail: syntheticEvent.nativeEvent.description?.slice(0, 200),
      });

      reportClientError('WEBVIEW_LOAD_FAILED', {
        automation,
        url: sanitizeUrlForReport(
          syntheticEvent.nativeEvent.url ?? startUrl,
        ),
        code: toNumericContextValue(syntheticEvent.nativeEvent.code),
        description: syntheticEvent.nativeEvent.description?.slice(0, 200) ?? null,
      });
    },
    [automation, startUrl],
  );

  const onHttpError = useCallback<NonNullable<WebViewProps['onHttpError']>>(
    syntheticEvent => {
      console.warn('[WebView] HTTP error', {
        automation,
        requestedUrl: startUrl,
        ...syntheticEvent.nativeEvent,
      });

      setWebViewError({
        title: 'Official website error',
        message:
          'The official website returned an error. You can return to the dashboard and try again later.',
        detail: syntheticEvent.nativeEvent.statusCode
          ? `HTTP ${syntheticEvent.nativeEvent.statusCode}`
          : undefined,
      });

      reportClientError('WEBVIEW_HTTP_ERROR', {
        automation,
        url: sanitizeUrlForReport(
          syntheticEvent.nativeEvent.url ?? startUrl,
        ),
        statusCode: toNumericContextValue(
          syntheticEvent.nativeEvent.statusCode,
        ),
      });
    },
    [automation, startUrl],
  );

  return {
    webViewRef,
    automation,
    startUrl,
    webViewSource,
    injectedJavaScript,
    activeRule,
    automationResult,
    webViewError,
    currentUrl,
    onLoadEnd,
    onNavigationStateChange,
    onMessage,
    onError,
    onHttpError,
  };
}
