import { describe, expect, it } from 'vitest'

import { initSharedI18n, i18n } from '../i18n/init'
import { buildTieSteps } from '../tieSteps/buildTieSteps'
import { TIE_STEP_ORDER } from '../tieSteps/types'

describe('buildTieSteps', () => {
  it('builds localized steps keyed by slug for each supported language', async () => {
    for (const language of ['en', 'es', 'zh'] as const) {
      await initSharedI18n({ language })

      const steps = buildTieSteps((key, options) => i18n.t(key, options))

      expect(steps).toHaveLength(TIE_STEP_ORDER.length)
      expect(steps[0]?.slug).toBe('empadronamiento')
      expect(steps[0]?.title.length).toBeGreaterThan(0)
      expect(steps[0]?.requirements[0]?.key).toBeTruthy()
      expect(steps[0]?.requirements[0]?.label).not.toBe(steps[0]?.requirements[0]?.key)
    }
  })
})
