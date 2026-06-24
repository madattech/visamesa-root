export const EntitlementType = {
  FULL_SERVICE: 'full_service',
  EMPADRONAMIENTO_AUTO: 'empadronamiento_auto',
  CITA_PREVIA_AUTO: 'cita_previa_auto',
  GUIDANCE: 'guidance',
} as const;

export type EntitlementType =
  (typeof EntitlementType)[keyof typeof EntitlementType];

export type UserEntitlement = {
  type: EntitlementType;
  grantedAt: string;
  expiresAt: string | null;
};

export type EntitlementsResponse = {
  entitlements: UserEntitlement[];
};
