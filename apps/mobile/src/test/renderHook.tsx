import React, {act} from 'react';
import {I18nextProvider} from 'react-i18next';
import renderer from 'react-test-renderer';
import {i18n} from '@visamesa/content/i18n';

import {AppDialogProvider} from '@/contexts/AppDialogContext';

export function renderHook<T>(useHook: () => T): () => T {
  let hookResult: T | null = null;

  const Harness = () => {
    hookResult = useHook();
    return null;
  };

  act(() => {
    renderer.create(
      <I18nextProvider i18n={i18n as never}>
        <AppDialogProvider>
          <Harness />
        </AppDialogProvider>
      </I18nextProvider>,
    );
  });

  if (!hookResult) {
    throw new Error('Hook did not run');
  }

  return () => hookResult as T;
}

export async function flushAsyncEffects(): Promise<void> {
  await act(async () => {
    await Promise.resolve();
  });
}

export async function renderHookAsync<T>(
  useHook: () => T,
  waitFor: (result: T) => boolean,
): Promise<() => T> {
  let hookResult: T | null = null;

  const Harness = () => {
    hookResult = useHook();
    return null;
  };

  await act(async () => {
    renderer.create(
      <I18nextProvider i18n={i18n as never}>
        <AppDialogProvider>
          <Harness />
        </AppDialogProvider>
      </I18nextProvider>,
    );
  });

  if (!hookResult) {
    throw new Error('Hook did not run');
  }

  await act(async () => {
    const startedAt = Date.now();

    while (!waitFor(hookResult as T)) {
      if (Date.now() - startedAt > 1000) {
        throw new Error('Timed out waiting for hook state');
      }

      await new Promise(resolve => setTimeout(resolve, 0));
    }
  });

  return () => hookResult as T;
}
