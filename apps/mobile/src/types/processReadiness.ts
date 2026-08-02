export type ProcessReadinessMissing =
  | 'personalInformation'
  | 'payment'
  | 'legalPrivacy';

export const PROCESS_READINESS_ITEM_ORDER: ProcessReadinessMissing[] = [
  'personalInformation',
  'legalPrivacy',
  'payment',
];
