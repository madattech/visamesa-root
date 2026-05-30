// Initialize Unistyles before any component that uses createStyleSheet
import './theme/unistyles'

import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { NavigationContainer } from '@react-navigation/native'

import { ToastProvider } from './components/Toast/ToastProvider'
import { AuthProvider } from './contexts/AuthContext'
import {linking} from './navigation/linking'
import RootNavigator from './navigation/RootNavigator'

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ToastProvider>
          <NavigationContainer linking={linking}>
            <RootNavigator />
          </NavigationContainer>
        </ToastProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
