import React from 'react';
import {ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View} from 'react-native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {RouteProp} from '@react-navigation/native';

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
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const stylesheet = createStyleSheet(theme => ({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.md,
    maxWidth: theme.sizes.contentMaxWidth,
    alignSelf: 'center',
    width: '100%',
  },
  centered: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  error: {
    textAlign: 'center',
  },
}));

export default ProfileSectionScreen;
