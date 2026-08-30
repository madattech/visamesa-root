import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import { EntitlementType } from './entitlements'
import { PRODUCT_DEFINITIONS } from './products'

const localeDir = join(dirname(fileURLToPath(import.meta.url)), 'locales', 'en')
const checkout = JSON.parse(
  readFileSync(join(localeDir, 'checkout.json'), 'utf8'),
) as {
  products: Record<string, { name: string; description: string }>
}

describe('PRODUCT_DEFINITIONS', () => {
  it('matches EN checkout product copy', () => {
    for (const [productType, definition] of Object.entries(PRODUCT_DEFINITIONS)) {
      const checkoutProduct = checkout.products[productType]
      expect(checkoutProduct, `missing checkout entry for ${productType}`).toBeDefined()
      expect(definition.stripe.name).toBe(checkoutProduct.name)
      expect(definition.stripe.description).toBe(checkoutProduct.description)
    }
  })

  it('covers every entitlement product type', () => {
    expect(Object.keys(PRODUCT_DEFINITIONS).sort()).toEqual(
      Object.values(EntitlementType).sort(),
    )
  })
})
