import { Platform } from 'react-native';

/**
 * Marketing / checkout website (visamesa_fe).
 * Payment happens in the system browser — not in-app — for App Store compliance.
 */
export const WEBSITE_BASE_URL = __DEV__
  ? Platform.select({
      ios: 'http://localhost:5173',
      android: 'http://10.0.2.2:5173',
      default: 'http://localhost:5173',
    })!
  : 'https://visa-mesa.web.app';

export const WEBSITE_PRICING_URL = `${WEBSITE_BASE_URL}/pricing`;
