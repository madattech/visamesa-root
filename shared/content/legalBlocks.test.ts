import { describe, expect, it } from 'vitest'

import legalEn from './locales/en/legal.json'
import type { LegalBlock } from './legalBlocks'

function isLegalBlock(value: unknown): value is LegalBlock {
  if (!value || typeof value !== 'object') {
    return false
  }

  const block = value as { type?: string }

  switch (block.type) {
    case 'h2':
    case 'h3':
    case 'p':
      return typeof (block as { text?: string }).text === 'string'
    case 'ul':
      return Array.isArray((block as { items?: unknown }).items)
    case 'pLink':
      return (
        typeof (block as { before?: string }).before === 'string' &&
        typeof (block as { linkText?: string }).linkText === 'string' &&
        typeof (block as { linkHref?: string }).linkHref === 'string'
      )
    case 'privacyLink':
      return (
        typeof (block as { before?: string }).before === 'string' &&
        typeof (block as { after?: string }).after === 'string'
      )
    case 'email':
      return (
        typeof (block as { label?: string }).label === 'string' &&
        typeof (block as { email?: string }).email === 'string'
      )
    default:
      return false
  }
}

describe('legalBlocks locale content', () => {
  it('stores privacy and terms documents with valid block shapes', () => {
    for (const document of [legalEn.privacy, legalEn.terms]) {
      expect(document.blocks.length).toBeGreaterThan(0)
      expect(document.blocks.every(isLegalBlock)).toBe(true)
    }
  })
})
