import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {useInternalStackScreenOptions} from '@/navigation/internalStackScreenOptions';
import DashboardScreen from '@/features/dashboard/screens/DashboardScreen';
import DashboardStepDetailScreen from '@/features/dashboard/screens/DashboardStepDetailScreen';

import {DashboardStackParamList} from './types';

const Stack = createNativeStackNavigator<DashboardStackParamList>();

const DashboardStackNavigator = () => {
  const internalStackScreenOptions = useInternalStackScreenOptions();

  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        contentStyle: internalStackScreenOptions.contentStyle,
      }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="StepDetail" component={DashboardStepDetailScreen} />
    </Stack.Navigator>
  );
};

export default DashboardStackNavigator;
