export type ProfileSectionId = 'personal';

export type ProfileSectionConfig = {
  id: ProfileSectionId;
  formId: string;
};

export const PROFILE_SECTIONS: ProfileSectionConfig[] = [
  {
    id: 'personal',
    formId: 'profile-personal',
  },
];

export function getProfileSection(id: ProfileSectionId): ProfileSectionConfig {
  const section = PROFILE_SECTIONS.find(item => item.id === id);
  if (!section) {
    throw new Error(`Unknown profile section: ${id}`);
  }
  return section;
}
