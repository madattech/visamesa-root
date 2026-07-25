import {act} from 'react';

import {renderHook, flushAsyncEffects} from '@/test/renderHook';
import {usePrerequisitesDialog} from './usePrerequisitesDialog';

jest.mock('@/navigation/navigationRef', () => ({
  navigateToProfile: jest.fn(),
}));

import {navigateToProfile} from '@/navigation/navigationRef';

const mockNavigateToProfile = navigateToProfile as jest.MockedFunction<
  typeof navigateToProfile
>;

describe('usePrerequisitesDialog', () => {
  beforeEach(() => {
    mockNavigateToProfile.mockReset();
  });

  it('refreshes readiness when the dialog opens', async () => {
    const refreshReadiness = jest.fn().mockResolvedValue(undefined);
    const getHookState = renderHook(() => usePrerequisitesDialog(refreshReadiness));

    expect(refreshReadiness).not.toHaveBeenCalled();

    act(() => {
      getHookState().openDialog();
    });

    await flushAsyncEffects();

    expect(getHookState().visible).toBe(true);
    expect(refreshReadiness).toHaveBeenCalledTimes(1);
  });

  it('closes the dialog and navigates to profile from the primary action', () => {
    const refreshReadiness = jest.fn().mockResolvedValue(undefined);
    const getHookState = renderHook(() => usePrerequisitesDialog(refreshReadiness));

    act(() => {
      getHookState().openDialog();
    });

    act(() => {
      getHookState().onGoToProfilePress();
    });

    expect(getHookState().visible).toBe(false);
    expect(mockNavigateToProfile).toHaveBeenCalledTimes(1);
  });

  it('closes the dialog without navigating from closeDialog', () => {
    const refreshReadiness = jest.fn().mockResolvedValue(undefined);
    const getHookState = renderHook(() => usePrerequisitesDialog(refreshReadiness));

    act(() => {
      getHookState().openDialog();
    });

    act(() => {
      getHookState().closeDialog();
    });

    expect(getHookState().visible).toBe(false);
    expect(mockNavigateToProfile).not.toHaveBeenCalled();
  });
});
