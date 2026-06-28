import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {useInternalStackScreenOptions} from '@/navigation/internalStackScreenOptions';
import HomeScreen from '@/screens/HomeScreen';
import StepsScreen from '@/screens/StepsScreen';

import {HomeStackParamList} from './types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackNavigator = () => {
  const internalStackScreenOptions = useInternalStackScreenOptions();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        contentStyle: internalStackScreenOptions.contentStyle,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Steps" component={StepsScreen} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
