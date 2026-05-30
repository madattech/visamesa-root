export type ProfileSection = 'personal' | 'billing' | 'residenceRegistration';

export type ProfileData = {
  personal: Record<string, unknown> | null;
  billing: Record<string, unknown> | null;
  residenceRegistration: Record<string, unknown> | null;
};
