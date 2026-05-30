import {useEffect, useMemo, useState} from 'react';

import {useToast} from '@/components/Toast/ToastProvider';
import {phoneToString, stringToPhone} from '@/features/forms/utils/phoneUtils';
import {
  getProfile,
  updateProfile,
} from '@/features/profile/services/profileService';
import {
  ProfileData,
  ProfileSection,
} from '@/features/profile/types/ProfileData';

type SubmittingState = Record<ProfileSection, boolean>;

const INITIAL_SUBMITTING: SubmittingState = {
  personal: false,
  billing: false,
  residenceRegistration: false,
};

export type UseProfileResult = {
  profileData: ProfileData | null;
  isLoading: boolean;
  error: Error | null;
  personalInitialValues: Record<string, unknown>;
  isSubmittingPersonal: boolean;
  isSubmittingBilling: boolean;
  isSubmittingResidenceRegistration: boolean;
  submitPersonal: (data: Record<string, unknown>) => Promise<void>;
  submitBilling: (data: Record<string, unknown>) => Promise<void>;
  submitResidenceRegistration: (data: Record<string, unknown>) => Promise<void>;
};

export function useProfile(isEnabled: boolean): UseProfileResult {
  const {showToast} = useToast();
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
      .then(data => {
        if (!cancelled) {
          setProfileData(data);
          setIsLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err : new Error('Failed to load profile'),
          );
          setIsLoading(false);
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
    isSubmittingBilling: submitting.billing,
    isSubmittingResidenceRegistration: submitting.residenceRegistration,
    submitPersonal: data =>
      submitSection(
        'personal',
        data,
        'Personal information saved successfully!',
      ),
    submitBilling: data =>
      submitSection('billing', data, 'Billing details saved successfully!'),
    submitResidenceRegistration: data =>
      submitSection(
        'residenceRegistration',
        data,
        'Residence registration details saved successfully!',
      ),
  };
}
