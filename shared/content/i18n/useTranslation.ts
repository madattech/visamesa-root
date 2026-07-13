import {
  useTranslation as useI18nextTranslation,
  type UseTranslationOptions,
  type UseTranslationResponse,
} from 'react-i18next'

import type { TranslationNamespace } from './types'

export function useTranslation<NS extends TranslationNamespace | readonly TranslationNamespace[]>(
  ns?: NS,
  options?: UseTranslationOptions<NS extends readonly TranslationNamespace[] ? NS[number] : NS>,
): UseTranslationResponse<
  NS extends readonly TranslationNamespace[] ? NS[number] : NS extends TranslationNamespace ? NS : 'common',
  undefined
> {
  return useI18nextTranslation(ns, options)
}

export { Trans } from 'react-i18next'
export type { TFunction } from 'i18next'
