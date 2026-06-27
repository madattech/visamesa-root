import {useFormSchema} from '@/features/forms/hooks/useFormSchema';
import {renderHookAsync} from '@/test/renderHook';

describe('useFormSchema', () => {
  it('loads a known schema', async () => {
    const getHookState = await renderHookAsync(
      () => useFormSchema('profile-personal'),
      result => !result.isLoading,
    );

    expect(getHookState().schema?.formId).toBe('profile-personal');
    expect(getHookState().error).toBeNull();
  });
});
