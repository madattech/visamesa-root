import { describe, expect, it } from 'vitest'

import { getStepSlugById } from './tieSteps/manifest'
import { TIE_STEP_ORDER } from './tieSteps/types'
import { tieStepFaqs, tieSteps } from './tieStepsMarketing'

describe('tieStepsMarketing', () => {
  it('keeps marketing step count aligned with TIE_STEP_ORDER', () => {
    expect(tieSteps).toHaveLength(TIE_STEP_ORDER.length)

    tieSteps.forEach((step, index) => {
      expect(step.id).toBe(index + 1)
      expect(getStepSlugById(step.id)).toBe(TIE_STEP_ORDER[index])
    })
  })

  it('exports FAQ content for SEO fallbacks', () => {
    expect(tieStepFaqs.length).toBeGreaterThan(0)
  })
})
