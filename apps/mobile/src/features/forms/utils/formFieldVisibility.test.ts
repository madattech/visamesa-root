import type {FormField} from '@/features/forms/types/formTypes';

import {isFieldVisible} from './formFieldVisibility';

const conditionalField: FormField = {
  id: 'empadronamientoIssuedAt',
  label: 'Date',
  type: 'date',
  required: true,
  dependsOn: {
    fieldId: 'hasEmpadronamiento',
    value: 'yes',
  },
};

describe('isFieldVisible', () => {
  it('shows fields without dependencies', () => {
    const field: FormField = {
      id: 'firstName',
      label: 'First Name',
      type: 'text',
    };

    expect(isFieldVisible(field, {})).toBe(true);
  });

  it('shows conditional fields when dependency matches', () => {
    expect(
      isFieldVisible(conditionalField, {hasEmpadronamiento: 'yes'}),
    ).toBe(true);
  });

  it('hides conditional fields when dependency does not match', () => {
    expect(
      isFieldVisible(conditionalField, {hasEmpadronamiento: 'no'}),
    ).toBe(false);
    expect(isFieldVisible(conditionalField, {})).toBe(false);
  });
});
