import type { RequirementManifest, TieStepManifestEntry, TieStepSlug } from './types'

const empadronamientoRequirements: RequirementManifest[] = [
  { key: 'passport-nie', type: 'self_declared' },
  { key: 'proof-of-residence', type: 'self_declared' },
  {
    key: 'appointment-confirmation',
    type: 'automation',
    automationId: 'empadronamiento',
  },
]

const tomaDeHuellasRequirements: RequirementManifest[] = [
  { key: 'personal-id-details', type: 'self_declared' },
  {
    key: 'cita-previa-access',
    type: 'automation',
    automationId: 'cita-previa',
    link: {
      url: 'https://sede.administracionespublicas.gob.es/icpplus/index.html',
    },
  },
  { key: 'appointment-confirmation', type: 'self_declared' },
]

const requiredDocumentsRequirements: RequirementManifest[] = [
  { key: 'ex-17-form', type: 'form', formId: 'ex-17' },
  { key: 'valid-passport', type: 'self_declared' },
  { key: 'student-visa', type: 'self_declared' },
  {
    key: 'empadronamiento-certificate',
    type: 'self_declared',
    referencesStepSlug: 'empadronamiento',
  },
  { key: 'passport-photos', type: 'self_declared' },
  {
    key: 'appointment-confirmation-doc',
    type: 'self_declared',
    referencesStepSlug: 'toma-de-huellas',
  },
]

const payFeeRequirements: RequirementManifest[] = [
  { key: 'modelo-790-form', type: 'form', formId: 'modelo-790-012' },
  { key: 'fee-payment-receipt', type: 'self_declared' },
  {
    key: 'fee-form-source',
    type: 'self_declared',
    link: { url: 'https://sede.policia.gob.es' },
  },
]

const fingerprintAppointmentRequirements: RequirementManifest[] = [
  {
    key: 'documents-from-step-3',
    type: 'self_declared',
    referencesStepSlug: 'required-documents',
  },
  {
    key: 'fee-payment-proof',
    type: 'self_declared',
    referencesStepSlug: 'pay-fee',
  },
  { key: 'original-passport', type: 'self_declared' },
]

const collectTieRequirements: RequirementManifest[] = [
  {
    key: 'resguardo',
    type: 'self_declared',
    referencesStepSlug: 'fingerprint-appointment',
  },
  { key: 'passport-collection', type: 'self_declared' },
]

export const tieStepManifest: Record<TieStepSlug, TieStepManifestEntry> = {
  empadronamiento: {
    id: 1,
    slug: 'empadronamiento',
    officialLinkUrls: [
      'https://seuelectronica.ajuntament.barcelona.cat/oficinavirtual/es',
      'https://www.barcelona.cat/internationalwelcome/en',
    ],
    requirements: empadronamientoRequirements,
  },
  'toma-de-huellas': {
    id: 2,
    slug: 'toma-de-huellas',
    officialLinkUrls: [
      'https://sede.administracionespublicas.gob.es/icpplus/index.html',
    ],
    requirements: tomaDeHuellasRequirements,
  },
  'required-documents': {
    id: 3,
    slug: 'required-documents',
    officialLinkUrls: [
      'https://www.barcelona.cat/internationalwelcome/en/identity-card-foreign-nationals-tie',
    ],
    requirements: requiredDocumentsRequirements,
  },
  'pay-fee': {
    id: 4,
    slug: 'pay-fee',
    officialLinkUrls: ['https://sede.policia.gob.es', 'https://sede.policia.gob.es'],
    requirements: payFeeRequirements,
  },
  'fingerprint-appointment': {
    id: 5,
    slug: 'fingerprint-appointment',
    officialLinkUrls: [
      'https://www.barcelona.cat/internationalwelcome/en/identity-card-foreign-nationals-tie',
    ],
    requirements: fingerprintAppointmentRequirements,
  },
  'collect-tie': {
    id: 6,
    slug: 'collect-tie',
    officialLinkUrls: ['https://sede.policia.gob.es'],
    requirements: collectTieRequirements,
  },
}

export function getStepIdBySlug(slug: TieStepSlug): number {
  return tieStepManifest[slug].id
}
