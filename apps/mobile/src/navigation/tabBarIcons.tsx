import {BottomTabNavigationOptions} from '@react-navigation/bottom-tabs';
import React from 'react';
import {MaterialIcons} from '@react-native-vector-icons/material-icons/static';

import {TabIconName} from '@/navigation/tabConfig';

const TAB_ICON_SIZE = 24;

function createTabIcon(name: TabIconName): NonNullable<BottomTabNavigationOptions['tabBarIcon']> {
  return ({color, size}) => (
    <MaterialIcons
      name={name}
      size={size || TAB_ICON_SIZE}
      color={color}
    />
  );
}

export const TAB_BAR_ICONS: Record<
  TabIconName,
  NonNullable<BottomTabNavigationOptions['tabBarIcon']>
> = {
  home: createTabIcon('home'),
  checklist: createTabIcon('checklist'),
  person: createTabIcon('person'),
};
