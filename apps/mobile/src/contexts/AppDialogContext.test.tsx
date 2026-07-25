import React from 'react';
import {act} from 'react';
import {I18nextProvider} from 'react-i18next';
import renderer from 'react-test-renderer';
import {i18n} from '@visamesa/content/i18n';

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
        <I18nextProvider i18n={i18n as never}>
          <AppDialogProvider>
            <TestHarness onReady={value => { dialogApi = value; }} />
          </AppDialogProvider>
        </I18nextProvider>,
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
