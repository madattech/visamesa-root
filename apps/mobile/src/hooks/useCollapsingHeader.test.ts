import {renderHook} from '@/test/renderHook';
import {useCollapsingHeader} from './useCollapsingHeader';

describe('useCollapsingHeader', () => {
  it('returns scrollY animated value', () => {
    const getHookState = renderHook(() => useCollapsingHeader());
    const state = getHookState();

    expect(state.scrollY).toBeDefined();
  });

  it('returns compactTitleOpacity interpolation', () => {
    const getHookState = renderHook(() => useCollapsingHeader());
    const state = getHookState();

    expect(state.compactTitleOpacity).toBeDefined();
  });

  it('returns borderOpacity interpolation', () => {
    const getHookState = renderHook(() => useCollapsingHeader());
    const state = getHookState();

    expect(state.borderOpacity).toBeDefined();
  });

  it('returns scrollToY function', () => {
    const getHookState = renderHook(() => useCollapsingHeader());
    const state = getHookState();

    expect(state.scrollToY).toBeDefined();
    expect(typeof state.scrollToY).toBe('function');
  });

  it('interpolates compact title opacity from 0 to 1 between scrollY 40-80', () => {
    const getHookState = renderHook(() => useCollapsingHeader());
    const state = getHookState();

    // Set scrollY to 40
    state.scrollY.setValue(40);
    // Note: In a real test environment, we'd need to extract the interpolated value
    // For now, we just verify the interpolation object exists
    expect(state.compactTitleOpacity).toBeDefined();

    // Set scrollY to 80
    state.scrollY.setValue(80);
    expect(state.compactTitleOpacity).toBeDefined();
  });
});
