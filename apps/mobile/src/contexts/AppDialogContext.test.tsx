import React from 'react';
import {act} from 'react';
import renderer from 'react-test-renderer';

import {AppDialogProvider, useAppDialog} from '@/contexts/AppDialogContext';

function TestHarness({
  onReady,
}: {
  onReady: (value: ReturnType<typeof useAppDialog>) => void;
}) {
  const dialog = useAppDialog();
  onReady(dialog);
  return null;
}

describe('AppDialogContext', () => {
  it('maps destructive alert buttons to destructive variant', () => {
    let dialogApi: ReturnType<typeof useAppDialog> | null = null;

    act(() => {
      renderer.create(
        <AppDialogProvider>
          <TestHarness onReady={value => { dialogApi = value; }} />
        </AppDialogProvider>,
      );
    });

    const onPress = jest.fn();

    act(() => {
      dialogApi?.showAlert('Title', 'Message', [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Delete', style: 'destructive', onPress},
      ], {dismissable: false});
    });

    act(() => {
      onPress();
    });

    expect(onPress).toHaveBeenCalled();
  });
});
