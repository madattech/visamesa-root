export type EmpadronamientoPersonalInfo = {
  identifierType: string;
  identifier: string;
  name: string;
  surname: string;
  secondSurname: string;
  email: string;
  phone: string;
};

export type EmpadronamientoAutomationProfile = {
  personalInfo: EmpadronamientoPersonalInfo;
  motive: string;
};

export const empadronamientoPiiConfig: EmpadronamientoAutomationProfile = {
  personalInfo: {
    identifierType: 'PASSAPORT',
    identifier: 'A12345678',
    name: 'John',
    surname: 'Doe',
    secondSurname: 'Smith',
    email: 'john.doe@example.com',
    phone: '600123456',
  },
  motive: 'Booking appointment to request empadronamiento.',
};
