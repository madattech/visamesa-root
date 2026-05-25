import {act} from 'react-test-renderer';

import {useStepsScreen} from '@/features/home/hooks/useStepsScreen';
import {createMockStepsNavigation} from '@/test/navigation';
import {renderHook} from '@/test/renderHook';

describe('useStepsScreen', () => {
  it('opens the cita previa automation webview', () => {
    const navigation = createMockStepsNavigation();
    const getHookState = renderHook(() => useStepsScreen(navigation));

    act(() => {
      getHookState().onCitaPreviaPress();
    });

    expect(navigation.navigate).toHaveBeenCalledWith('WebsiteWebView', {
      automation: 'cita-previa',
    });
  });

  it('opens the empadronamiento automation webview', () => {
    const navigation = createMockStepsNavigation();
    const getHookState = renderHook(() => useStepsScreen(navigation));

    act(() => {
      getHookState().onEmpadronamientoPress();
    });

    expect(navigation.navigate).toHaveBeenCalledWith('WebsiteWebView', {
      automation: 'empadronamiento',
    });
  });

  it('goes back to the previous screen', () => {
    const navigation = createMockStepsNavigation();
    const getHookState = renderHook(() => useStepsScreen(navigation));

    act(() => {
      getHookState().onBackPress();
    });

    expect(navigation.goBack).toHaveBeenCalled();
  });
});
