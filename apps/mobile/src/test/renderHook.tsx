import React, {act} from 'react';
import renderer from 'react-test-renderer';

export function renderHook<T>(useHook: () => T): () => T {
  let hookResult: T | null = null;

  const Harness = () => {
    hookResult = useHook();
    return null;
  };

  act(() => {
    renderer.create(<Harness />);
  });

  if (!hookResult) {
    throw new Error('Hook did not run');
  }

  return () => hookResult as T;
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
    renderer.create(<Harness />);
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
