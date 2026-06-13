export interface EmpadronamientoPersonalInfo {
  identifierType: string;
  identifier: string;
  name: string;
  surname: string;
  secondSurname?: string;
  email: string;
  phone: string;
}

export interface EmpadronamientoAutomationProfile {
  personalInfo: EmpadronamientoPersonalInfo;
  motive: string;
  officeId: string;
  temaText: string;
  subTemaValue: string;
  minTime: string;
}

export const empadronamientoDemoProfile: EmpadronamientoAutomationProfile = {
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
  officeId: 'OAC-DR',
  temaText: "OAC: ATENCIÓ PRESENCIAL A L'OFICINA",
  subTemaValue: 'OAPAD',
  minTime: '10:00',
};
