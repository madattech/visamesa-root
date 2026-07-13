import i18n, { type InitOptions } from 'i18next'
import { initReactI18next } from 'react-i18next'

import {
  createI18nResources,
  DEFAULT_NAMESPACE,
  I18N_NAMESPACES,
} from './resources'
import { DEFAULT_LANGUAGE, type SupportedLanguage } from './types'

export type CreateI18nOptions = {
  language: SupportedLanguage
  initOptions?: InitOptions
}

let initialized = false

export function createI18nInstance(options: CreateI18nOptions) {
  const instance = i18n.createInstance()

  void instance.use(initReactI18next).init({
    lng: options.language,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: ['en', 'es', 'zh'],
    defaultNS: DEFAULT_NAMESPACE,
    ns: I18N_NAMESPACES,
    resources: createI18nResources(),
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
    ...options.initOptions,
  })

  return instance
}

export async function initSharedI18n(options: CreateI18nOptions) {
  if (initialized) {
    await i18n.changeLanguage(options.language)
    return i18n
  }

  await i18n.use(initReactI18next).init({
    lng: options.language,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: ['en', 'es', 'zh'],
    defaultNS: DEFAULT_NAMESPACE,
    ns: I18N_NAMESPACES,
    resources: createI18nResources(),
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
    ...options.initOptions,
  })

  initialized = true
  return i18n
}

export { i18n }
