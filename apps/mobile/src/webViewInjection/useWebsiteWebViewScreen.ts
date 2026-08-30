import {ComponentProps, RefObject, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {RouteProp} from '@react-navigation/native';
import WebView, {WebViewMessageEvent} from 'react-native-webview';

import {useAuth} from '@/contexts/AuthContext';
import {BookingAssistantId} from '@/features/home/types/TieStepDetail';
import {loadBookingAssistantInjectionProfiles} from '@/features/profile/services/profileService';
import {RootStackParamList} from '@/navigation/types';
import {
  emptyCitaPreviaBookingAssistantProfile,
  emptyEmpadronamientoBookingAssistantProfile,
} from '@/scripts/bookingAssistantProfile';
import {
  reportClientError,
  sanitizeUrlForReport,
  toNumericContextValue,
} from '@/services/clientErrorService';
import {
  buildCitaPreviaInjectionRules,
  CITA_PREVIA_START_URL,
} from '@/scripts/cita-previa';
import {
  buildEmpadronamientoInjectionRules,
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
  bookingAssistant: BookingAssistantId;
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
  const bookingAssistant = route.params?.bookingAssistant ?? 'cita-previa';
  const {user} = useAuth();
  const webViewRef = useRef<WebViewHandle>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [empadronamientoProfile, setEmpadronamientoProfile] = useState(
    emptyEmpadronamientoBookingAssistantProfile,
  );
  const [citaPreviaProfile, setCitaPreviaProfile] = useState(
    emptyCitaPreviaBookingAssistantProfile,
  );

  useEffect(() => {
    let cancelled = false;

    loadBookingAssistantInjectionProfiles(user?.email)
      .then(loaded => {
        if (cancelled) {
          return;
        }

        if (loaded?.empadronamiento) {
          setEmpadronamientoProfile(loaded.empadronamiento);
        }

        if (loaded?.citaPrevia) {
          setCitaPreviaProfile(loaded.citaPrevia);
        }

        setProfileLoaded(true);
      })
      .catch(() => {
        if (!cancelled) {
          setProfileLoaded(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  const startUrl =
    route.params?.url ??
    (bookingAssistant === 'empadronamiento'
      ? EMPADRONAMIENTO_HOME_URL
      : CITA_PREVIA_START_URL);

  const webViewSource = useMemo(
    () =>
      bookingAssistant === 'empadronamiento'
        ? buildEmpadronamientoWebViewSource(startUrl)
        : buildCitaPreviaWebViewSource(startUrl),
    [bookingAssistant, startUrl],
  );

  const injectionRules = useMemo(
    () => {
      if (!profileLoaded) {
        return [];
      }

      return bookingAssistant === 'empadronamiento'
        ? buildEmpadronamientoInjectionRules(empadronamientoProfile)
        : buildCitaPreviaInjectionRules(citaPreviaProfile);
    },
    [
      bookingAssistant,
      citaPreviaProfile,
      empadronamientoProfile,
      profileLoaded,
    ],
  );

  const onReadinessTimeout = useCallback(
    (payload: WebViewReadinessTimeoutPayload) => {
      reportClientError('WEBVIEW_INJECTION_TIMEOUT', {
        bookingAssistant,
        ruleId: payload.ruleId,
        url: sanitizeUrlForReport(payload.url),
        selector: payload.selector,
        timeoutMs: payload.timeoutMs,
      });
    },
    [bookingAssistant],
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
        bookingAssistant,
        requestedUrl: startUrl,
        ...syntheticEvent.nativeEvent,
      });

      reportClientError('WEBVIEW_LOAD_FAILED', {
        bookingAssistant,
        url: sanitizeUrlForReport(
          syntheticEvent.nativeEvent.url ?? startUrl,
        ),
        code: toNumericContextValue(syntheticEvent.nativeEvent.code),
        description: syntheticEvent.nativeEvent.description?.slice(0, 200) ?? null,
      });
    },
    [bookingAssistant, startUrl],
  );

  const onHttpError = useCallback<NonNullable<WebViewProps['onHttpError']>>(
    syntheticEvent => {
      console.warn('[WebView] HTTP error', {
        bookingAssistant,
        requestedUrl: startUrl,
        ...syntheticEvent.nativeEvent,
      });

      reportClientError('WEBVIEW_HTTP_ERROR', {
        bookingAssistant,
        url: sanitizeUrlForReport(
          syntheticEvent.nativeEvent.url ?? startUrl,
        ),
        statusCode: toNumericContextValue(
          syntheticEvent.nativeEvent.statusCode,
        ),
      });
    },
    [bookingAssistant, startUrl],
  );

  return {
    webViewRef,
    bookingAssistant,
    startUrl,
    webViewSource,
    onLoadEnd,
    onNavigationStateChange,
    onMessage,
    onError,
    onHttpError,
  };
}
