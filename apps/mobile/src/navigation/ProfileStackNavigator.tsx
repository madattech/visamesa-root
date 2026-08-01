import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {useInternalStackScreenOptions} from '@/navigation/internalStackScreenOptions';
import LegalScreen from '@/features/legal/screens/LegalScreen';
import LoginScreen from '@/features/auth/screens/LoginScreen';
import ProfileScreen from '@/features/profile/screens/ProfileScreen';
import ProfileSectionScreen from '@/features/profile/screens/ProfileSectionScreen';
import SettingsScreen from '@/features/settings/screens/SettingsScreen';

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
