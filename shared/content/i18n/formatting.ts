import { DEFAULT_LANGUAGE, type SupportedLanguage } from './types'

const LOCALE_TAG: Record<SupportedLanguage, string> = {
  en: 'en-GB',
  es: 'es-ES',
  zh: 'zh-CN',
}

export function toIntlLocale(locale: SupportedLanguage): string {
  return LOCALE_TAG[locale] ?? LOCALE_TAG[DEFAULT_LANGUAGE]
}

export function formatCurrency(
  amountInCents: number,
  locale: SupportedLanguage,
  currency = 'EUR',
): string {
  return new Intl.NumberFormat(toIntlLocale(locale), {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amountInCents / 100)
}

export function formatDate(
  date: Date,
  locale: SupportedLanguage,
  options?: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(toIntlLocale(locale), options).format(date)
}
