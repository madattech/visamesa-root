import {API_ENDPOINTS} from '@/config/api';

import {paymentService} from './paymentService';

jest.mock('@/services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

const apiClient = jest.requireMock('@/services/api').default as {
  get: jest.Mock;
  post: jest.Mock;
};

describe('paymentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getEntitlements', () => {
    it('fetches entitlements from backend', async () => {
      const mockEntitlements = {
        entitlements: [
          {
            entitlementType: 'full_service',
            grantedAt: '2026-01-01T00:00:00Z',
            expiresAt: null,
          },
        ],
      };

      apiClient.get.mockResolvedValue({data: mockEntitlements});

      const result = await paymentService.getEntitlements();

      expect(result).toEqual(mockEntitlements);
      expect(apiClient.get).toHaveBeenCalledWith(
        API_ENDPOINTS.paymentEntitlements,
      );
    });

    it('throws error when API fails', async () => {
      const error = new Error('API error');
      apiClient.get.mockRejectedValue(error);

      await expect(paymentService.getEntitlements()).rejects.toThrow(
        'API error',
      );
    });

    it('returns empty entitlements when user has none', async () => {
      const mockEmptyEntitlements = {
        entitlements: [],
      };

      apiClient.get.mockResolvedValue({data: mockEmptyEntitlements});

      const result = await paymentService.getEntitlements();

      expect(result.entitlements).toEqual([]);
    });
  });

  describe('syncCheckoutSession', () => {
    it('posts session id to checkout sync endpoint', async () => {
      const mockEntitlements = {entitlements: []};
      apiClient.post.mockResolvedValue({data: mockEntitlements});

      const result = await paymentService.syncCheckoutSession('cs_test_123');

      expect(result).toEqual(mockEntitlements);
      expect(apiClient.post).toHaveBeenCalledWith(
        API_ENDPOINTS.paymentCheckoutSync,
        {sessionId: 'cs_test_123'},
      );
    });
  });
});
