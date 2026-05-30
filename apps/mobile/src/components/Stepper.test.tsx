import React from 'react';

import {Stepper} from '@/components/Stepper';
import {createTieSteps} from '@/test/fixtures/tieSteps';
import {act, renderComponent, TestRendererTree} from '@/test/testRenderer';

jest.mock(
  'react-native/Libraries/Components/ScrollView/ScrollView',
  () => {
    const ReactModule = require('react');
    const {View} = require('react-native');

    const MockScrollView = ReactModule.forwardRef(
      (
        {children, ...props}: {children?: React.ReactNode},
        ref: React.Ref<unknown>,
      ) => ReactModule.createElement(View, {...props, ref}, children),
    );

    return {__esModule: true, default: MockScrollView};
  },
);

function renderStepper(
  props: React.ComponentProps<typeof Stepper>,
): TestRendererTree {
  return renderComponent(<Stepper {...props} />);
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
