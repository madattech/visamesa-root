import React from 'react';
import renderer, {act} from 'react-test-renderer';
import type {ReactTestRenderer} from 'react-test-renderer';

import {Stepper} from '@/components/Stepper';
import {createTieSteps} from '@/test/fixtures/tieSteps';

jest.mock(
  'react-native/Libraries/Components/ScrollView/ScrollView',
  () => {
    const React = require('react');
    const View = require('react-native/Libraries/Components/View/View').default;

    const MockScrollView = React.forwardRef(
      (
        {children, ...props}: {children?: React.ReactNode},
        ref: React.Ref<unknown>,
      ) => React.createElement(View, {...props, ref}, children),
    );

    return {__esModule: true, default: MockScrollView};
  },
);

function renderStepper(
  props: React.ComponentProps<typeof Stepper>,
): ReactTestRenderer {
  let tree!: ReactTestRenderer;

  act(() => {
    tree = renderer.create(<Stepper {...props} />);
  });

  return tree;
}

describe('Stepper', () => {
  it('renders a tab for each step', () => {
    const steps = createTieSteps(3);
    const tree = renderStepper({
      steps,
      activeStepId: 1,
      onStepPress: jest.fn(),
    });

    expect(tree.root.findAllByProps({accessibilityRole: 'tab'})).toHaveLength(3);
  });

  it('calls onStepPress when a step is selected', () => {
    const steps = createTieSteps(3);
    const onStepPress = jest.fn();
    const tree = renderStepper({
      steps,
      activeStepId: 1,
      onStepPress,
    });

    const stepTwo = tree.root.findByProps({
      accessibilityLabel: 'Step 2: Step 2 Title Here',
    });

    act(() => {
      stepTwo.props.onPress();
    });

    expect(onStepPress).toHaveBeenCalledWith(2);
  });

  it('shows the short label derived from the step title', () => {
    const steps = createTieSteps(1);
    const tree = renderStepper({
      steps,
      activeStepId: 1,
      onStepPress: jest.fn(),
    });

    const labels = tree.root.findAll(node => {
      const child = node.children?.[0];
      return typeof child === 'string' && child === 'Step';
    });

    expect(labels.length).toBeGreaterThan(0);
  });
});
