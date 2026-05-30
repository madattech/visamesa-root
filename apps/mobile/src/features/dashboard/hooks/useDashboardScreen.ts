import React from 'react';
import MaterialIcons from '@react-native-vector-icons/material-icons';

import {
  DASHBOARD_EMPTY_ICON,
  DASHBOARD_EMPTY_SUBTITLE,
  DASHBOARD_EMPTY_TITLE,
} from '@/features/dashboard/data/dashboardContent';

export type UseDashboardScreenResult = {
  emptyTitle: string;
  emptySubtitle: string;
  emptyIcon: React.ComponentProps<typeof MaterialIcons>['name'];
};

export function useDashboardScreen(): UseDashboardScreenResult {
  return {
    emptyTitle: DASHBOARD_EMPTY_TITLE,
    emptySubtitle: DASHBOARD_EMPTY_SUBTITLE,
    emptyIcon: DASHBOARD_EMPTY_ICON,
  };
}
