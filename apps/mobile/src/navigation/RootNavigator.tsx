import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Screens
import WebsiteWebViewScreen from '../screens/WebsiteWebViewScreen';
import {Case} from '../types';

export type RootStackParamList = {
  Login: undefined;
  CaseList: undefined;
  Automation: {case: Case};
  WebsiteWebView: {
    url?: string;
    title?: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="WebsiteWebView"
        component={WebsiteWebViewScreen}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
