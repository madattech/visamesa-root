import { getStepSlugById } from '../tieSteps/manifest.js'
import { TIE_STEP_ORDER, type TieStepSlug } from '../tieSteps/types.js'

import { SUPPORT_TOTAL_STEPS } from './constants.js'
import type {
  SupportContext,
  SupportContextRequirement,
  SupportPlatform,
  SupportProgressSnapshot,
  SupportStepSummary,
} from './types.js'
import { normalizeSupportEmail } from './validateSupportEmail.js'

type BuildAuthenticatedSupportContextInput = {
  userId: string
  email: string
  progress: SupportProgressSnapshot | null
  steps: SupportStepSummary[]
  language: string
  appVersion: string
  platform: SupportPlatform
  osVersion?: string
}

export function buildAuthenticatedSupportContext(
  input: BuildAuthenticatedSupportContextInput,
): SupportContext {
  const currentStepId = input.progress?.currentStepId ?? null
  const currentStepSlug = currentStepId ? getStepSlugById(currentStepId) ?? null : null
  const currentStep = input.steps.find((step) => step.id === currentStepId)
  const completedSteps = getCompletedStepSlugs(input.progress)

  return {
    userId: input.userId,
    email: input.email,
    currentStepSlug,
    currentStepTitle: currentStep?.title ?? null,
    currentStepId,
    completedSteps,
    completedStepCount: completedSteps.length,
    totalSteps: SUPPORT_TOTAL_STEPS,
    currentStepRequirements: buildCurrentStepRequirements(input.progress, currentStep),
    language: input.language,
    appVersion: input.appVersion,
    platform: input.platform,
    osVersion: input.osVersion,
  }
}

export function buildGuestSupportContext(input: {
  email: string
  language: string
  appVersion: string
  platform: SupportPlatform
  osVersion?: string
}): SupportContext {
  return {
    email: normalizeSupportEmail(input.email),
    currentStepSlug: null,
    currentStepTitle: null,
    currentStepId: null,
    completedSteps: [],
    completedStepCount: 0,
    totalSteps: SUPPORT_TOTAL_STEPS,
    currentStepRequirements: [],
    language: input.language,
    appVersion: input.appVersion,
    platform: input.platform,
    osVersion: input.osVersion,
  }
}

export function buildWebGuestSupportContext(language: string, osVersion?: string): SupportContext {
  return buildGuestSupportContext({
    email: '',
    language,
    appVersion: 'web',
    platform: 'web',
    osVersion,
  })
}

function getCompletedStepSlugs(progress: SupportProgressSnapshot | null): TieStepSlug[] {
  if (!progress) {
    return []
  }

  return progress.steps
    .filter((step) => step.status === 'completed')
    .map((step) => getStepSlugById(step.stepId))
    .filter((slug): slug is TieStepSlug => slug !== undefined)
}

function buildCurrentStepRequirements(
  progress: SupportProgressSnapshot | null,
  currentStep: SupportStepSummary | undefined,
): SupportContextRequirement[] {
  if (!progress || !currentStep) {
    return []
  }

  const stepProgress = progress.steps.find((step) => step.stepId === currentStep.id)

  if (!stepProgress) {
    return []
  }

  return currentStep.requirements.map((requirement) => ({
    key: requirement.key,
    label: requirement.label,
    completed: stepProgress.requirements[requirement.key]?.completed ?? false,
  }))
}

/** Ensures tie step order is exported for consumers that need step count metadata. */
export { TIE_STEP_ORDER }
