import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  LOCALE_STORAGE_KEY,
  normalizeLanguageTag,
  type SupportedLanguage,
} from '@visamesa/content/i18n'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useTranslation } from 'react-i18next'

type LocaleContextValue = {
  locale: SupportedLanguage
  changeLocale: (nextLocale: SupportedLanguage) => Promise<void>
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

async function writeStoredLocale(locale: SupportedLanguage) {
  await AsyncStorage.setItem(LOCALE_STORAGE_KEY, locale)
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()
  const [locale, setLocale] = useState<SupportedLanguage>(() =>
    normalizeLanguageTag(i18n.language),
  )

  useEffect(() => {
    const syncLocale = (nextLanguage: string) => {
      setLocale(normalizeLanguageTag(nextLanguage))
    }

    i18n.on('languageChanged', syncLocale)

    return () => {
      i18n.off('languageChanged', syncLocale)
    }
  }, [i18n])

  const changeLocale = useCallback(
    async (nextLocale: SupportedLanguage) => {
      const normalized = normalizeLanguageTag(nextLocale)

      if (normalized === normalizeLanguageTag(i18n.language)) {
        return
      }

      await writeStoredLocale(normalized)
      await i18n.changeLanguage(normalized)
    },
    [i18n],
  )

  const value = useMemo(
    () => ({
      locale,
      changeLocale,
    }),
    [changeLocale, locale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useAppLocale() {
  const context = useContext(LocaleContext)

  if (!context) {
    throw new Error('useAppLocale must be used within LocaleProvider')
  }

  return context
}
