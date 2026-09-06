import { describe, expect, it } from 'vitest'

import {
  buildAuthenticatedSupportContext,
  buildGuestSupportContext,
  isValidSupportEmail,
  normalizeSupportEmail,
  resolveSupportFaqs,
} from './index.js'

const mockSteps = [
  {
    id: 1,
    slug: 'empadronamiento' as const,
    title: 'Register Your Address',
    requirements: [{ key: 'passport-nie', label: 'Passport and NIE' }],
    commonQuestions: [{ question: 'Step FAQ?', answer: 'Step answer.' }],
  },
]

const mockProgress = {
  currentStepId: 1,
  steps: [
    {
      stepId: 1,
      status: 'in_progress' as const,
      requirements: { 'passport-nie': { completed: true } },
    },
  ],
}

describe('support email validation', () => {
  it('accepts valid email addresses', () => {
    expect(isValidSupportEmail('guest@example.com')).toBe(true)
  })

  it('rejects invalid email addresses', () => {
    expect(isValidSupportEmail('not-an-email')).toBe(false)
    expect(isValidSupportEmail('')).toBe(false)
  })

  it('normalizes email casing and whitespace', () => {
    expect(normalizeSupportEmail('  Guest@Example.com ')).toBe('guest@example.com')
  })
})

describe('resolveSupportFaqs', () => {
  const genericFaqs = [{ question: 'Generic?', answer: 'Generic answer.' }]

  it('returns generic FAQs for logged-out users', () => {
    expect(
      resolveSupportFaqs(genericFaqs, {
        isAuthenticated: false,
        progress: null,
        steps: mockSteps,
      }),
    ).toEqual(genericFaqs)
  })

  it('returns step-specific FAQs for logged-in users when available', () => {
    expect(
      resolveSupportFaqs(genericFaqs, {
        isAuthenticated: true,
        progress: mockProgress,
        steps: mockSteps,
      }),
    ).toEqual(mockSteps[0].commonQuestions)
  })
})

describe('buildAuthenticatedSupportContext', () => {
  it('includes progress-derived step and requirement context', () => {
    const context = buildAuthenticatedSupportContext({
      userId: 'user-1',
      email: 'test@example.com',
      progress: mockProgress,
      steps: mockSteps,
      language: 'en',
      appVersion: '1.0.0',
      platform: 'web',
      osVersion: 'Chrome',
    })

    expect(context.email).toBe('test@example.com')
    expect(context.currentStepId).toBe(1)
    expect(context.currentStepSlug).toBe('empadronamiento')
    expect(context.completedStepCount).toBe(0)
    expect(context.totalSteps).toBe(6)
    expect(context.currentStepRequirements).toEqual([
      { key: 'passport-nie', label: 'Passport and NIE', completed: true },
    ])
  })
})

describe('buildGuestSupportContext', () => {
  it('builds empty guest context with platform metadata', () => {
    const context = buildGuestSupportContext({
      email: 'guest@example.com',
      language: 'en',
      appVersion: 'web',
      platform: 'web',
      osVersion: 'Safari',
    })

    expect(context.email).toBe('guest@example.com')
    expect(context.currentStepId).toBeNull()
    expect(context.platform).toBe('web')
  })
})
