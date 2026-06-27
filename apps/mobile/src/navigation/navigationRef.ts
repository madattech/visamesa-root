import { createNavigationContainerRef } from '@react-navigation/native';

import { RootStackParamList } from '@/navigation/types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigateToDashboard() {
  if (!navigationRef.isReady()) {
    return;
  }

  navigationRef.navigate('MainTabs', {
    screen: 'DashboardTab',
    params: { screen: 'Dashboard' },
  });
}

export function navigateToProfile() {
  if (!navigationRef.isReady()) {
    return;
  }

  navigationRef.navigate('MainTabs', {
    screen: 'ProfileTab',
    params: { screen: 'Profile' },
  });
}
