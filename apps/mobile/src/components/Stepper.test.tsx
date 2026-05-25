import React from 'react';
import renderer, {act} from 'react-test-renderer';

import {Stepper} from '@/components/Stepper';
import {createTieSteps} from '@/test/fixtures/tieSteps';

describe('Stepper', () => {
  it('renders a tab for each step', () => {
    const steps = createTieSteps(3);
    const tree = renderer.create(
      <Stepper steps={steps} activeStepId={1} onStepPress={jest.fn()} />,
    );

    expect(tree.root.findAllByProps({accessibilityRole: 'tab'})).toHaveLength(3);
  });

  it('calls onStepPress when a step is selected', () => {
    const steps = createTieSteps(3);
    const onStepPress = jest.fn();
    const tree = renderer.create(
      <Stepper steps={steps} activeStepId={1} onStepPress={onStepPress} />,
    );

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
    const tree = renderer.create(
      <Stepper steps={steps} activeStepId={1} onStepPress={jest.fn()} />,
    );

    expect(JSON.stringify(tree.toJSON())).toContain('Step');
  });
});
