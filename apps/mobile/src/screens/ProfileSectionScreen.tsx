import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import {CollapsingHeaderScreen} from '@/components/layout/CollapsingHeaderScreen';
import {DynamicForm} from '@/features/forms/components/DynamicForm';
import {ConsentDialog} from '@/features/profile/components/ConsentDialog';
import {useFormSchema} from '@/features/forms/hooks/useFormSchema';
import {useProfileSectionScreen} from '@/features/profile/hooks/useProfileSectionScreen';
import {Text} from '@/components/ui/Text';
import {ProfileStackParamList} from '@/navigation/types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type ProfileSectionScreenProps = {
  route: RouteProp<ProfileStackParamList, 'ProfileSection'>;
};

type ProfileSectionNavigation = NativeStackNavigationProp<
  ProfileStackParamList,
  'ProfileSection'
>;

const ProfileSectionScreen = ({route}: ProfileSectionScreenProps) => {
  const {styles, theme} = useStyles(stylesheet);
  const navigation = useNavigation<ProfileSectionNavigation>();
  const {
    title,
    formId,
    initialValues,
    isSubmitting,
    showConsentDialog,
    onSubmit,
    onConsentAccept,
    onConsentDecline,
  } = useProfileSectionScreen(route, navigation);
  const {schema, isLoading, error} = useFormSchema(formId);

  return (
    <CollapsingHeaderScreen title={title} keyboardAvoiding>
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
        </View>
      ) : error ? (
        <Text variant="bodyMedium" color="error" style={styles.error}>
          {error.message}
        </Text>
      ) : schema ? (
        <>
          <DynamicForm
            schema={schema}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            initialValues={initialValues}
            submitButtonText="Save"
          />
          {showConsentDialog ? (
            <ConsentDialog
              onAccept={onConsentAccept}
              onDecline={onConsentDecline}
            />
          ) : null}
        </>
      ) : null}
    </CollapsingHeaderScreen>
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
