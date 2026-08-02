import {SITE_URL} from '@visamesa/content/site';

import {linking} from '@/navigation/linking';

describe('linking', () => {
  it('includes website and app prefixes', () => {
    expect(linking.prefixes).toEqual(['visamesa://', SITE_URL]);
  });

  it('maps profile and dashboard paths aligned with the website', () => {
    expect(linking.config?.screens).toMatchObject({
      MainTabs: {
        screens: {
          DashboardTab: {
            screens: {
              Dashboard: 'dashboard',
            },
          },
          ProfileTab: {
            screens: {
              Profile: 'profile',
              Legal: 'legal',
              Login: 'login',
            },
          },
        },
      },
    });
  });
});
