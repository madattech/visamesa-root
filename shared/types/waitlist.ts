export const WAITLIST_SOURCES = ['hero', 'section', 'footer'] as const

export type WaitlistSource = (typeof WAITLIST_SOURCES)[number]

export type WaitlistStatus = 'pending' | 'confirmed'

export interface WaitlistSubmitRequest {
  email: string
  locale: string
  source?: WaitlistSource
}

export interface WaitlistSubmitResponse {
  success: boolean
  message: string
}

export interface WaitlistConfirmResponse {
  success: boolean
  status: WaitlistStatus
  alreadyConfirmed: boolean
  message: string
}

export interface WaitlistFeedbackRequest {
  email: string
  feedback: string
}

export interface WaitlistFeedbackResponse {
  success: boolean
}

export interface WaitlistStatsResponse {
  total: number
  confirmed: number
  pending: number
  withFeedback: number
}
