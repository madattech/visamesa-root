import React from 'react';

import {Checkbox} from './Checkbox';
import {renderComponent, act} from '@/test/testRenderer';

describe('Checkbox', () => {
  it('renders check-circle when checked', () => {
    const tree = renderComponent(
      <Checkbox checked={true} onToggle={jest.fn()} />,
    );
    const json = tree.toJSON();

    expect(JSON.stringify(json)).toContain('check-circle');
  });

  it('renders radio-button-unchecked when not checked', () => {
    const tree = renderComponent(
      <Checkbox checked={false} onToggle={jest.fn()} />,
    );
    const json = tree.toJSON();

    expect(JSON.stringify(json)).toContain('radio-button-unchecked');
  });

  it('calls onToggle when pressed', () => {
    const onToggle = jest.fn();
    const tree = renderComponent(<Checkbox checked={false} onToggle={onToggle} />);

    const pressable = tree.root.findByProps({accessibilityRole: 'checkbox'});

    act(() => {
      pressable.props.onPress();
    });

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('marks checkbox as disabled when disabled prop is true', () => {
    const onToggle = jest.fn();
    const tree = renderComponent(
      <Checkbox checked={false} onToggle={onToggle} disabled={true} />,
    );

    const pressable = tree.root.findByProps({accessibilityRole: 'checkbox'});

    expect(pressable.props.disabled).toBe(true);
    expect(pressable.props.accessibilityState.disabled).toBe(true);
  });
});
