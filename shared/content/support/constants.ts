import { TIE_STEP_ORDER } from '../tieSteps/types.js'

/** Minimum support message length — keep in sync with visamesa_be support.schema.ts */
export const MIN_SUPPORT_MESSAGE_LENGTH = 10

export const MAX_SUPPORT_MESSAGE_LENGTH = 5000

export const SUPPORT_WEB_APP_VERSION = 'web'

export const SUPPORT_TOTAL_STEPS = TIE_STEP_ORDER.length
