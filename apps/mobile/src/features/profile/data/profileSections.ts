import {
  PROFILE_PERSONAL_TITLE,
  PROFILE_PERSONAL_DESCRIPTION,
} from './profileContent';

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
    title: PROFILE_PERSONAL_TITLE,
    formId: 'profile-personal',
    description: PROFILE_PERSONAL_DESCRIPTION,
  },
];

export function getProfileSection(id: ProfileSectionId): ProfileSectionConfig {
  const section = PROFILE_SECTIONS.find(item => item.id === id);
  if (!section) {
    throw new Error(`Unknown profile section: ${id}`);
  }
  return section;
}
