import AsyncStorage from '@react-native-async-storage/async-storage';
import {isAxiosError} from 'axios';
import {Platform} from 'react-native';
import {STORAGE_KEYS} from '@visamesa/types';

import {API_ENDPOINTS} from '@/config/api';
import apiClient from '@/services/api';
import {
  type ClientErrorCode,
  type ClientErrorContext,
  type ClientErrorContextValue,
} from '@/services/clientErrorCodes';

export function sanitizeUrlForReport(url: string | null | undefined): string | null {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);
    const pathname =
      parsed.pathname.length > 120
        ? `${parsed.pathname.slice(0, 120)}…`
        : parsed.pathname;

    return `${parsed.hostname}${pathname}`;
  } catch {
    return url.length > 160 ? `${url.slice(0, 160)}…` : url;
  }
}

export function buildAxiosErrorContext(
  error: unknown,
): ClientErrorContext {
  if (isAxiosError(error)) {
    return {
      statusCode: error.response?.status ?? null,
      networkError: error.message === 'Network Error',
      method: error.config?.method ?? null,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message.slice(0, 200),
    };
  }

  return {};
}

function withPlatformContext(
  context?: ClientErrorContext,
): ClientErrorContext {
  return {
    platform: Platform.OS,
    ...context,
  };
}

export function reportClientError(
  code: ClientErrorCode,
  context?: ClientErrorContext,
): void {
  void (async () => {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

    if (!token) {
      return;
    }

    await apiClient.post(API_ENDPOINTS.clientErrors, {
      code,
      context: withPlatformContext(context),
      clientOccurredAt: new Date().toISOString(),
    });
  })().catch(() => {});
}

export function reportClientErrorFromException(
  code: ClientErrorCode,
  error: unknown,
  context?: ClientErrorContext,
): void {
  reportClientError(code, {
    ...buildAxiosErrorContext(error),
    ...context,
  });
}

export function toNumericContextValue(
  value: ClientErrorContextValue | undefined,
): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  return null;
}
