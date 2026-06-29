import { Linking } from 'react-native';

import { usePricingLink } from './usePricingLink';
import { WEBSITE_PRICING_URL } from '@/config/website';
import { renderHook } from '@/test/renderHook';

const mockShowToast = jest.fn();

jest.mock('@/components/Toast/ToastProvider', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

jest.mock('@/utils/openWebsiteUrl', () => ({
  openWebsiteUrl: jest.fn(),
}));

import { openWebsiteUrl } from '@/utils/openWebsiteUrl';

const mockOpenWebsiteUrl = openWebsiteUrl as jest.MockedFunction<typeof openWebsiteUrl>;

describe('usePricingLink', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('opens pricing URL when the browser accepts the link', async () => {
    mockOpenWebsiteUrl.mockResolvedValue(true);

    const getHookState = renderHook(() => usePricingLink());

    await getHookState().openPricing();

    expect(mockOpenWebsiteUrl).toHaveBeenCalledWith(WEBSITE_PRICING_URL);
    expect(Linking.canOpenURL).not.toHaveBeenCalled();
  });

  it('shows toast when opening the URL fails', async () => {
    mockOpenWebsiteUrl.mockResolvedValue(false);

    const getHookState = renderHook(() => usePricingLink());

    await getHookState().openPricing();

    expect(mockOpenWebsiteUrl).toHaveBeenCalledWith(WEBSITE_PRICING_URL);
    expect(mockShowToast).toHaveBeenCalledWith('Unable to open the VisaMesa website');
  });
});
