import {isProfileComplete} from './profileCompleteness';
import {ProfileData} from '../types/ProfileData';

describe('isProfileComplete', () => {
  it('returns false for null profile data', () => {
    expect(isProfileComplete(null)).toBe(false);
  });

  it('returns false for null personal section', () => {
    const profileData: ProfileData = {personal: null};
    expect(isProfileComplete(profileData)).toBe(false);
  });

  it('returns false when required fields are missing', () => {
    const profileData: ProfileData = {
      personal: {
        firstName: 'John',
        lastName: 'Doe',
        // Missing: documentType, documentNumber, address, city, postalCode, phoneNumber
      },
    };
    expect(isProfileComplete(profileData)).toBe(false);
  });

  it('returns false when required field is empty string', () => {
    const profileData: ProfileData = {
      personal: {
        firstName: 'John',
        lastName: 'Doe',
        nationality: 'USA',
        documentType: 'nie',
        documentNumber: '',
        address: '123 Main St',
        city: 'Barcelona',
        postalCode: '08001',
        phoneNumber: {countryCode: '+34', number: '600123456'},
      },
    };
    expect(isProfileComplete(profileData)).toBe(false);
  });

  it('returns false when phone number is incomplete', () => {
    const profileData: ProfileData = {
      personal: {
        firstName: 'John',
        lastName: 'Doe',
        nationality: 'USA',
        documentType: 'nie',
        documentNumber: 'X1234567A',
        address: '123 Main St',
        city: 'Barcelona',
        postalCode: '08001',
        phoneNumber: {countryCode: '+34', number: ''},
      },
    };
    expect(isProfileComplete(profileData)).toBe(false);
  });

  it('returns false when nationality is missing', () => {
    const profileData: ProfileData = {
      personal: {
        firstName: 'John',
        lastName: 'Doe',
        documentType: 'nie',
        documentNumber: 'X1234567A',
        address: '123 Main St',
        city: 'Barcelona',
        postalCode: '08001',
        phoneNumber: {countryCode: '+34', number: '600123456'},
      },
    };
    expect(isProfileComplete(profileData)).toBe(false);
  });

  it('returns true when all required fields are present', () => {
    const profileData: ProfileData = {
      personal: {
        firstName: 'John',
        lastName: 'Doe',
        nationality: 'USA',
        documentType: 'nie',
        documentNumber: 'X1234567A',
        address: '123 Main St',
        city: 'Barcelona',
        postalCode: '08001',
        phoneNumber: {countryCode: '+34', number: '600123456'},
      },
    };
    expect(isProfileComplete(profileData)).toBe(true);
  });

  it('returns true when optional fields are missing but required are present', () => {
    const profileData: ProfileData = {
      personal: {
        firstName: 'John',
        lastName: 'Doe',
        nationality: 'USA',
        documentType: 'nie',
        documentNumber: 'X1234567A',
        address: '123 Main St',
        city: 'Barcelona',
        postalCode: '08001',
        phoneNumber: {countryCode: '+34', number: '600123456'},
        // Optional: secondLastName, dateOfDocumentIssuance
      },
    };
    expect(isProfileComplete(profileData)).toBe(true);
  });
});
