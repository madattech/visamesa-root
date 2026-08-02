import { isAxiosError } from 'axios'
import { i18n } from '@visamesa/content/i18n'
import { resolveApiErrorMessage } from '@visamesa/content/apiErrors'

type ApiErrorPayload = {
  error?: string
  message?: string
  code?: string
}

function parseFallbackKey(
  fallbackKey: string,
): { key: string; ns: string } {
  if (fallbackKey.includes(':')) {
    const [ns, key] = fallbackKey.split(':')
    return { ns, key }
  }

  return { ns: 'common', key: fallbackKey }
}

function translateApiError(
  key: string,
  options?: { ns?: string },
): string {
  return i18n.t(key as never, {ns: options?.ns ?? 'common'})
}

export function getAxiosApiErrorMessage(
  error: unknown,
  fallbackKey = 'errors.generic',
): string {
  const fallback = parseFallbackKey(fallbackKey)

  if (isAxiosError(error)) {
    const payload = error.response?.data as ApiErrorPayload | undefined

    if (error.message === 'Network Error') {
      return i18n.t('networkCannotReachServer', { ns: 'auth' })
    }

    return resolveApiErrorMessage(
      {
        code: payload?.code,
        message: payload?.error ?? payload?.message,
      },
      translateApiError,
      fallback.key,
      fallback.ns,
    )
  }

  if (error instanceof Error) {
    return error.message
  }

  return translateApiError(fallback.key, { ns: fallback.ns })
}
