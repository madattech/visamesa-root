import React from 'react';
import {View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {ProfileSectionRow} from '@/features/profile/components/ProfileSectionRow';
import {PROFILE_SECTIONS} from '@/features/profile/data/profileSections';
import {ProfileSectionId} from '@/features/profile/data/profileSections';

type ProfileSectionListProps = {
  onSectionPress: (sectionId: ProfileSectionId) => void;
};

export function ProfileSectionList({onSectionPress}: ProfileSectionListProps) {
  const {styles} = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      {PROFILE_SECTIONS.map(section => (
        <ProfileSectionRow
          key={section.id}
          section={section}
          onPress={() => onSectionPress(section.id)}
        />
      ))}
    </View>
  );
}

const stylesheet = createStyleSheet(theme => ({
  container: {
    gap: theme.spacing.sm,
  },
}));
