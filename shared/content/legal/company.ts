import { SUPPORT_EMAIL } from '../siteConstants'

/** Legal entity operating VisaMesa (LSSI-CE Art. 10). Update registry fields before launch. */
export const COMPANY_LEGAL_NAME = 'Sargoon Global S.L.'

/** Shown on the legal notice until real values are set below. */
export const COMPANY_FIELD_PENDING = '[Pending]'

/** Company tax ID (CIF). Required on the legal notice page. */
export const COMPANY_CIF = ''

/** Registered office address (domicilio social). Required on the legal notice page. */
export const COMPANY_REGISTERED_ADDRESS = ''

/** Commercial registry inscription, e.g. "Registro Mercantil de Barcelona, Tomo X, Folio X, Hoja X". */
export const COMPANY_COMMERCIAL_REGISTRY = ''

/** Direct contact phone for LSSI-CE. Leave empty to show {@link COMPANY_FIELD_PENDING}. */
export const COMPANY_PHONE = ''

function withPendingPlaceholder(value: string): string {
  return value.trim() || COMPANY_FIELD_PENDING
}

export function getCompanyLegalI18nValues() {
  return {
    companyLegalName: COMPANY_LEGAL_NAME,
    companyCif: withPendingPlaceholder(COMPANY_CIF),
    companyAddress: withPendingPlaceholder(COMPANY_REGISTERED_ADDRESS),
    companyRegistry: withPendingPlaceholder(COMPANY_COMMERCIAL_REGISTRY),
    companyEmail: SUPPORT_EMAIL,
    companyPhone: withPendingPlaceholder(COMPANY_PHONE),
  }
}
