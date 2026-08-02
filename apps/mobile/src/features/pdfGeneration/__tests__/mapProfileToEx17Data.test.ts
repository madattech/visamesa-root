import {mapProfileToEx17Data} from '@/features/pdfGeneration/utils/mapProfileToEx17Data';

import type {ProfileData} from '@/features/profile/types/ProfileData';

describe('mapProfileToEx17Data', () => {
  it('maps profile personal fields into EX-17 applicant and notification data', () => {
    const profile: ProfileData = {
      personal: {
        firstName: 'Juan',
        lastName: 'Garcia',
        secondLastName: 'Martinez',
        dateOfBirth: '1990-05-15',
        nationality: 'Argentina',
        documentType: 'nie',
        documentNumber: 'X1234567L',
        phoneNumber: {countryCode: '+34', number: '600123456'},
        address: 'Calle Mayor 10',
        city: 'Madrid',
        postalCode: '28013',
      },
    };

    const data = mapProfileToEx17Data(profile);

    expect(data).toMatchObject({
      applicant: {
        nie: {prefix: 'X', number: '1234567', checkDigit: 'L'},
        firstName: 'JUAN',
        firstSurname: 'GARCIA',
        secondSurname: 'MARTINEZ',
        nationality: 'ARGENTINA',
        mobilePhone: '+34 600123456',
        address: {
          street: 'CALLE MAYOR 10',
          city: 'MADRID',
          postalCode: '28013',
        },
      },
      notifications: {
        fullNameOrBusinessName: 'JUAN GARCIA MARTINEZ',
        documentNumber: 'X1234567L',
      },
    });
  });

  it('maps passport number when document type is passport', () => {
    const data = mapProfileToEx17Data({
      personal: {
        documentType: 'passport',
        documentNumber: 'P12345678',
      },
    });

    expect(data).toMatchObject({
      applicant: {
        passportNumber: 'P12345678',
        nie: {prefix: '', number: '', checkDigit: ''},
      },
    });
  });
});
