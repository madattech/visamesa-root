import React, {act} from 'react';
import {I18nextProvider} from 'react-i18next';
import renderer from 'react-test-renderer';
import {i18n} from '@visamesa/content/i18n';

/** Avoid importing the deprecated `ReactTestRenderer` type from react-test-renderer. */
export type TestRendererTree = ReturnType<typeof renderer.create>;

export function renderComponent(element: React.ReactElement): TestRendererTree {
  let tree!: TestRendererTree;

  act(() => {
    tree = renderer.create(
      React.createElement(I18nextProvider, {i18n: i18n as never}, element),
    );
  });

  return tree;
}

export {act, renderer};
