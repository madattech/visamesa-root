import { describe, expect, it } from 'vitest'

import legalEn from '../locales/en/legal.json'
import { isLegalBlock } from './typeGuards'

describe('isLegalBlock', () => {
  it('accepts every block shape used in legal locale content', () => {
    const blocks = [
      ...legalEn.privacy.blocks,
      ...legalEn.terms.blocks,
      ...legalEn.legalNotice.blocks,
    ]

    expect(blocks.every(isLegalBlock)).toBe(true)
  })

  it('rejects invalid block shapes', () => {
    expect(isLegalBlock(null)).toBe(false)
    expect(isLegalBlock({ type: 'p' })).toBe(false)
    expect(isLegalBlock({ type: 'unknown', text: 'x' })).toBe(false)
  })
})
