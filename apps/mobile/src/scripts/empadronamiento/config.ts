export type EmpadronamientoPersonalInfo = {
  identifierType: string;
  identifier: string;
  name: string;
  surname: string;
  secondSurname: string;
  email: string;
  phone: string;
};

export type EmpadronamientoBookingAssistantProfile = {
  personalInfo: EmpadronamientoPersonalInfo;
  motive: string;
};

export const EMPADRONAMIENTO_BOOKING_MOTIVE =
  'Booking appointment to request empadronamiento.';

/** Demo profile for script tests — not used in production injection. */
export const empadronamientoPiiConfig: EmpadronamientoBookingAssistantProfile = {
  personalInfo: {
    identifierType: 'PASSAPORT',
    identifier: 'A12345678',
    name: 'John',
    surname: 'Doe',
    secondSurname: 'Smith',
    email: 'john.doe@example.com',
    phone: '600123456',
  },
  motive: EMPADRONAMIENTO_BOOKING_MOTIVE,
};

export const emptyEmpadronamientoBookingAssistantProfile: EmpadronamientoBookingAssistantProfile =
  {
    personalInfo: {
      identifierType: 'PASSAPORT',
      identifier: '',
      name: '',
      surname: '',
      secondSurname: '',
      email: '',
      phone: '',
    },
    motive: '',
  };
