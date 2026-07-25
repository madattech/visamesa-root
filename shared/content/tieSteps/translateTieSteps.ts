import type { i18n as I18nInstance } from 'i18next'

import type { TieStepsTranslateFn } from './buildTieSteps'

export function createTieStepsTranslator(
  instance: Pick<I18nInstance, 't'>,
): TieStepsTranslateFn {
  return (key, options) => instance.t(key, options as never) as string | unknown
}
