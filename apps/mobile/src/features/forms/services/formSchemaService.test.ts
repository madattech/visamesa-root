import {fetchFormSchema} from '@/features/forms/services/formSchemaService';

describe('fetchFormSchema', () => {
  it('returns the personal profile schema', async () => {
    const schema = await fetchFormSchema('profile-personal');

    expect(schema.formId).toBe('profile-personal');
    expect(schema.fields.length).toBeGreaterThan(0);
  });

  it('throws for unknown form ids', async () => {
    await expect(fetchFormSchema('unknown-form')).rejects.toThrow(
      'Form schema not found: unknown-form',
    );
  });
});
