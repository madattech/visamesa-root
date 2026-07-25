import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {useInternalStackScreenOptions} from '@/navigation/internalStackScreenOptions';
import LegalScreen from '@/screens/LegalScreen';
import LoginScreen from '@/screens/LoginScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import ProfileSectionScreen from '@/screens/ProfileSectionScreen';
import SettingsScreen from '@/screens/SettingsScreen';

import {ProfileStackParamList} from './types';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStackNavigator = () => {
  const internalStackScreenOptions = useInternalStackScreenOptions();

  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerShown: false,
        contentStyle: internalStackScreenOptions.contentStyle,
      }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ProfileSection" component={ProfileSectionScreen} />
      <Stack.Screen name="Legal" component={LegalScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
