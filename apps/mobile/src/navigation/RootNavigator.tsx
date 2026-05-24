import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import WebsiteWebViewScreen from '../screens/WebsiteWebViewScreen';
import {Case, CitaPreviaDetails} from '../types';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  CaseList: undefined;
  Automation: {case: Case};
  WebsiteWebView: {
    url?: string;
    title?: string;
    details?: CitaPreviaDetails;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="WebsiteWebView" component={WebsiteWebViewScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
