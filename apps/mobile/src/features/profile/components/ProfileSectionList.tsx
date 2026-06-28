import React from 'react';
import {View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {ProfileSectionRow} from '@/features/profile/components/ProfileSectionRow';
import {PROFILE_SECTIONS} from '@/features/profile/data/profileSections';
import {ProfileSectionId} from '@/features/profile/data/profileSections';
import {ProfileCompleteness} from '@/features/profile/selectors/selectProfileCompleteness';

type ProfileSectionListProps = {
  onSectionPress: (sectionId: ProfileSectionId) => void;
  completeness: ProfileCompleteness;
};

export function ProfileSectionList({
  onSectionPress,
  completeness,
}: ProfileSectionListProps) {
  const {styles} = useStyles(stylesheet);

  return (
    <View style={styles.container}>
      {PROFILE_SECTIONS.map(section => (
        <ProfileSectionRow
          key={section.id}
          section={section}
          onPress={() => onSectionPress(section.id)}
          status={
            section.id === 'personal'
              ? completeness.personalInformation
                ? 'done'
                : 'notDone'
              : undefined
          }
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
