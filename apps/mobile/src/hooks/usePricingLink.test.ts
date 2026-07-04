import {act} from 'react';

import {usePricingLink} from '@/hooks/usePricingLink';
import {renderHook} from '@/test/renderHook';

const mockShowToast = jest.fn();
const mockOpenWebsiteUrl = jest.fn();

jest.mock('@/components/Toast/ToastProvider', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

jest.mock('@/utils/openWebsiteUrl', () => ({
  openWebsiteUrl: (...args: unknown[]) => mockOpenWebsiteUrl(...args),
}));

jest.mock('@/config/website', () => ({
  WEBSITE_PRICING_URL: 'http://localhost:5173/pricing',
}));

describe('usePricingLink', () => {
  beforeEach(() => {
    mockShowToast.mockReset();
    mockOpenWebsiteUrl.mockResolvedValue(true);
  });

  it('opens pricing with app source query param', async () => {
    const getHookState = renderHook(() => usePricingLink());

    await act(async () => {
      await getHookState().openPricing();
    });

    expect(mockOpenWebsiteUrl).toHaveBeenCalledWith(
      'http://localhost:5173/pricing?source=app',
    );
  });

  it('opens pricing without app source for status view', async () => {
    const getHookState = renderHook(() => usePricingLink());

    await act(async () => {
      await getHookState().openPricingStatus();
    });

    expect(mockOpenWebsiteUrl).toHaveBeenCalledWith(
      'http://localhost:5173/pricing',
    );
  });
});
