import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import DashboardScreen from '@/screens/DashboardScreen';

import {DashboardStackParamList} from './types';

const Stack = createNativeStackNavigator<DashboardStackParamList>();

const DashboardStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
    </Stack.Navigator>
  );
};

export default DashboardStackNavigator;
