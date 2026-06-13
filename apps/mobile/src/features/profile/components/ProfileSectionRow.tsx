import React from 'react';

import {DetailLinkRow} from '@/components/ui/DetailLinkRow';
import {ProfileSectionConfig} from '@/features/profile/data/profileSections';

type ProfileSectionRowProps = {
  section: ProfileSectionConfig;
  onPress: () => void;
};

export function ProfileSectionRow({section, onPress}: ProfileSectionRowProps) {
  return (
    <DetailLinkRow
      title={section.title}
      description={section.description}
      onPress={onPress}
    />
  );
}
