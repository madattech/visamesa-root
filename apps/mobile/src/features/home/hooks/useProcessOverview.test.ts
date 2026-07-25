import {act} from 'react';
import {i18n} from '@visamesa/content/i18n';

import {useProcessOverview} from '@/features/home/hooks/useProcessOverview';
import {flushAsyncEffects, renderHook} from '@/test/renderHook';

describe('useProcessOverview', () => {
  afterEach(async () => {
    await act(async () => {
      await i18n.changeLanguage('en');
    });
  });

  it('loads localized overview content with resolved tab hints', async () => {
    const getHookState = renderHook(() => useProcessOverview());
    await flushAsyncEffects();

    expect(getHookState().screenTitle).toBe('How VisaMesa works');
    expect(getHookState().phases[0]?.tabHint).toBe(
      'Complete these in the Profile tab.',
    );
    expect(getHookState().phases[1]?.tabHint).toBe(
      'Complete these in the Dashboard tab.',
    );
  });

  it('updates content when language changes', async () => {
    const getHookState = renderHook(() => useProcessOverview());
    await flushAsyncEffects();

    await act(async () => {
      await i18n.changeLanguage('es');
    });
    await flushAsyncEffects();

    expect(getHookState().screenTitle).toBe('Cómo funciona VisaMesa');
    expect(getHookState().phases[0]?.tabHint).toBe(
      'Completa estos pasos en la pestaña Perfil.',
    );
  });
});
