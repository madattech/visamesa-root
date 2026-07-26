export { buildTieSteps, type TieStepsTranslateFn } from './buildTieSteps'
export { parseTieMarketingSteps, parseTieStepFaqs, type TieMarketingStep, type TieStepFaq } from './marketingSteps'
export { createTieStepsTranslator } from './translateTieSteps'
export { EMPADRONAMIENTO_CERTIFICATE_VALIDITY_DAYS } from './constants'
export { isEmpadronamientoCertificateValid } from './empadronamiento'
export { getStepIdBySlug, getStepSlugById, tieStepManifest } from './manifest'
export {
  isTieStepSlug,
  TIE_STEP_ORDER,
  type AutomationId,
  type CommonQuestion,
  type EstimatedTimeItem,
  type OfficialLink,
  type PrintableItem,
  type Requirement,
  type RequirementLocation,
  type RequirementType,
  type StepCta,
  type TieStepDetail,
  type TieStepSlug,
  type TieStepTranslation,
} from './types'
