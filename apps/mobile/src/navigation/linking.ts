import {LinkingOptions} from '@react-navigation/native';

import {RootStackParamList} from '@/navigation/types';

/**
 * Deep link paths aligned with visamesa_fe routes.
 * Wire up when auth and universal links are ready.
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['visamesa://'],
  config: {
    screens: {
      MainTabs: {
        screens: {
          HomeTab: {
            screens: {
              Home: '',
              Steps: 'steps',
            },
          },
          DashboardTab: {
            screens: {
              Dashboard: 'dashboard',
            },
          },
          ProfileTab: {
            screens: {
              Profile: 'profile',
            },
          },
        },
      },
      WebsiteWebView: 'webview',
    },
  },
};
