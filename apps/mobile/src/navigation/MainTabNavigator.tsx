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

const Tab = createBottomTabNavigator<MainTabParamList>();

const MIN_TAB_TOUCH_TARGET = 44;

const TAB_STACKS = {
  HomeTab: HomeStackNavigator,
  DashboardTab: DashboardStackNavigator,
  ProfileTab: ProfileStackNavigator,
} as const;

function TabBarButton({style, ...props}: BottomTabBarButtonProps) {
  const {theme} = useStyles(stylesheet);

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

  const baseTabBarStyle = {
    backgroundColor: theme.colors.surface,
    borderTopColor: theme.colors.outlineVariant,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: theme.spacing.xs,
    paddingBottom: Math.max(insets.bottom, theme.spacing.xs),
    height:
      MIN_TAB_TOUCH_TARGET +
      theme.spacing.xs +
      Math.max(insets.bottom, theme.spacing.xs) +
      (Platform.OS === 'ios' ? theme.spacing.xs : 0),
    ...(Platform.OS === 'android' ? {elevation: 3} : {}),
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
          fontSize: theme.typography.labelMedium.fontSize,
          lineHeight: theme.typography.labelMedium.lineHeight,
          fontWeight: theme.typography.labelMedium.fontWeight,
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
                : undefined;

            return {
              title: tab.label,
              tabBarLabel: tab.label,
              tabBarAccessibilityLabel: tab.label,
              tabBarIcon: TAB_BAR_ICONS[tab.icon],
              tabBarStyle:
                focusedRouteName === 'Steps'
                  ? {...baseTabBarStyle, display: 'none' as const}
                  : baseTabBarStyle,
            };
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

const stylesheet = createStyleSheet(() => ({}));

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    minHeight: MIN_TAB_TOUCH_TARGET,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MainTabNavigator;
