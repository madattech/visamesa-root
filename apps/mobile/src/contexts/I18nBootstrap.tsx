import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  detectLanguageFromNavigator,
  initSharedI18n,
  i18n,
  LOCALE_STORAGE_KEY,
  normalizeLanguageTag,
  type SupportedLanguage,
} from '@visamesa/content/i18n'
import React, { type ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'

import { getNativeDeviceLocales } from '@/utils/getNativeDeviceLocales'

type I18nBootstrapProps = {
  children: ReactNode
}

let bootstrapPromise: Promise<typeof i18n> | null = null

async function resolveInitialLocale(): Promise<SupportedLanguage> {
  try {
    const stored = await AsyncStorage.getItem(LOCALE_STORAGE_KEY)
    if (stored) {
      return normalizeLanguageTag(stored)
    }
  } catch {
    // Fall through to device locale.
  }

  return detectLanguageFromNavigator(getNativeDeviceLocales())
}

function ensureI18nBootstrapped() {
  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      const language = await resolveInitialLocale()
      return initSharedI18n({ language })
    })()
  }

  return bootstrapPromise
}

export function I18nBootstrap({ children }: I18nBootstrapProps) {
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false

    ensureI18nBootstrapped()
      .then(() => {
        if (!cancelled) {
          setReady(true)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setReady(true)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (!ready) {
    return null
  }

  return <I18nextProvider i18n={i18n as never}>{children}</I18nextProvider>
}
