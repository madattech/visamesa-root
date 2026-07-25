import type {i18n as I18nInstance} from 'i18next';

import type {ProcessOverviewTranslateFn} from './types';

export function createProcessOverviewTranslator(
  instance: Pick<I18nInstance, 't'>,
): ProcessOverviewTranslateFn {
  return (key, options) =>
    instance.t(key, {...(options ?? {}), ns: 'processOverview'} as never) as
      | string
      | unknown;
}
