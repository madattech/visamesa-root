export type Modelo790AutomationProfile = {
  documentNumber: string;
  fullName: string;
  address: {
    streetType?: string;
    streetName: string;
    number?: string;
    floor?: string;
    door?: string;
    city: string;
    province: string;
    postalCode: string;
  };
  phoneNumber?: string;
  feeInputId: string;
  paymentMethod: 'cash' | 'debit';
};

export const modelo790PiiConfig: Modelo790AutomationProfile = {
  documentNumber: 'Y6950398L',
  fullName: 'GIRISH SARDAR',
  address: {
    streetType: 'CALLE',
    streetName: 'PROOF STREET',
    number: 'S/N',
    city: 'BARCELONA',
    province: 'BARCELONA',
    postalCode: '08001',
  },
  phoneNumber: '600000000',
  // TIE documenting the first grant of temporary residence/stay authorization.
  feeInputId: 'tasa5Input',
  paymentMethod: 'cash',
};
