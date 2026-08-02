import type {TFunction} from 'i18next';
import profilePersonalSchema from '@/features/forms/data/profile-personal.json';
import type {FormSchema} from '@/features/forms/types/formTypes';
import {generateZodSchema} from '@/features/forms/utils/schemaGenerator';
import {localizeFormSchema} from '@/features/forms/utils/localizeFormSchema';
import {i18n} from '@visamesa/content/i18n';

const personalSchema = profilePersonalSchema as FormSchema;

describe('DynamicForm', () => {
  it('builds a localized schema with save copy and required field validation', () => {
    const localized = localizeFormSchema(
      personalSchema,
      i18n.getFixedT('en', 'forms') as TFunction<'forms'>,
    );
    const zodSchema = generateZodSchema(localized, (key, options) =>
      i18n.t(key as never, {
        ns: 'forms',
        ...(options as Record<string, string>),
      }),
    );

    expect(localized.title).toBe('Personal Information');
    expect(i18n.t('actions.save', {ns: 'forms'})).toBe('Save');

    const result = zodSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('exposes the review hint copy used after invalid submit', () => {
    expect(i18n.t('validation.reviewForm', {ns: 'forms'})).toContain(
      'Some fields need correction',
    );
  });
});
