import type {ProfileData} from '@/features/profile/types/ProfileData';

type PhoneValue = string | {countryCode?: string; number?: string};

function text(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function upper(value: unknown) {
  return text(value).toUpperCase();
}

function phoneToText(value: unknown) {
  if (typeof value === 'string') {
    return value;
  }

  if (value && typeof value === 'object') {
    const phone = value as PhoneValue;
    if (typeof phone === 'object') {
      return [phone.countryCode, phone.number].filter(Boolean).join(' ');
    }
  }

  return '';
}

function parseNie(documentNumber: string) {
  const normalized = documentNumber.replace(/\s+/g, '').toUpperCase();
  const match = normalized.match(/^([XYZ])(\d+)([A-Z])$/);

  if (!match) {
    return {prefix: '', number: '', checkDigit: ''};
  }

  return {
    prefix: match[1],
    number: match[2],
    checkDigit: match[3],
  };
}

export function mapProfileToEx17Data(profileData: ProfileData) {
  const personal = profileData.personal ?? {};
  const documentType = text(personal.documentType);
  const documentNumber = text(personal.documentNumber);
  const nie = documentType === 'nie' ? parseNie(documentNumber) : null;
  const fullName = [
    upper(personal.firstName),
    upper(personal.lastName),
    upper(personal.secondLastName),
  ]
    .filter(Boolean)
    .join(' ');
  const phoneNumber = phoneToText(personal.phoneNumber);
  const today = new Date().toISOString().slice(0, 10);

  return {
    applicant: {
      passportNumber: documentType === 'passport' ? documentNumber : '',
      nie: {
        prefix: nie?.prefix ?? '',
        number: nie?.number ?? '',
        checkDigit: nie?.checkDigit ?? '',
      },
      firstSurname: upper(personal.lastName),
      secondSurname: upper(personal.secondLastName),
      firstName: upper(personal.firstName),
      sex: '',
      birthDate: text(personal.dateOfBirth),
      birthPlace: '',
      birthCountry: '',
      nationality: upper(personal.nationality),
      maritalStatus: '',
      fatherName: '',
      motherName: '',
      address: {
        street: upper(personal.address),
        number: '',
        floor: '',
        city: upper(personal.city),
        postalCode: text(personal.postalCode),
        province: upper(personal.city),
      },
      mobilePhone: phoneNumber,
      email: '',
      legalRepresentative: {
        fullName: '',
        documentNumber: '',
        relationshipTitle: '',
      },
    },
    presenter: {
      fullNameOrBusinessName: '',
      documentNumber: '',
      address: {
        street: '',
        number: '',
        floor: '',
        city: '',
        postalCode: '',
        province: '',
      },
      mobilePhone: '',
      email: '',
      legalRepresentative: {
        fullName: '',
        documentNumber: '',
        relationshipTitle: '',
      },
    },
    notifications: {
      fullNameOrBusinessName: fullName,
      documentNumber,
      address: {
        street: upper(personal.address),
        number: '',
        floor: '',
        city: upper(personal.city),
        postalCode: text(personal.postalCode),
        province: upper(personal.city),
      },
      mobilePhone: phoneNumber,
      email: '',
      dehuConsent: false,
    },
    request: {
      cardholderFullName: fullName,
      documentType: 'initialCard',
    },
    signature: {
      place: upper(personal.city),
      date: today,
      signatureTextOrImagePlaceholder: '',
    },
    destination: {
      office: '',
      dir3Code: '',
      province: upper(personal.city),
    },
  };
}
