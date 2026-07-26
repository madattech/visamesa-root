export type TieMarketingStep = {
  id: number
  title: string
  description: string
}

export type TieStepFaq = {
  question: string
  answer: string
}

function isTieMarketingStep(value: unknown): value is TieMarketingStep {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const step = value as TieMarketingStep

  return (
    typeof step.id === 'number' &&
    typeof step.title === 'string' &&
    typeof step.description === 'string'
  )
}

function isTieStepFaq(value: unknown): value is TieStepFaq {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const faq = value as TieStepFaq

  return typeof faq.question === 'string' && typeof faq.answer === 'string'
}

export function parseTieMarketingSteps(value: unknown): TieMarketingStep[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter(isTieMarketingStep)
}

export function parseTieStepFaqs(value: unknown): TieStepFaq[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter(isTieStepFaq)
}
