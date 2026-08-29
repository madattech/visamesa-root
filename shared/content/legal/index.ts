export type { LegalBlock, LegalDocumentId } from './types'
export type { LegalNoticeTranslateFn } from './legalNotice'

export {
  COMPANY_CIF,
  COMPANY_COMMERCIAL_REGISTRY,
  COMPANY_FIELD_PENDING,
  COMPANY_LEGAL_NAME,
  COMPANY_PHONE,
  COMPANY_REGISTERED_ADDRESS,
  getCompanyLegalI18nValues,
} from './company'

export {
  OFFICIAL_INFORMATION_SOURCES,
  OFFICIAL_SOURCES_INTRO,
  OFFICIAL_SOURCES_SECTION_TITLE,
  SERVICE_DISCLAIMER_LIMITATIONS,
  SERVICE_DISCLAIMER_MASTER_PARAGRAPHS,
  SERVICE_DISCLAIMER_SECTION_TITLE,
  SERVICE_DISCLAIMER_SHORT,
  STORE_LISTING_DISCLAIMER,
} from './disclaimer'

export { getLegalDocumentI18nKey, legalDocumentRequiresConsent } from './helpers'

export { getLegalNoticeBlocks } from './legalNotice'

export { isLegalBlock } from './typeGuards'
