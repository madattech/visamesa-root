import {RouteProp} from '@react-navigation/native';

import {useProfileData} from '@/features/profile/context/ProfileDataContext';
import {
  getProfileSection,
  ProfileSectionId,
} from '@/features/profile/data/profileSections';
import {ProfileStackParamList} from '@/navigation/types';

type ProfileSectionRoute = RouteProp<ProfileStackParamList, 'ProfileSection'>;

export type UseProfileSectionScreenResult = {
  formId: string;
  initialValues: Record<string, unknown>;
  isSubmitting: boolean;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
};

export function useProfileSectionScreen(
  route: ProfileSectionRoute,
): UseProfileSectionScreenResult {
  const sectionId: ProfileSectionId = route.params.sectionId;
  const section = getProfileSection(sectionId);

  const {
    profileData,
    personalInitialValues,
    isSubmittingPersonal,
    isSubmittingBilling,
    isSubmittingResidenceRegistration,
    submitPersonal,
    submitBilling,
    submitResidenceRegistration,
  } = useProfileData();

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
    billing: {
      initialValues: profileData?.billing ?? {},
      isSubmitting: isSubmittingBilling,
      onSubmit: submitBilling,
    },
    residenceRegistration: {
      initialValues: profileData?.residenceRegistration ?? {},
      isSubmitting: isSubmittingResidenceRegistration,
      onSubmit: submitResidenceRegistration,
    },
  };

  const current = sectionState[sectionId];

  return {
    formId: section.formId,
    initialValues: current.initialValues,
    isSubmitting: current.isSubmitting,
    onSubmit: current.onSubmit,
  };
}
