import {useEffect, useMemo, useState} from 'react';

import {useToast} from '@/components/Toast/ToastProvider';
import {phoneToString, stringToPhone} from '@/features/forms/utils/phoneUtils';
import {
  EMPTY_PROFILE,
  getProfile,
  updateProfile,
} from '@/features/profile/services/profileService';
import {profileCompletionService} from '@/features/profile/services/profileCompletionService';
import {
  ProfileData,
  ProfileSection,
} from '@/features/profile/types/ProfileData';
import {isProfileComplete} from '@/features/profile/utils/profileCompleteness';
import {ProfileDecryptionError} from '@/services/profileCryptoErrors';
import {useProfileCompletion} from '@/contexts/ProfileCompletionContext';

type SubmittingState = Record<ProfileSection, boolean>;

const INITIAL_SUBMITTING: SubmittingState = {
  personal: false,
};

export type UseProfileResult = {
  profileData: ProfileData | null;
  isLoading: boolean;
  error: Error | null;
  personalInitialValues: Record<string, unknown>;
  isSubmittingPersonal: boolean;
  submitPersonal: (data: Record<string, unknown>) => Promise<void>;
};

export function useProfile(isEnabled: boolean): UseProfileResult {
  const {showToast} = useToast();
  const {refreshCompletion} = useProfileCompletion();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(isEnabled);
  const [error, setError] = useState<Error | null>(null);
  const [submitting, setSubmitting] =
    useState<SubmittingState>(INITIAL_SUBMITTING);

  useEffect(() => {
    if (!isEnabled) {
      setIsLoading(false);
      setProfileData(null);
      setError(null);
      return;
    }

    let cancelled = false;

    setIsLoading(true);
    setError(null);

    getProfile()
      .then(async data => {
        if (!cancelled) {
          setProfileData(data);
          setIsLoading(false);

          // Update the completion flag
          const complete = isProfileComplete(data);
          await profileCompletionService.setIsComplete(complete);
        }
      })
      .catch(async err => {
        if (!cancelled) {
          if (err instanceof ProfileDecryptionError) {
            setProfileData(EMPTY_PROFILE);
            setError(err);
          } else {
            setError(
              err instanceof Error ? err : new Error('Failed to load profile'),
            );
          }
          setIsLoading(false);

          // Profile not complete if it failed to load
          await profileCompletionService.setIsComplete(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isEnabled]);

  const personalInitialValues = useMemo(() => {
    if (!profileData?.personal) {
      return {};
    }

    const values = {...profileData.personal};

    if (values.phoneNumber && typeof values.phoneNumber === 'string') {
      const phoneObj = stringToPhone(values.phoneNumber as string);
      if (phoneObj) {
        values.phoneNumber = phoneObj;
      }
    }

    return values;
  }, [profileData?.personal]);

  const submitSection = async (
    section: ProfileSection,
    data: Record<string, unknown>,
    successMessage: string,
  ) => {
    setSubmitting(current => ({...current, [section]: true}));

    try {
      const payload = {...data};

      if (
        section === 'personal' &&
        payload.phoneNumber &&
        typeof payload.phoneNumber === 'object'
      ) {
        payload.phoneNumber = phoneToString(
          payload.phoneNumber as {
            countryCode?: string;
            number?: string;
          },
        );
      }

      const result = await updateProfile(section, payload);
      setProfileData(result);

      const complete = isProfileComplete(result);
      await profileCompletionService.setIsComplete(complete);
      await refreshCompletion();

      if (section === 'personal') {
        try {
          const {fetchUserProgress, saveUserProgress} = await import(
            '@/features/dashboard/services/progressService'
          );
          const {syncEmpadronamientoStepFromProfile} = await import(
            '@/features/dashboard/services/empadronamientoProgressService'
          );
          const {reconcileStepStatuses} = await import(
            '@/features/dashboard/services/progressReconciliationService'
          );
          const {fetchTieSteps} = await import(
            '@/features/home/services/tieStepsService'
          );

          const progress = await fetchUserProgress();
          const tieSteps = await fetchTieSteps();
          let synced = await syncEmpadronamientoStepFromProfile(progress, result);
          synced = reconcileStepStatuses(synced, tieSteps, {
            isProfileComplete: complete,
            allSteps: tieSteps,
          });

          if (JSON.stringify(synced) !== JSON.stringify(progress)) {
            await saveUserProgress(synced);
          }
        } catch {
          // Progress sync is best-effort after profile save
        }
      }

      showToast(successMessage);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to save profile section';
      showToast(message);
      throw err;
    } finally {
      setSubmitting(current => ({...current, [section]: false}));
    }
  };

  return {
    profileData,
    isLoading,
    error,
    personalInitialValues,
    isSubmittingPersonal: submitting.personal,
    submitPersonal: data =>
      submitSection(
        'personal',
        data,
        'Personal information saved successfully!',
      ),
  };
}
