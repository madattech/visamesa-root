import { describe, expect, it } from 'vitest'

import legalEn from '../locales/en/legal.json'
import {
  getLegalDocumentI18nKey,
  legalDocumentRequiresConsent,
} from './helpers'
import { isLegalBlock } from './typeGuards'

describe('legal helpers', () => {
  it('maps legal document ids to i18n keys', () => {
    expect(getLegalDocumentI18nKey('privacy')).toBe('privacy')
    expect(getLegalDocumentI18nKey('terms')).toBe('terms')
    expect(getLegalDocumentI18nKey('legal-notice')).toBe('legalNotice')
  })

  it('requires consent only for privacy and terms documents', () => {
    expect(legalDocumentRequiresConsent('privacy')).toBe(true)
    expect(legalDocumentRequiresConsent('terms')).toBe(true)
    expect(legalDocumentRequiresConsent('legal-notice')).toBe(false)
  })
})

describe('legal locale content', () => {
  it('stores privacy and terms documents with valid block shapes', () => {
    for (const document of [legalEn.privacy, legalEn.terms]) {
      expect(document.blocks.length).toBeGreaterThan(0)
      expect(document.blocks.every(isLegalBlock)).toBe(true)
    }
  })
})
