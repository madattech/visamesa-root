export type ProfileSectionId = 'personal';

export const PROFILE_PERSONAL_FORM_ID = 'profile-personal' as const;

export type ProfileSectionConfig = {
  id: ProfileSectionId;
  formId: string;
};

export const PROFILE_SECTIONS: ProfileSectionConfig[] = [
  {
    id: 'personal',
    formId: PROFILE_PERSONAL_FORM_ID,
  },
];

export function getProfileSection(id: ProfileSectionId): ProfileSectionConfig {
  const section = PROFILE_SECTIONS.find(item => item.id === id);
  if (!section) {
    throw new Error(`Unknown profile section: ${id}`);
  }
  return section;
}
