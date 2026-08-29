import { describe, expect, it } from 'vitest'

import {
  COMPANY_FIELD_PENDING,
  COMPANY_LEGAL_NAME,
  getCompanyLegalI18nValues,
} from './company'
import { SUPPORT_EMAIL } from '../siteConstants'

describe('company', () => {
  it('exports the legal entity name', () => {
    expect(COMPANY_LEGAL_NAME).toBe('Sargoon Global S.L.')
  })

  it('maps company details for legal notice interpolation', () => {
    expect(getCompanyLegalI18nValues()).toEqual({
      companyLegalName: COMPANY_LEGAL_NAME,
      companyCif: COMPANY_FIELD_PENDING,
      companyAddress: COMPANY_FIELD_PENDING,
      companyRegistry: COMPANY_FIELD_PENDING,
      companyEmail: SUPPORT_EMAIL,
      companyPhone: COMPANY_FIELD_PENDING,
    })
  })
})
