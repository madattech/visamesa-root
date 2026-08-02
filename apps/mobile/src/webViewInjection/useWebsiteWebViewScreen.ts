import {ComponentProps, RefObject, useCallback, useMemo, useRef} from 'react';
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
import {useWebViewInjection, type WebViewReadinessTimeoutPayload} from '@/webViewInjection/useWebViewInjection';
import {
  buildCitaPreviaWebViewSource,
  buildEmpadronamientoWebViewSource,
} from '@/webViewInjection/webViewDefaults';

type WebsiteWebViewRoute = RouteProp<RootStackParamList, 'WebsiteWebView'>;

type WebViewHandle = React.ElementRef<typeof WebView>;
type WebViewProps = ComponentProps<typeof WebView>;

export type UseWebsiteWebViewScreenResult = {
  webViewRef: RefObject<WebViewHandle | null>;
  automation: 'cita-previa' | 'empadronamiento';
  startUrl: string;
  webViewSource: ReturnType<typeof buildCitaPreviaWebViewSource>;
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
    onLoadEnd,
    onNavigationStateChange,
    onMessage,
    onError,
    onHttpError,
  };
}
