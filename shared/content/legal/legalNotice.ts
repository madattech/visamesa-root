import { getCompanyLegalI18nValues } from './company'
import type { LegalBlock } from './types'

export type LegalNoticeTranslateFn = (
  key: string,
  options?: { returnObjects?: boolean },
) => string | unknown

function interpolateTemplate(
  template: string,
  values: Record<string, string>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => values[key] ?? '')
}

function interpolateLegalBlock(
  block: LegalBlock,
  values: Record<string, string>,
): LegalBlock {
  switch (block.type) {
    case 'h2':
    case 'h3':
    case 'p':
      return { ...block, text: interpolateTemplate(block.text, values) }
    case 'ul':
      return {
        ...block,
        items: block.items.map((item) => interpolateTemplate(item, values)),
      }
    case 'pLink':
      return {
        ...block,
        before: interpolateTemplate(block.before, values),
        linkText: interpolateTemplate(block.linkText, values),
        after: block.after
          ? interpolateTemplate(block.after, values)
          : undefined,
      }
    case 'privacyLink':
      return {
        ...block,
        before: interpolateTemplate(block.before, values),
        after: interpolateTemplate(block.after, values),
      }
    case 'email':
      return {
        ...block,
        label: interpolateTemplate(block.label, values),
        email: interpolateTemplate(block.email, values),
      }
    default:
      return block
  }
}

export function getLegalNoticeBlocks(t: LegalNoticeTranslateFn): LegalBlock[] {
  const value = t('legalNotice.blocks', { returnObjects: true })
  const values = getCompanyLegalI18nValues()

  if (!Array.isArray(value)) {
    return []
  }

  return (value as LegalBlock[]).map((block) =>
    interpolateLegalBlock(block, values),
  )
}
