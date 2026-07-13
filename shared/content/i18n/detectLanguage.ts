import {
  DEFAULT_LANGUAGE,
  LOCALE_STORAGE_KEY,
  normalizeLanguageTag,
  type SupportedLanguage,
} from './types'

type LanguageStorage = {
  getItem(key: string): Promise<string | null> | string | null
}

export function detectLanguageFromStorage(
  storage?: LanguageStorage | null,
): SupportedLanguage | null {
  if (!storage) {
    return null
  }

  try {
    const stored = storage.getItem(LOCALE_STORAGE_KEY)
    if (stored instanceof Promise) {
      return null
    }

    return stored ? normalizeLanguageTag(stored) : null
  } catch {
    return null
  }
}

export async function detectLanguageFromStorageAsync(
  storage: LanguageStorage,
): Promise<SupportedLanguage | null> {
  try {
    const stored = await storage.getItem(LOCALE_STORAGE_KEY)
    return stored ? normalizeLanguageTag(stored) : null
  } catch {
    return null
  }
}

export function detectLanguageFromNavigator(
  extraLocales: Array<string | undefined | null> = [],
): SupportedLanguage {
  const candidates: string[] = []

  if (typeof navigator !== 'undefined') {
    if (navigator.languages?.length) {
      candidates.push(...navigator.languages)
    } else if (navigator.language) {
      candidates.push(navigator.language)
    }
  }

  candidates.push(...extraLocales.filter(Boolean) as string[])

  for (const language of candidates) {
    if (!language) {
      continue
    }

    const normalized = normalizeLanguageTag(language)
    const lowerLanguage = language.toLowerCase()

    if (normalized !== DEFAULT_LANGUAGE || lowerLanguage.startsWith('en')) {
      return normalized
    }
  }

  return DEFAULT_LANGUAGE
}

export function resolveInitialLanguage(options: {
  urlLocale?: string | null
  storedLocale?: string | null
  deviceLocale?: string | null
}): SupportedLanguage {
  if (options.urlLocale) {
    return normalizeLanguageTag(options.urlLocale)
  }

  if (options.storedLocale) {
    return normalizeLanguageTag(options.storedLocale)
  }

  if (options.deviceLocale) {
    return normalizeLanguageTag(options.deviceLocale)
  }

  return DEFAULT_LANGUAGE
}
