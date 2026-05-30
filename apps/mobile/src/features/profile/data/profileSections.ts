export type ProfileSectionId =
  | 'personal'
  | 'billing'
  | 'residenceRegistration';

export type ProfileSectionConfig = {
  id: ProfileSectionId;
  title: string;
  formId: string;
  description: string;
};

export const PROFILE_SECTIONS: ProfileSectionConfig[] = [
  {
    id: 'personal',
    title: 'Personal Information',
    formId: 'profile-personal',
    description: 'Name, contact details, and identity documents',
  },
  {
    id: 'billing',
    title: 'Billing & Bank Details',
    formId: 'profile-billing',
    description: 'Payment and bank account information',
  },
  {
    id: 'residenceRegistration',
    title: 'Residence Registration',
    formId: 'profile-residence-registration',
    description: 'Empadronamiento and address details',
  },
];

export function getProfileSection(id: ProfileSectionId): ProfileSectionConfig {
  const section = PROFILE_SECTIONS.find(item => item.id === id);
  if (!section) {
    throw new Error(`Unknown profile section: ${id}`);
  }
  return section;
}
