import type { CommonQuestion } from '../tieSteps/types.js'

import type { SupportProgressSnapshot, SupportStepSummary } from './types.js'

type ResolveSupportFaqsOptions = {
  isAuthenticated: boolean
  progress: SupportProgressSnapshot | null
  steps: SupportStepSummary[]
}

export function resolveSupportFaqs(
  genericFaqs: CommonQuestion[],
  { isAuthenticated, progress, steps }: ResolveSupportFaqsOptions,
): CommonQuestion[] {
  if (isAuthenticated && progress && steps.length > 0) {
    const currentStep = steps.find((step) => step.id === progress.currentStepId)
    const stepFaqs = currentStep?.commonQuestions ?? []

    if (stepFaqs.length > 0) {
      return stepFaqs
    }
  }

  return genericFaqs
}
