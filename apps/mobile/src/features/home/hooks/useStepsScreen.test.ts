import {act} from 'react';

import {useStepsScreen} from '@/features/home/hooks/useStepsScreen';
import {createMockStepsNavigation} from '@/test/navigation';
import {renderHook} from '@/test/renderHook';

describe('useStepsScreen', () => {
  it('opens the cita previa automation webview', () => {
    const navigation = createMockStepsNavigation();
    const getHookState = renderHook(() => useStepsScreen(navigation));

    act(() => {
      getHookState().onDevActionPress('citaPrevia');
    });

    expect(navigation.navigate).toHaveBeenCalledWith('WebsiteWebView', {
      automation: 'cita-previa',
    });
  });

  it('opens the empadronamiento automation webview', () => {
    const navigation = createMockStepsNavigation();
    const getHookState = renderHook(() => useStepsScreen(navigation));

    act(() => {
      getHookState().onDevActionPress('empadronamiento');
    });

    expect(navigation.navigate).toHaveBeenCalledWith('WebsiteWebView', {
      automation: 'empadronamiento',
    });
  });
});
