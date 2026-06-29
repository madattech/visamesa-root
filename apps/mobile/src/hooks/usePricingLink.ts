import {WEBSITE_PRICING_URL} from '@/config/website';
import {useToast} from '@/components/Toast/ToastProvider';
import {openWebsiteUrl} from '@/utils/openWebsiteUrl';

export type UsePricingLinkResult = {
  openPricing: () => Promise<void>;
};

/**
 * Hook that provides a function to open the VisaMesa pricing website.
 */
export function usePricingLink(): UsePricingLinkResult {
  const {showToast} = useToast();

  const openPricing = async () => {
    const opened = await openWebsiteUrl(WEBSITE_PRICING_URL);
    if (!opened) {
      showToast('Unable to open the VisaMesa website');
    }
  };

  return {openPricing};
}
