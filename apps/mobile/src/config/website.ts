import { Platform } from 'react-native';

import { SITE_URL } from '@visamesa/content/site';

/**
 * Marketing / checkout website (visamesa_fe).
 * Payment happens in the system browser — not in-app — for App Store compliance.
 */
export const WEBSITE_BASE_URL = __DEV__
  ? Platform.select({
      ios: 'http://localhost:5173',
      android: 'http://localhost:5173',
      default: 'http://localhost:5173',
    })!
  : SITE_URL;

export const WEBSITE_PRICING_URL = `${WEBSITE_BASE_URL}/pricing`;

export function getWebsiteUrl(path = ''): string {
  if (!path) {
    return WEBSITE_BASE_URL;
  }

  return `${WEBSITE_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
