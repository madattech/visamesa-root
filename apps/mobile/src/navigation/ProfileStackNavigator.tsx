import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {ProfileDataProvider} from '@/features/profile/context/ProfileDataContext';
import {getProfileSection} from '@/features/profile/data/profileSections';
import {useInternalStackScreenOptions} from '@/navigation/internalStackScreenOptions';
import LoginScreen from '@/screens/LoginScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import ProfileSectionScreen from '@/screens/ProfileSectionScreen';

import {ProfileStackParamList} from './types';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

function ProfileStackScreens() {
  const internalStackScreenOptions = useInternalStackScreenOptions();

  return (
    <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerShown: false,
        contentStyle: internalStackScreenOptions.contentStyle,
      }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen
        name="ProfileSection"
        component={ProfileSectionScreen}
        options={({route}) => ({
          ...internalStackScreenOptions,
          title: getProfileSection(route.params.sectionId).title,
        })}
      />
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
}

const ProfileStackNavigator = () => (
  <ProfileDataProvider>
    <ProfileStackScreens />
  </ProfileDataProvider>
);

export default ProfileStackNavigator;
