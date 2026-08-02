import React, {act} from 'react';

import {AuthProvider, useAuth} from '@/contexts/AuthContext';
import {authService} from '@/services/authService';
import {notifyUnauthorized} from '@/services/authSession';
import {renderHookAsync, unmountRenderedHook} from '@/test/renderHook';

jest.mock('@/services/authService', () => ({
  authService: {
    getStoredUser: jest.fn(),
    getCurrentUser: jest.fn(),
    signInWithGoogle: jest.fn(),
    logout: jest.fn(),
  },
}));

jest.mock('@/services/authSession', () => ({
  onUnauthorized: jest.fn((listener: () => void) => {
    unauthorizedListener = listener;
    return jest.fn();
  }),
  notifyUnauthorized: jest.fn(),
}));

let unauthorizedListener: (() => void) | null = null;

function AuthWrapper({children}: {children: React.ReactNode}) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    unauthorizedListener = null;
  });

  afterEach(() => {
    unmountRenderedHook();
  });

  it('bootstraps as signed out when no stored user exists', async () => {
    (authService.getStoredUser as jest.Mock).mockResolvedValue(null);

    const getHookState = await renderHookAsync(
      () => useAuth(),
      state => !state.isLoading,
      AuthWrapper,
    );

    expect(getHookState().user).toBeNull();
    expect(getHookState().isAuthenticated).toBe(false);
  });

  it('loads the current user when a stored session exists', async () => {
    (authService.getStoredUser as jest.Mock).mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
    });
    (authService.getCurrentUser as jest.Mock).mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
    });

    const getHookState = await renderHookAsync(
      () => useAuth(),
      state => !state.isLoading,
      AuthWrapper,
    );

    expect(getHookState().user).toEqual({
      id: 'user-1',
      email: 'user@example.com',
    });
  });

  it('clears the user when unauthorized notifications fire', async () => {
    (authService.getStoredUser as jest.Mock).mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
    });
    (authService.getCurrentUser as jest.Mock).mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
    });
    (authService.logout as jest.Mock).mockResolvedValue(undefined);

    const getHookState = await renderHookAsync(
      () => useAuth(),
      state => !state.isLoading,
      AuthWrapper,
    );

    await act(async () => {
      unauthorizedListener?.();
    });

    expect(authService.logout).toHaveBeenCalled();
    expect(getHookState().user).toBeNull();
    expect(notifyUnauthorized).not.toHaveBeenCalled();
  });
});
