const mockRemoveItem = jest.fn();
const mockNotifyUnauthorized = jest.fn();

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: (...args: unknown[]) => mockRemoveItem(...args),
  multiRemove: jest.fn(),
}));

jest.mock('./authSession', () => ({
  notifyUnauthorized: (...args: unknown[]) => mockNotifyUnauthorized(...args),
}));

jest.mock('axios', () => {
  const mockAxiosInstance = {
    interceptors: {
      request: {
        use: jest.fn(),
      },
      response: {
        use: jest.fn(),
      },
    },
  };

  return {
    __esModule: true,
    default: {
      create: jest.fn(() => mockAxiosInstance),
    },
    isAxiosError: jest.fn(),
  };
});

jest.mock('../config/api', () => ({
  API_BASE_URL: 'http://api.test',
}));

import {STORAGE_KEYS} from '@visamesa/types';

import apiClient from './api';

describe('api client', () => {
  const responseUseMock = apiClient.interceptors.response.use as jest.Mock;
  const responseErrorHandler = responseUseMock.mock.calls[0]?.[1] as
    | ((error: unknown) => Promise<unknown>)
    | undefined;

  beforeEach(() => {
    mockRemoveItem.mockClear();
    mockNotifyUnauthorized.mockClear();
  });

  it('registers axios interceptors on the shared client', () => {
    expect(apiClient.interceptors.request.use).toHaveBeenCalled();
    expect(responseUseMock).toHaveBeenCalled();
    expect(responseErrorHandler).toBeDefined();
  });

  it('clears auth storage and notifies listeners on 401 responses', async () => {
    const error = {
      response: {status: 401},
    };

    await expect(responseErrorHandler?.(error)).rejects.toBe(error);

    expect(mockRemoveItem).toHaveBeenCalledWith(STORAGE_KEYS.AUTH_TOKEN);
    expect(mockRemoveItem).toHaveBeenCalledWith(STORAGE_KEYS.USER_DATA);
    expect(mockNotifyUnauthorized).toHaveBeenCalled();
  });
});
