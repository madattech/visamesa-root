import {useCallback, useState} from 'react';
import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';

import {useConsent} from '@/contexts/ConsentContext';
import {useProfileData} from '@/features/profile/context/ProfileDataContext';
import {
  getProfileSection,
  ProfileSectionId,
} from '@/features/profile/data/profileSections';
import {ProfileStackParamList} from '@/navigation/types';
import {consentService} from '@/services/consentService';

type ProfileSectionRoute = RouteProp<ProfileStackParamList, 'ProfileSection'>;

type ProfileSectionNavigation = NativeStackNavigationProp<
  ProfileStackParamList,
  'ProfileSection'
>;

const PROFILE_SECTION_TITLE_KEYS = {
  personal: 'personalTitle',
} as const;

export type UseProfileSectionScreenResult = {
  title: string;
  formId: string;
  initialValues: Record<string, unknown>;
  isSubmitting: boolean;
  showConsentDialog: boolean;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onConsentAccept: () => Promise<void>;
  onConsentDecline: () => void;
};

export function useProfileSectionScreen(
  route: ProfileSectionRoute,
  navigation: ProfileSectionNavigation,
): UseProfileSectionScreenResult {
  const sectionId: ProfileSectionId = route.params.sectionId;
  const section = getProfileSection(sectionId);
  const {t} = useTranslation('profile');
  const {refreshConsent} = useConsent();

  const {
    personalInitialValues,
    isSubmittingPersonal,
    submitPersonal,
  } = useProfileData();

  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [pendingData, setPendingData] = useState<Record<string, unknown> | null>(
    null,
  );

  const sectionState: Record<
    ProfileSectionId,
    {
      initialValues: Record<string, unknown>;
      isSubmitting: boolean;
      onSubmit: (data: Record<string, unknown>) => Promise<void>;
    }
  > = {
    personal: {
      initialValues: personalInitialValues,
      isSubmitting: isSubmittingPersonal,
      onSubmit: submitPersonal,
    },
  };

  const current = sectionState[sectionId];

  const title = t(PROFILE_SECTION_TITLE_KEYS[route.params.sectionId]);

  const saveSectionData = useCallback(
    async (data: Record<string, unknown>) => {
      await current.onSubmit(data);
    },
    [current],
  );

  const onSubmit = useCallback(
    async (data: Record<string, unknown>) => {
      const hasConsent = await consentService.hasAcceptedConsent();

      if (!hasConsent) {
        setPendingData(data);
        setShowConsentDialog(true);
        return;
      }

      await saveSectionData(data);
    },
    [saveSectionData],
  );

  const onConsentAccept = useCallback(async () => {
    try {
      await consentService.recordConsent();
      await refreshConsent();
      setShowConsentDialog(false);

      if (pendingData) {
        await saveSectionData(pendingData);
        setPendingData(null);
      }
    } catch (consentError) {
      throw consentError;
    }
  }, [pendingData, refreshConsent, saveSectionData]);

  const onConsentDecline = useCallback(() => {
    setShowConsentDialog(false);
    setPendingData(null);
    navigation.goBack();
  }, [navigation]);

  return {
    title,
    formId: section.formId,
    initialValues: current.initialValues,
    isSubmitting: current.isSubmitting,
    showConsentDialog,
    onSubmit,
    onConsentAccept,
    onConsentDecline,
  };
}
