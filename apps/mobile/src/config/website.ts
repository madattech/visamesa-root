import { Platform } from 'react-native';

import { SITE_URL } from '@visamesa/content/site';

/**
 * Marketing / checkout website (visamesa_fe).
 * Payment happens in the system browser — not in-app — for App Store compliance.
 *
 * When testing on a physical device, set DEV_WEBSITE_BASE_URL to your computer's LAN IP
 * (e.g. `http://192.168.1.42:5173`). Simulators use localhost / 10.0.2.2 automatically.
 */
export const DEV_WEBSITE_BASE_URL: string | null = null;

export const WEBSITE_BASE_URL = __DEV__
  ? (DEV_WEBSITE_BASE_URL ??
    Platform.select({
      ios: 'http://localhost:5173',
      android: 'http://10.0.2.2:5173',
      default: 'http://localhost:5173',
    })!)
  : SITE_URL;

export const WEBSITE_PRICING_URL = `${WEBSITE_BASE_URL}/pricing`;

export function getWebsiteUrl(path = ''): string {
  if (!path) {
    return WEBSITE_BASE_URL;
  }

  return `${WEBSITE_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
