import {act} from 'react-test-renderer';

import {useStepsScreen} from '@/features/home/hooks/useStepsScreen';
import {createMockNavigation} from '@/test/navigation';
import {renderHook} from '@/test/renderHook';

describe('useStepsScreen', () => {
  it('opens the automation webview', () => {
    const navigation = createMockNavigation<'Steps'>();
    const getHookState = renderHook(() => useStepsScreen(navigation));

    act(() => {
      getHookState().onStartAutomation();
    });

    expect(navigation.navigate).toHaveBeenCalledWith('WebsiteWebView', {});
  });

  it('goes back to the previous screen', () => {
    const navigation = createMockNavigation<'Steps'>();
    const getHookState = renderHook(() => useStepsScreen(navigation));

    act(() => {
      getHookState().onBackPress();
    });

    expect(navigation.goBack).toHaveBeenCalled();
  });
});
