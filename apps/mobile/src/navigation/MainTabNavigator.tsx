import React from 'react';
import {
  BottomTabBarButtonProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {Platform, Pressable, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {createStyleSheet, useStyles} from 'react-native-unistyles';

import DashboardStackNavigator from '@/navigation/DashboardStackNavigator';
import HomeStackNavigator from '@/navigation/HomeStackNavigator';
import ProfileStackNavigator from '@/navigation/ProfileStackNavigator';
import {TAB_BAR_ICONS} from '@/navigation/tabBarIcons';
import {TAB_CONFIG} from '@/navigation/tabConfig';
import {MainTabParamList} from '@/navigation/types';
import {createElevationStyle} from '@/theme/elevation';
import {brandFontStyle} from '@/theme/fonts';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_STACKS = {
  HomeTab: HomeStackNavigator,
  DashboardTab: DashboardStackNavigator,
  ProfileTab: ProfileStackNavigator,
} as const;

const TAB_BAR_HIDDEN_ROUTES = new Set([
  'Steps',
  'Login',
  'ProfileSection',
]);

function TabBarButton({style, ...props}: BottomTabBarButtonProps) {
  const {styles, theme} = useStyles(stylesheet);

  return (
    <Pressable
      {...props}
      style={[styles.tabButton, style]}
      android_ripple={{
        color: theme.colors.primaryContainer,
        borderless: true,
      }}
    />
  );
}

const MainTabNavigator = () => {
  const {theme} = useStyles(stylesheet);
  const insets = useSafeAreaInsets();

  const tabBarHeight =
    theme.sizes.touchTargetMin +
    theme.spacing.xs +
    Math.max(insets.bottom, theme.spacing.xs) +
    (Platform.OS === 'ios' ? theme.spacing.xs : 0);

  const baseTabBarStyle = {
    position: 'absolute' as const,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.outlineVariant,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: theme.spacing.xs,
    paddingBottom: Math.max(insets.bottom, theme.spacing.xs),
    height: tabBarHeight,
    ...createElevationStyle(3, theme.colors),
  };

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: baseTabBarStyle,
        tabBarLabelStyle: {
          ...brandFontStyle(
            theme.typography.labelMedium.fontWeight,
            theme.typography.labelMedium.fontSize,
            theme.typography.labelMedium.lineHeight,
          ),
        },
        tabBarIconStyle: {
          marginBottom: theme.spacing.xs / 2,
        },
        tabBarButton: TabBarButton,
      }}>
      {TAB_CONFIG.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={TAB_STACKS[tab.name]}
          options={({route}) => {
            const focusedRouteName =
              tab.name === 'HomeTab'
                ? getFocusedRouteNameFromRoute(route) ?? 'Home'
                : tab.name === 'ProfileTab'
                  ? getFocusedRouteNameFromRoute(route) ?? 'Profile'
                  : undefined;

            const hideTabBar =
              focusedRouteName !== undefined &&
              TAB_BAR_HIDDEN_ROUTES.has(focusedRouteName);

            return {
              title: tab.label,
              tabBarLabel: tab.label,
              tabBarAccessibilityLabel: tab.label,
              tabBarIcon: TAB_BAR_ICONS[tab.icon],
              tabBarStyle: hideTabBar
                ? {
                    ...baseTabBarStyle,
                    opacity: 0,
                    pointerEvents: 'none' as const,
                  }
                : baseTabBarStyle,
            };
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

const stylesheet = createStyleSheet(theme => ({
  tabButton: {
    flex: 1,
    minHeight: theme.sizes.touchTargetMin,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default MainTabNavigator;
