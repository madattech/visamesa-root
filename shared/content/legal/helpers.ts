import type { LegalDocumentId } from './types'

const LEGAL_DOCUMENT_I18N_KEY: Record<
  LegalDocumentId,
  'privacy' | 'terms' | 'legalNotice'
> = {
  privacy: 'privacy',
  terms: 'terms',
  'legal-notice': 'legalNotice',
}

export function getLegalDocumentI18nKey(
  documentId: LegalDocumentId,
): 'privacy' | 'terms' | 'legalNotice' {
  return LEGAL_DOCUMENT_I18N_KEY[documentId]
}

export function legalDocumentRequiresConsent(
  documentId: LegalDocumentId,
): documentId is 'privacy' | 'terms' {
  return documentId === 'privacy' || documentId === 'terms'
}
