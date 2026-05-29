import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import MainTabNavigator from '@/navigation/MainTabNavigator';
import {RootStackParamList} from '@/navigation/types';
import WebsiteWebViewScreen from '@/screens/WebsiteWebViewScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen
        name="WebsiteWebView"
        component={WebsiteWebViewScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;

export type {RootStackParamList} from '@/navigation/types';
