import {useFormSchema} from '@/features/forms/hooks/useFormSchema';
import {renderHookAsync, unmountRenderedHook} from '@/test/renderHook';

describe('useFormSchema', () => {
  afterEach(() => {
    unmountRenderedHook();
  });

  it('loads a known schema', async () => {
    const getHookState = await renderHookAsync(
      () => useFormSchema('profile-personal'),
      result => !result.isLoading,
    );

    expect(getHookState().schema?.formId).toBe('profile-personal');
    expect(getHookState().error).toBeNull();
  });
});
