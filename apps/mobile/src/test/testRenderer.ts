import React, {act} from 'react';
import renderer from 'react-test-renderer';

/** Avoid importing the deprecated `ReactTestRenderer` type from react-test-renderer. */
export type TestRendererTree = ReturnType<typeof renderer.create>;

export function renderComponent(element: React.ReactElement): TestRendererTree {
  let tree!: TestRendererTree;

  act(() => {
    tree = renderer.create(element);
  });

  return tree;
}

export {act, renderer};
