import type { CommonQuestion, TieStepSlug } from '../tieSteps/types.js'

export type SupportPlatform = 'ios' | 'android' | 'web'

export type SupportContextRequirement = {
  key: string
  label: string
  completed: boolean
}

export type SupportContext = {
  userId?: string
  email?: string
  currentStepSlug: TieStepSlug | null
  currentStepTitle: string | null
  currentStepId: number | null
  completedSteps: TieStepSlug[]
  completedStepCount: number
  totalSteps: number
  currentStepRequirements: SupportContextRequirement[]
  language: string
  appVersion?: string
  platform: SupportPlatform
  osVersion?: string
}

export type SupportProgressSnapshot = {
  currentStepId: number
  steps: Array<{
    stepId: number
    status: 'not_started' | 'in_progress' | 'completed'
    requirements: Record<string, { completed: boolean }>
  }>
}

export type SupportStepSummary = {
  id: number
  slug: TieStepSlug
  title: string
  requirements: Array<{ key: string; label: string }>
  commonQuestions?: CommonQuestion[]
}

export type AuthenticatedSupportTicketInput = {
  message: string
  context: SupportContext & {
    userId: string
    email: string
    appVersion: string
    osVersion: string
  }
}

export type PublicSupportTicketInput = {
  email: string
  message: string
  context: SupportContext
}

export type SupportTicketResponse = {
  ticketId: string
  createdAt: string
}
