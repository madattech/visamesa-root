import React, {useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {createStyleSheet, useStyles} from 'react-native-unistyles';
import {RouteProp, useNavigation} from '@react-navigation/native';

import {CollapsingHeaderScreen} from '@/components/layout/CollapsingHeaderScreen';
import {DynamicForm} from '@/features/forms/components/DynamicForm';
import {ConsentDialog} from '@/features/profile/components/ConsentDialog';
import {useFormSchema} from '@/features/forms/hooks/useFormSchema';
import {useProfileSectionScreen} from '@/features/profile/hooks/useProfileSectionScreen';
import {Text} from '@/components/ui/Text';
import {ProfileStackParamList} from '@/navigation/types';
import {consentService} from '@/services/consentService';

const PROFILE_SECTION_TITLE_KEYS = {
  personal: 'personalTitle',
} as const;

type ProfileSectionScreenProps = {
  route: RouteProp<ProfileStackParamList, 'ProfileSection'>;
};

const ProfileSectionScreen = ({route}: ProfileSectionScreenProps) => {
  const {styles, theme} = useStyles(stylesheet);
  const {t} = useTranslation('profile');
  const navigation = useNavigation();
  const {formId, initialValues, isSubmitting, onSubmit} =
    useProfileSectionScreen(route);
  const {schema, isLoading, error} = useFormSchema(formId);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [pendingData, setPendingData] = useState<Record<string, unknown> | null>(
    null,
  );

  const title = t(
    PROFILE_SECTION_TITLE_KEYS[route.params.sectionId],
  );

  const handleSubmit = async (data: Record<string, unknown>) => {
    // Check if consent has been given
    const hasConsent = await consentService.hasAcceptedConsent();

    if (!hasConsent) {
      // Show consent dialog
      setPendingData(data);
      setShowConsentDialog(true);
      return;
    }

    // Consent already given, proceed with save
    await onSubmit(data);
  };

  const handleConsentAccept = async () => {
    try {
      await consentService.recordConsent();
      setShowConsentDialog(false);

      // Now save the pending data
      if (pendingData) {
        await onSubmit(pendingData);
        setPendingData(null);
      }
    } catch (consentError) {
      // Error handling is done in ConsentDialog
      throw consentError;
    }
  };

  const handleConsentDecline = () => {
    setShowConsentDialog(false);
    setPendingData(null);
    navigation.goBack();
  };

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
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            initialValues={initialValues}
            submitButtonText="Save"
          />
          {showConsentDialog ? (
            <ConsentDialog
              onAccept={handleConsentAccept}
              onDecline={handleConsentDecline}
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
