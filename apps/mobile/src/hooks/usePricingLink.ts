import {Linking} from 'react-native';

import {WEBSITE_PRICING_URL} from '@/config/website';
import {useToast} from '@/components/Toast/ToastProvider';

export type UsePricingLinkResult = {
  openPricing: () => Promise<void>;
};

/**
 * Hook that provides a function to open the VisaMesa pricing website.
 * Handles URL validation and shows error toast on failure.
 */
export function usePricingLink(): UsePricingLinkResult {
  const {showToast} = useToast();

  const openPricing = async () => {
    try {
      const canOpen = await Linking.canOpenURL(WEBSITE_PRICING_URL);
      if (!canOpen) {
        showToast('Unable to open the VisaMesa website');
        return;
      }

      await Linking.openURL(WEBSITE_PRICING_URL);
    } catch {
      showToast('Unable to open the VisaMesa website');
    }
  };

  return {openPricing};
}
