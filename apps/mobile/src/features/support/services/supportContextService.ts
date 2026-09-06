import { Platform } from 'react-native'
import { DEFAULT_LANGUAGE, i18n } from '@visamesa/content/i18n'
import {
  buildAuthenticatedSupportContext,
  buildGuestSupportContext,
  isValidSupportEmail,
  normalizeSupportEmail,
  type SupportContext,
  type SupportPlatform,
} from '@visamesa/content/support'

import type { TieStepDetail } from '@/features/home/types/TieStepDetail'
import type { UserProgress } from '@/features/dashboard/types/UserProgress'

const APP_VERSION = '1.0.0'

export { isValidSupportEmail, normalizeSupportEmail }
export type { SupportContext }

export function buildSupportContext(
  userId: string,
  email: string,
  progress: UserProgress | null,
  steps: TieStepDetail[],
): SupportContext {
  return buildAuthenticatedSupportContext({
    userId,
    email,
    progress,
    steps,
    language: i18n.language ?? DEFAULT_LANGUAGE,
    appVersion: APP_VERSION,
    platform: Platform.OS as SupportPlatform,
    osVersion: String(Platform.Version),
  })
}

export function buildGuestSupportContextFromEmail(email: string): SupportContext {
  return buildGuestSupportContext({
    email,
    language: i18n.language ?? DEFAULT_LANGUAGE,
    appVersion: APP_VERSION,
    platform: Platform.OS as SupportPlatform,
    osVersion: String(Platform.Version),
  })
}

export function formatContextForDisplay(
  context: SupportContext,
  t: (key: string, options?: Record<string, unknown>) => string,
): Array<{ label: string; value: string }> {
  const items: Array<{ label: string; value: string }> = []

  if (context.currentStepId != null) {
    items.push({
      label: t('support:contextCurrentStep'),
      value: `${context.currentStepTitle ?? t('support:noStepContext')} (${context.currentStepId}/${context.totalSteps})`,
    })
  }

  items.push({
    label: t('support:contextLanguage'),
    value: (context.language ?? DEFAULT_LANGUAGE).toUpperCase(),
  })

  items.push({
    label: t('support:contextAppVersion'),
    value: context.appVersion ?? APP_VERSION,
  })

  items.push({
    label: t('support:contextDevice'),
    value: `${context.platform === 'ios' ? 'iOS' : context.platform === 'android' ? 'Android' : 'Web'} ${context.osVersion ?? ''}`.trim(),
  })

  return items
}
