import {
  selectProfileCompleteness,
  isPersonalInformationComplete,
  isLegalPrivacyComplete,
} from './selectProfileCompleteness';
import {ProfileData} from '../types/ProfileData';

describe('selectProfileCompleteness', () => {
  const completeProfileData: ProfileData = {
    personal: {
      firstName: 'John',
      lastName: 'Doe',
      documentNumber: 'X1234567Y',
      documentType: 'passport',
      nationality: 'US',
      address: '123 Main St',
      city: 'Barcelona',
      postalCode: '08001',
      phoneNumber: '+34612345678',
    },
  };

  describe('isPersonalInformationComplete', () => {
    it('returns true when all required fields are filled', () => {
      expect(isPersonalInformationComplete(completeProfileData)).toBe(true);
    });

    it('returns false when profileData is null', () => {
      expect(isPersonalInformationComplete(null)).toBe(false);
    });

    it('returns false when personal data is missing', () => {
      expect(isPersonalInformationComplete({} as ProfileData)).toBe(false);
    });

    it('returns false when required field is empty', () => {
      const incomplete = {
        ...completeProfileData,
        personal: {
          ...completeProfileData.personal!,
          firstName: '',
        },
      };

      expect(isPersonalInformationComplete(incomplete)).toBe(false);
    });

    it('returns false when required field is null', () => {
      const incomplete = {
        ...completeProfileData,
        personal: {
          ...completeProfileData.personal!,
          lastName: null as any,
        },
      };

      expect(isPersonalInformationComplete(incomplete)).toBe(false);
    });
  });

  describe('isLegalPrivacyComplete', () => {
    it('returns true when consent is given', () => {
      expect(isLegalPrivacyComplete(true)).toBe(true);
    });

    it('returns false when consent is not given', () => {
      expect(isLegalPrivacyComplete(false)).toBe(false);
    });
  });

  describe('selectProfileCompleteness', () => {
    it('returns correct completeness when both sections are complete', () => {
      const result = selectProfileCompleteness(completeProfileData, true);

      expect(result).toEqual({
        personalInformation: true,
        legalPrivacy: true,
      });
    });

    it('returns correct completeness when personal info is incomplete', () => {
      const result = selectProfileCompleteness(null, true);

      expect(result).toEqual({
        personalInformation: false,
        legalPrivacy: true,
      });
    });

    it('returns correct completeness when consent is missing', () => {
      const result = selectProfileCompleteness(completeProfileData, false);

      expect(result).toEqual({
        personalInformation: true,
        legalPrivacy: false,
      });
    });

    it('returns correct completeness when both sections are incomplete', () => {
      const result = selectProfileCompleteness(null, false);

      expect(result).toEqual({
        personalInformation: false,
        legalPrivacy: false,
      });
    });
  });
});
