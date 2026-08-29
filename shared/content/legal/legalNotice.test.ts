import { describe, expect, it, vi } from 'vitest'

import legalEn from '../locales/en/legal.json'
import legalEs from '../locales/es/legal.json'
import legalZh from '../locales/zh/legal.json'
import type { LegalBlock } from './types'
import { createI18nInstance } from '../i18n/init'
import { getLegalNoticeBlocks } from './legalNotice'
import { isLegalBlock } from './typeGuards'
import { SUPPORT_EMAIL } from '../siteConstants'

function paragraphTexts(blocks: LegalBlock[]) {
  return blocks
    .filter((block) => block.type === 'p')
    .map((block) => block.text)
}

describe('legalNotice', () => {
  it('stores legal notice locale blocks with valid shapes in every language', () => {
    for (const document of [legalEn.legalNotice, legalEs.legalNotice, legalZh.legalNotice]) {
      expect(document.blocks.length).toBeGreaterThan(0)
      expect(document.blocks.every(isLegalBlock)).toBe(true)
    }

    expect(legalEs.legalNotice.blocks.length).toBe(legalEn.legalNotice.blocks.length)
    expect(legalZh.legalNotice.blocks.length).toBe(legalEn.legalNotice.blocks.length)
  })

  it('returns an empty list when i18n blocks are missing', () => {
    const blocks = getLegalNoticeBlocks(((key: string) => key) as never)

    expect(blocks).toEqual([])
  })

  it('interpolates company details into English legal notice blocks', () => {
    const i18n = createI18nInstance({ language: 'en' })
    const blocks = getLegalNoticeBlocks(i18n.getFixedT('en', 'legal'))

    expect(blocks.some((block) => block.type === 'p' && block.text.includes('Sargoon Global S.L.'))).toBe(
      true,
    )
    expect(
      blocks.some((block) => block.type === 'email' && block.email === SUPPORT_EMAIL),
    ).toBe(true)
  })

  it('interpolates company details into Spanish and Chinese legal notice blocks', () => {
    for (const language of ['es', 'zh'] as const) {
      const i18n = createI18nInstance({ language })
      const blocks = getLegalNoticeBlocks(i18n.getFixedT(language, 'legal'))

      expect(blocks.some((block) => block.type === 'p' && block.text.includes('Sargoon Global S.L.'))).toBe(
        true,
      )
      expect(
        blocks.some((block) => block.type === 'email' && block.email === SUPPORT_EMAIL),
      ).toBe(true)
    }
  })

  it('shows placeholders for identification fields when company registry values are blank', () => {
    const i18n = createI18nInstance({ language: 'en' })
    const blocks = getLegalNoticeBlocks(i18n.getFixedT('en', 'legal'))
    const texts = paragraphTexts(blocks)

    expect(texts).toContain('Tax ID (CIF): [Pending]')
    expect(texts).toContain('Registered address: [Pending]')
    expect(texts).toContain('Commercial registry: [Pending]')
    expect(texts).toContain('Phone: [Pending]')
  })

  it('includes optional legal notice fields when company registry values are present', async () => {
    vi.resetModules()
    vi.doMock('./company', () => ({
      getCompanyLegalI18nValues: () => ({
        companyLegalName: 'Sargoon Global S.L.',
        companyCif: 'B12345678',
        companyAddress: 'Carrer Example 1, Barcelona',
        companyRegistry: 'Registro Mercantil de Barcelona, Tomo 1, Folio 2, Hoja B-3',
        companyEmail: SUPPORT_EMAIL,
        companyPhone: '+34 600 000 000',
      }),
    }))

    const { getLegalNoticeBlocks: getBlocksWithRegistry } = await import('./legalNotice')
    const i18n = createI18nInstance({ language: 'en' })
    const blocks = getBlocksWithRegistry(i18n.getFixedT('en', 'legal'))
    const texts = paragraphTexts(blocks)

    expect(texts).toContain('Tax ID (CIF): B12345678')
    expect(texts).toContain('Registered address: Carrer Example 1, Barcelona')
    expect(texts).toContain(
      'Commercial registry: Registro Mercantil de Barcelona, Tomo 1, Folio 2, Hoja B-3',
    )
    expect(texts).toContain('Phone: +34 600 000 000')

    vi.doUnmock('./company')
    vi.resetModules()
  })
})
