import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import WebsiteWebViewScreen from '../screens/WebsiteWebViewScreen';
import {Case, CitaPreviaDetails} from '../types';

export type RootStackParamList = {
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
      initialRouteName="WebsiteWebView"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="WebsiteWebView" component={WebsiteWebViewScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
