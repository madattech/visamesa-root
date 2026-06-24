import {LinkingOptions} from '@react-navigation/native';

import {RootStackParamList} from '@/navigation/types';

/**
 * Deep link paths aligned with visamesa_fe routes.
 * Payment return uses visamesa://checkout/success (handled by PaymentReturnListener).
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['visamesa://', 'https://visa-mesa.web.app'],
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
              Login: 'login',
            },
          },
        },
      },
      WebsiteWebView: 'webview',
    },
  },
};
