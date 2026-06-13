import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {RouteProp} from '@react-navigation/native';

import {InternalDetailScreenLayout} from '@/components/layout/InternalDetailScreenLayout';
import {DynamicForm} from '@/features/forms/components/DynamicForm';
import {useFormSchema} from '@/features/forms/hooks/useFormSchema';
import {useProfileSectionScreen} from '@/features/profile/hooks/useProfileSectionScreen';
import {Text} from '@/components/ui/Text';
import {ProfileStackParamList} from '@/navigation/types';

type ProfileSectionScreenProps = {
  route: RouteProp<ProfileStackParamList, 'ProfileSection'>;
};

const ProfileSectionScreen = ({route}: ProfileSectionScreenProps) => {
  const {styles, theme} = useStyles(stylesheet);
  const {formId, initialValues, isSubmitting, onSubmit} =
    useProfileSectionScreen(route);
  const {schema, isLoading, error} = useFormSchema(formId);

  return (
    <InternalDetailScreenLayout keyboardAvoiding>
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      ) : error ? (
        <Text variant="bodyMedium" color="error" style={styles.error}>
          {error.message}
        </Text>
      ) : schema ? (
        <DynamicForm
          schema={schema}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          initialValues={initialValues}
          submitButtonText="Save"
        />
      ) : null}
    </InternalDetailScreenLayout>
  );
};

const stylesheet = createStyleSheet(theme => ({
  centered: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  error: {
    textAlign: 'center',
  },
}));

export default ProfileSectionScreen;
