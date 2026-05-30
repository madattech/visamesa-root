import profileBilling from '../data/profile-billing.json';
import profilePersonal from '../data/profile-personal.json';
import profileResidenceRegistration from '../data/profile-residence-registration.json';
import {FormSchema} from '../types/formTypes';

const FORM_SCHEMAS: Record<string, FormSchema> = {
  'profile-personal': profilePersonal as FormSchema,
  'profile-billing': profileBilling as FormSchema,
  'profile-residence-registration':
    profileResidenceRegistration as FormSchema,
};

export async function fetchFormSchema(formId: string): Promise<FormSchema> {
  // TODO: replace with API call when BE endpoint is ready
  const schema = FORM_SCHEMAS[formId];

  if (!schema) {
    throw new Error(`Form schema not found: ${formId}`);
  }

  return schema;
}
