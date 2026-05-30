import React from 'react';
import MaterialIcons from '@react-native-vector-icons/material-icons';

export const DASHBOARD_EMPTY_ICON: React.ComponentProps<
  typeof MaterialIcons
>['name'] = 'dashboard';

export const DASHBOARD_EMPTY_TITLE = 'Your progress at a glance';

export const DASHBOARD_EMPTY_SUBTITLE =
  'Once you sign in, appointments, forms, and step completion will show up here.';
