export {
  detectLanguageFromNavigator,
  detectLanguageFromStorage,
  detectLanguageFromStorageAsync,
  resolveInitialLanguage,
} from './detectLanguage'
export { formatCurrency, formatDate, toIntlLocale } from './formatting'
export { createI18nInstance, initSharedI18n, i18n } from './init'
export {
  createI18nResources,
  DEFAULT_NAMESPACE,
  getFallbackLanguage,
  I18N_NAMESPACES,
  translationResources,
  type TranslationResources,
} from './resources'
export {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  LANGUAGE_NAMES,
  LANGUAGE_NATIVE_NAMES,
  LOCALE_OG_MAP,
  LOCALE_STORAGE_KEY,
  localizedPath,
  normalizeLanguageTag,
  stripLocaleFromPath,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
  type TranslationNamespace,
} from './types'
export { useTranslation, Trans, type TFunction } from './useTranslation'
