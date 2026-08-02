import {WEBSITE_PRICING_URL} from '@/config/website';
import {useToast} from '@/components/Toast/ToastProvider';
import {openWebsiteUrl} from '@/utils/openWebsiteUrl';
import {i18n} from '@visamesa/content/i18n';

const APP_CHECKOUT_SOURCE = 'source=app';

export type UsePricingLinkResult = {
  openPricing: () => Promise<void>;
  openPricingStatus: () => Promise<void>;
};

/**
 * Hook that provides a function to open the VisaMesa pricing website.
 */
export function usePricingLink(): UsePricingLinkResult {
  const {showToast} = useToast();

  const openWebsitePricing = async (pricingUrl: string) => {
    const opened = await openWebsiteUrl(pricingUrl);
    if (!opened) {
      showToast(i18n.t('errors.openWebsite', {ns: 'common'}));
    }
  };

  const openPricing = async () => {
    await openWebsitePricing(`${WEBSITE_PRICING_URL}?${APP_CHECKOUT_SOURCE}`);
  };

  const openPricingStatus = async () => {
    await openWebsitePricing(WEBSITE_PRICING_URL);
  };

  return {openPricing, openPricingStatus};
}
