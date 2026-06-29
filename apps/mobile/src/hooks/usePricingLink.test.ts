import {Linking} from 'react-native';

import {usePricingLink} from './usePricingLink';
import {WEBSITE_PRICING_URL} from '@/config/website';
import {renderHook} from '@/test/renderHook';

const mockShowToast = jest.fn();

jest.mock('@/components/Toast/ToastProvider', () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

describe('usePricingLink', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('opens pricing URL when URL can be opened', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);
    jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined as any);

    const getHookState = renderHook(() => usePricingLink());

    await getHookState().openPricing();

    expect(Linking.canOpenURL).toHaveBeenCalledWith(WEBSITE_PRICING_URL);
    expect(Linking.openURL).toHaveBeenCalledWith(WEBSITE_PRICING_URL);
  });

  it('shows toast when URL cannot be opened', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false);
    jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined as any);

    const getHookState = renderHook(() => usePricingLink());

    await getHookState().openPricing();

    expect(Linking.canOpenURL).toHaveBeenCalledWith(WEBSITE_PRICING_URL);
    expect(Linking.openURL).not.toHaveBeenCalled();
    expect(mockShowToast).toHaveBeenCalledWith(
      'Unable to open the VisaMesa website',
    );
  });

  it('shows toast when opening URL fails', async () => {
    jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);
    jest
      .spyOn(Linking, 'openURL')
      .mockRejectedValue(new Error('Failed') as any);

    const getHookState = renderHook(() => usePricingLink());

    await getHookState().openPricing();

    expect(Linking.canOpenURL).toHaveBeenCalledWith(WEBSITE_PRICING_URL);
    expect(Linking.openURL).toHaveBeenCalledWith(WEBSITE_PRICING_URL);
    expect(mockShowToast).toHaveBeenCalledWith(
      'Unable to open the VisaMesa website',
    );
  });
});
