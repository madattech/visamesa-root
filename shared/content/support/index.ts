export {
  MIN_SUPPORT_MESSAGE_LENGTH,
  MAX_SUPPORT_MESSAGE_LENGTH,
  SUPPORT_TOTAL_STEPS,
  SUPPORT_WEB_APP_VERSION,
} from './constants.js'
export {
  buildAuthenticatedSupportContext,
  buildGuestSupportContext,
  buildWebGuestSupportContext,
} from './buildSupportContext.js'
export { resolveSupportFaqs } from './resolveSupportFaqs.js'
export {
  isValidSupportEmail,
  normalizeSupportEmail,
} from './validateSupportEmail.js'
export type {
  AuthenticatedSupportTicketInput,
  PublicSupportTicketInput,
  SupportContext,
  SupportContextRequirement,
  SupportPlatform,
  SupportProgressSnapshot,
  SupportStepSummary,
  SupportTicketResponse,
} from './types.js'
