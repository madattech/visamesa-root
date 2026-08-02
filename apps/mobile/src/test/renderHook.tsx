import React, {act} from 'react';
import {I18nextProvider} from 'react-i18next';
import renderer from 'react-test-renderer';
import {i18n} from '@visamesa/content/i18n';

import {AppDialogProvider} from '@/contexts/AppDialogContext';

/** Avoid importing the deprecated `ReactTestRenderer` type from react-test-renderer. */
type TestRenderer = ReturnType<typeof renderer.create>;

let activeTree: TestRenderer | null = null;
let rerenderActiveTree: (() => void) | null = null;

function unmountActiveTree() {
  if (!activeTree) {
    return;
  }

  act(() => {
    activeTree?.unmount();
  });
  activeTree = null;
}

function mountHarness(Harness: React.ComponentType, Wrapper?: React.ComponentType<{children: React.ReactNode}>) {
  unmountActiveTree();

  let tree!: TestRenderer;
  const RootHarness = () => {
    const [, setTick] = React.useState(0);
    rerenderActiveTree = () => setTick(current => current + 1);

    const harnessElement = Wrapper ? (
      <Wrapper>
        <Harness />
      </Wrapper>
    ) : (
      <Harness />
    );

    return (
      <I18nextProvider i18n={i18n as never}>
        <AppDialogProvider>{harnessElement}</AppDialogProvider>
      </I18nextProvider>
    );
  };

  act(() => {
    tree = renderer.create(<RootHarness />);
  });

  activeTree = tree;
  return tree;
}

export function renderHook<T>(
  useHook: () => T,
  Wrapper?: React.ComponentType<{children: React.ReactNode}>,
): () => T {
  let hookResult: T | null = null;

  const Harness = () => {
    hookResult = useHook();
    return null;
  };

  mountHarness(Harness, Wrapper);

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
  Wrapper?: React.ComponentType<{children: React.ReactNode}>,
): Promise<() => T> {
  let hookResult: T | null = null;

  const Harness = () => {
    hookResult = useHook();
    return null;
  };

  await act(async () => {
    mountHarness(Harness, Wrapper);
  });

  if (!hookResult) {
    throw new Error('Hook did not run');
  }

  const startedAt = Date.now();

  while (!waitFor(hookResult as T)) {
    if (Date.now() - startedAt > 5000) {
      throw new Error('Timed out waiting for hook state');
    }

    await act(async () => {
      rerenderRenderedHook();
      await flushAsyncEffects();
    });
  }

  return () => hookResult as T;
}

export function unmountRenderedHook() {
  unmountActiveTree();
  rerenderActiveTree = null;
}

export function rerenderRenderedHook() {
  act(() => {
    rerenderActiveTree?.();
  });
}
