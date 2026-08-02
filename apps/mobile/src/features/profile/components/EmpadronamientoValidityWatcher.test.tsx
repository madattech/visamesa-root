import React, {useEffect} from 'react';
import {FormProvider, useForm, UseFormReturn} from 'react-hook-form';

import {EmpadronamientoValidityDialog} from '@/features/profile/components/EmpadronamientoValidityDialog';
import {EmpadronamientoValidityWatcher} from '@/features/profile/components/EmpadronamientoValidityWatcher';
import {act, renderComponent} from '@/test/testRenderer';

function TestForm({
  defaultValues,
  triggerInvalidDate,
  onReady,
}: {
  defaultValues: Record<string, unknown>;
  triggerInvalidDate?: boolean;
  onReady?: (methods: UseFormReturn<Record<string, unknown>>) => void;
}) {
  const methods = useForm({defaultValues});

  useEffect(() => {
    onReady?.(methods);
  }, [methods, onReady]);

  useEffect(() => {
    if (!triggerInvalidDate) {
      return;
    }

    methods.setValue('hasEmpadronamiento', 'yes');
    methods.setValue('empadronamientoIssuedAt', '2020-01-01');
  }, [methods, triggerInvalidDate]);

  return (
    <FormProvider {...methods}>
      <EmpadronamientoValidityWatcher />
    </FormProvider>
  );
}

describe('EmpadronamientoValidityDialog', () => {
  it('shows the validity message and actions', () => {
    const tree = renderComponent(
      <EmpadronamientoValidityDialog
        visible
        onConfirmNo={() => {}}
        onChangeDate={() => {}}
      />,
    );

    const output = JSON.stringify(tree.toJSON());
    expect(output).toContain('Certificate too old');
    expect(output).toContain('Change the date');
    expect(output).toContain('OK');
  });
});

describe('EmpadronamientoValidityWatcher', () => {
  it('shows the dialog when an expired certificate date is selected', () => {
    const tree = renderComponent(
      <TestForm
        defaultValues={{
          hasEmpadronamiento: 'no',
          empadronamientoIssuedAt: '',
        }}
      />,
    );

    act(() => {
      tree.update(
        <TestForm
          defaultValues={{
            hasEmpadronamiento: 'no',
            empadronamientoIssuedAt: '',
          }}
          triggerInvalidDate
        />,
      );
    });

    expect(JSON.stringify(tree.toJSON())).toContain('Certificate too old');
  });

  it('shows the dialog when the form loads with an expired certificate date', () => {
    const tree = renderComponent(
      <TestForm
        defaultValues={{
          hasEmpadronamiento: 'yes',
          empadronamientoIssuedAt: '2020-01-01',
        }}
      />,
    );

    expect(JSON.stringify(tree.toJSON())).toContain('Certificate too old');
  });

  it('switches empadron selection back to no when the user confirms', () => {
    let methodsRef: UseFormReturn<Record<string, unknown>> | undefined;

    const tree = renderComponent(
      <TestForm
        defaultValues={{
          hasEmpadronamiento: 'yes',
          empadronamientoIssuedAt: '2020-01-01',
        }}
        onReady={methods => {
          methodsRef = methods;
        }}
      />,
    );

    const dialogButton = tree.root
      .findAll(node => typeof node.props?.onPress === 'function')
      .find(node => node.props?.accessibilityLabel === 'OK');

    act(() => {
      dialogButton?.props.onPress();
    });

    expect(methodsRef?.getValues('hasEmpadronamiento')).toBe('no');
    expect(methodsRef?.getValues('empadronamientoIssuedAt')).toBe('');
  });
});
