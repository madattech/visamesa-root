import {ComponentProps, RefObject, useCallback, useMemo, useRef, useState} from 'react';
import {RouteProp, useNavigation} from '@react-navigation/native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';

import {
  fetchUserProgress,
  updateRequirementProgress,
} from '@/features/dashboard/services/progressService';
import {
  saveGeneratedPdfBase64,
  openGeneratedPdf,
} from '@/features/pdfGeneration/services/pdfFileService';
import {RootStackParamList, WebViewAutomationKind} from '@/navigation/types';
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
  buildModelo790InjectionRules,
  MODELO_790_012_START_URL,
  modelo790PiiConfig,
} from '@/scripts/modelo-790-012';
import {useWebViewInjection, type WebViewReadinessTimeoutPayload} from '@/webViewInjection/useWebViewInjection';
import {
  buildCitaPreviaWebViewSource,
  buildEmpadronamientoWebViewSource,
  buildModelo790WebViewSource,
} from '@/webViewInjection/webViewDefaults';

type WebsiteWebViewRoute = RouteProp<RootStackParamList, 'WebsiteWebView'>;

type WebViewHandle = React.ElementRef<typeof WebView>;
type WebViewProps = ComponentProps<typeof WebView>;

export type AutomationWebViewError = {
  title: string;
  message: string;
  detail?: string;
};

type AutomationErrorMessage = {
  __visaMesaAutomationError: true;
  type: 'automation-error';
  payload: AutomationWebViewError;
};

type Modelo790PdfMessage = {
  __visaMesaModelo790Pdf: true;
  type: 'modelo-790-pdf';
  payload: {
    base64: string;
    fileName: string;
  };
};

async function completeFormFromRoute(
  formCompletion: WebsiteWebViewRoute['params']['formCompletion'] | undefined,
) {
  if (!formCompletion) {
    return;
  }

  const progress = await fetchUserProgress();
  await updateRequirementProgress(
    progress,
    formCompletion.stepId,
    formCompletion.requirementKey,
    {
      completed: true,
      source: {
        type: 'form',
        formId: formCompletion.formId,
        confirmedAt: new Date().toISOString(),
      },
    },
  );
}

function isAutomationErrorMessage(value: unknown): value is AutomationErrorMessage {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const maybeMessage = value as Partial<AutomationErrorMessage>;
  return (
    maybeMessage.__visaMesaAutomationError === true &&
    maybeMessage.type === 'automation-error' &&
    typeof maybeMessage.payload?.title === 'string' &&
    typeof maybeMessage.payload?.message === 'string'
  );
}

function isModelo790PdfMessage(value: unknown): value is Modelo790PdfMessage {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const maybeMessage = value as Partial<Modelo790PdfMessage>;
  return (
    maybeMessage.__visaMesaModelo790Pdf === true &&
    maybeMessage.type === 'modelo-790-pdf' &&
    typeof maybeMessage.payload?.base64 === 'string' &&
    typeof maybeMessage.payload?.fileName === 'string'
  );
}

export type UseWebsiteWebViewScreenResult = {
  webViewRef: RefObject<WebViewHandle | null>;
  automation: WebViewAutomationKind;
  startUrl: string;
  webViewSource: ReturnType<typeof buildCitaPreviaWebViewSource>;
  webViewError: AutomationWebViewError | null;
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
  const navigation = useNavigation();
  const webViewRef = useRef<WebViewHandle>(null);
  const [webViewError, setWebViewError] = useState<AutomationWebViewError | null>(null);

  const startUrl =
    route.params?.url ??
    (automation === 'empadronamiento'
      ? EMPADRONAMIENTO_HOME_URL
      : automation === 'modelo-790-012'
        ? MODELO_790_012_START_URL
        : CITA_PREVIA_START_URL);

  const webViewSource = useMemo(() => {
    if (automation === 'empadronamiento') {
      return buildEmpadronamientoWebViewSource(startUrl);
    }

    if (automation === 'modelo-790-012') {
      return buildModelo790WebViewSource(startUrl);
    }

    return buildCitaPreviaWebViewSource(startUrl);
  }, [automation, startUrl]);

  const injectionRules = useMemo(() => {
    if (automation === 'empadronamiento') {
      return buildEmpadronamientoInjectionRules(empadronamientoPiiConfig);
    }

    if (automation === 'modelo-790-012') {
      return buildModelo790InjectionRules(modelo790PiiConfig);
    }

    return buildCitaPreviaInjectionRules(citaPreviaPiiConfig);
  }, [automation]);

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

        if (isAutomationErrorMessage(message)) {
          setWebViewError(message.payload);
          return;
        }

        if (isModelo790PdfMessage(message)) {
          saveGeneratedPdfBase64(
            message.payload.base64,
            message.payload.fileName,
          )
            .then(async file => {
              await openGeneratedPdf(file);
              await completeFormFromRoute(route.params?.formCompletion);
              navigation.goBack();
            })
            .catch(error => {
              console.warn('[WebView] Modelo 790 PDF open failed', error);
              setWebViewError({
                title: 'Modelo 790 could not be opened',
                message:
                  'The PDF was generated, but the app could not save or open it. Please go back to the dashboard and try again.',
                detail: error instanceof Error ? error.message : undefined,
              });
            });
          return;
        }

        if (message.type === 'debug') {
          console.debug('[WebView debug]', message.data);
        }
      } catch {
        // Ignore non-JSON messages from the page.
      }
    },
    [handleInjectionMessage, navigation, route.params?.formCompletion],
  );

  const onError = useCallback<NonNullable<WebViewProps['onError']>>(
    syntheticEvent => {
      console.warn('[WebView] Load error', {
        automation,
        requestedUrl: startUrl,
        ...syntheticEvent.nativeEvent,
      });

      setWebViewError({
        title: 'Official website could not be loaded',
        message:
          'The official website could not be loaded. Please go back to the dashboard and try again later.',
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
          'The official website returned an error. Please go back to the dashboard and try again later.',
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
    webViewError,
    onLoadEnd,
    onNavigationStateChange,
    onMessage,
    onError,
    onHttpError,
  };
}
