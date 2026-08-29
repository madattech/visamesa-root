import { describe, expect, it } from 'vitest'

import { initSharedI18n, i18n } from '../i18n/init'
import { translationResources } from '../i18n/resources'
import { getStepSlugById } from './manifest'
import { parseTieMarketingSteps } from './marketingSteps'
import { TIE_STEP_ORDER } from './types'

describe('tieSteps i18n marketingSteps', () => {
  for (const language of ['en', 'es', 'zh'] as const) {
    it(`keeps ${language} marketingSteps aligned with manifest ids and order`, async () => {
      await initSharedI18n({ language })

      const marketingSteps = parseTieMarketingSteps(
        i18n.t('tieSteps:marketingSteps', { returnObjects: true }),
      )

      expect(marketingSteps).toHaveLength(TIE_STEP_ORDER.length)

      marketingSteps.forEach((step, index) => {
        expect(step.id).toBe(index + 1)
        expect(getStepSlugById(step.id)).toBe(TIE_STEP_ORDER[index])
      })
    })
  }

  it('loads marketingSteps from bundled locale resources', () => {
    for (const language of ['en', 'es', 'zh'] as const) {
      const steps = parseTieMarketingSteps(
        translationResources[language].tieSteps.marketingSteps,
      )

      expect(steps).toHaveLength(TIE_STEP_ORDER.length)
      expect(steps[1]?.title.length).toBeGreaterThan(0)
      expect(steps[2]?.title.length).toBeGreaterThan(0)
    }
  })
})
