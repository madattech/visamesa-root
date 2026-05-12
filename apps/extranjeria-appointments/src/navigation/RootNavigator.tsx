import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAuth} from '../contexts/AuthContext';
import {ActivityIndicator, View, StyleSheet} from 'react-native';

// Screens
import LoginScreen from '../screens/LoginScreen';
import CaseListScreen from '../screens/CaseListScreen';
import AutomationScreen from '../screens/AutomationScreen';
import {Case} from '../types';

export type RootStackParamList = {
  Login: undefined;
  CaseList: undefined;
  Automation: {case: Case};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const {isAuthenticated, isLoading} = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      {!isAuthenticated ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
      ) : (
        <>
          <Stack.Screen
            name="CaseList"
            component={CaseListScreen}
            options={{title: 'My Cases'}}
          />
          <Stack.Screen
            name="Automation"
            component={AutomationScreen}
            options={{title: 'Appointment Automation'}}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default RootNavigator;
