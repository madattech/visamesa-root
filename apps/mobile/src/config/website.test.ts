import {getWebsiteUrl, WEBSITE_BASE_URL} from '@/config/website';
import {SITE_URL} from '@visamesa/content/site';

describe('getWebsiteUrl', () => {
  it('builds absolute paths from the configured base URL', () => {
    expect(getWebsiteUrl('/privacy')).toBe(`${WEBSITE_BASE_URL}/privacy`);
    expect(getWebsiteUrl('terms')).toBe(`${WEBSITE_BASE_URL}/terms`);
    expect(getWebsiteUrl()).toBe(WEBSITE_BASE_URL);
  });

  it('uses shared SITE_URL in production builds', () => {
    const originalDev = (global as {__DEV__?: boolean}).__DEV__;

    try {
      (global as {__DEV__?: boolean}).__DEV__ = false;
      jest.resetModules();

      const {WEBSITE_BASE_URL: productionBaseUrl} = require('@/config/website') as typeof import('@/config/website');

      expect(productionBaseUrl).toBe(SITE_URL);
    } finally {
      (global as {__DEV__?: boolean}).__DEV__ = originalDev;
      jest.resetModules();
    }
  });
});
