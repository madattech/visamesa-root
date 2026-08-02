import profilePersonalSchema from '@/features/forms/data/profile-personal.json';
import type {FormSchema} from '@/features/forms/types/formTypes';

import {generateZodSchema} from './schemaGenerator';

const personalSchema = profilePersonalSchema as FormSchema;
const translate = (key: string) => key;

const basePersonalData = {
  firstName: 'Jane',
  lastName: 'Doe',
  secondLastName: '',
  dateOfBirth: '1990-01-01',
  nationality: 'Spain',
  documentType: 'passport',
  documentNumber: 'AB123456',
  phoneNumber: {countryCode: '34', number: '600000000'},
  address: 'Carrer Example 1',
  city: 'Barcelona',
  postalCode: '08001',
};

describe('generateZodSchema', () => {
  it('does not require empadronamiento date when user selects no', () => {
    const validationSchema = generateZodSchema(personalSchema, translate);

    const result = validationSchema.safeParse({
      ...basePersonalData,
      hasEmpadronamiento: 'no',
      empadronamientoIssuedAt: '',
    });

    expect(result.success).toBe(true);
  });

  it('requires empadronamiento date when user selects yes', () => {
    const validationSchema = generateZodSchema(personalSchema, translate);

    const result = validationSchema.safeParse({
      ...basePersonalData,
      hasEmpadronamiento: 'yes',
      empadronamientoIssuedAt: '',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.path[0] === 'empadronamientoIssuedAt')).toBe(
        true,
      );
    }
  });

  it('rejects empadronamiento dates older than 90 days', () => {
    const validationSchema = generateZodSchema(personalSchema, translate);

    const result = validationSchema.safeParse({
      ...basePersonalData,
      hasEmpadronamiento: 'yes',
      empadronamientoIssuedAt: '2020-01-01',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.path[0] === 'empadronamientoIssuedAt')).toBe(
        true,
      );
    }
  });

  it('allows stale empadronamiento dates when user selects no', () => {
    const validationSchema = generateZodSchema(personalSchema, translate);

    const result = validationSchema.safeParse({
      ...basePersonalData,
      hasEmpadronamiento: 'no',
      empadronamientoIssuedAt: '2020-01-01',
    });

    expect(result.success).toBe(true);
  });

  it('requires both phone code and number', () => {
    const validationSchema = generateZodSchema(personalSchema, translate);

    const result = validationSchema.safeParse({
      ...basePersonalData,
      phoneNumber: {countryCode: '', number: '600000000'},
      hasEmpadronamiento: 'no',
      empadronamientoIssuedAt: '',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some(issue => issue.path[0] === 'phoneNumber')).toBe(true);
    }
  });
});
