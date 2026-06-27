export type ProfileSectionId = 'personal';

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
    description: 'Your identity, contact details, registered address',
  },
];

export function getProfileSection(id: ProfileSectionId): ProfileSectionConfig {
  const section = PROFILE_SECTIONS.find(item => item.id === id);
  if (!section) {
    throw new Error(`Unknown profile section: ${id}`);
  }
  return section;
}
