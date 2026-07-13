export const TIE_STEP_ORDER = [
  'empadronamiento',
  'toma-de-huellas',
  'required-documents',
  'pay-fee',
  'fingerprint-appointment',
  'collect-tie',
] as const

export type TieStepSlug = (typeof TIE_STEP_ORDER)[number]

export type AutomationId = 'empadronamiento' | 'cita-previa'

export type RequirementType = 'automation' | 'form' | 'self_declared'

export type RequirementManifest = {
  key: string
  type: RequirementType
  automationId?: AutomationId
  formId?: string
  referencesStepSlug?: TieStepSlug
  link?: {
    url: string
  }
}

export type TieStepManifestEntry = {
  id: number
  slug: TieStepSlug
  officialLinkUrls: string[]
  requirements: RequirementManifest[]
}

export type OfficialLink = {
  label: string
  url: string
}

export type Requirement = {
  key: string
  label: string
  description?: string
  link?: OfficialLink
  type: RequirementType
  automationId?: AutomationId
  formId?: string
  referencesStepId?: number
}

export type EstimatedTimeItem = {
  label: string
  value: string
}

export type CommonQuestion = {
  question: string
  answer: string
}

export type StepCta = {
  start: string
  complete: string
}

export type TieStepDetail = {
  id: number
  slug: TieStepSlug
  title: string
  short: string
  description: string
  estimatedTime: EstimatedTimeItem[]
  officialLinks: OfficialLink[]
  whyItExists: string
  commonQuestions: CommonQuestion[]
  requirements: Requirement[]
  cta: StepCta
  completionPrompt: string
}

export type TieStepTranslation = {
  title: string
  short: string
  description: string
  whyItExists: string
  completionPrompt: string
  cta: StepCta
  estimatedTime: EstimatedTimeItem[]
  officialLinks: Array<{ label: string }>
  commonQuestions: CommonQuestion[]
  requirements: Record<
    string,
    {
      label: string
      description?: string
      link?: { label: string }
    }
  >
}
