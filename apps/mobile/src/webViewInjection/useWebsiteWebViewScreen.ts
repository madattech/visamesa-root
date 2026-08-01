import {ComponentProps, RefObject, useCallback, useMemo, useRef} from 'react';
import {RouteProp} from '@react-navigation/native';
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

  const {
    handleMessage: handleInjectionMessage,
    onLoadEnd,
    onNavigationStateChange,
  } = useWebViewInjection(webViewRef, {
    initialUrl: startUrl,
    rules: injectionRules,
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
