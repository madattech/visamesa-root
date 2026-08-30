import { EntitlementType, type ProductType } from './entitlements.js'

export type ProductStripeCopy = {
  name: string
  description: string
}

export type ProductDefinition = {
  priceInCents: number
  stripe: ProductStripeCopy
}

export const PRODUCT_DEFINITIONS: Record<ProductType, ProductDefinition> = {
  [EntitlementType.FULL_SERVICE]: {
    priceInCents: 10000,
    stripe: {
      name: 'VisaMesa Full Service',
      description:
        'Complete TIE assistance including all booking assistants and guidance',
    },
  },
  [EntitlementType.EMPADRONAMIENTO_BOOKING_ASSISTANT]: {
    priceInCents: 4000,
    stripe: {
      name: 'Empadronamiento Booking Assistant',
      description: 'Appointment booking assistance for address registration',
    },
  },
  [EntitlementType.CITA_PREVIA_BOOKING_ASSISTANT]: {
    priceInCents: 4000,
    stripe: {
      name: 'Cita Previa Booking Assistant',
      description: 'Appointment booking assistance for fingerprint appointment',
    },
  },
  [EntitlementType.GUIDANCE]: {
    priceInCents: 1000,
    stripe: {
      name: 'TIE Process Guidance',
      description: 'Step-by-step guidance for document preparation and process',
    },
  },
}
