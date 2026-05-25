// Initialize Unistyles before any component that uses createStyleSheet
import './theme/unistyles'

import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { NavigationContainer } from '@react-navigation/native'

import { ToastProvider } from './components/Toast/ToastProvider'
import {linking} from './navigation/linking'
import RootNavigator from './navigation/RootNavigator'

const App = () => {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <NavigationContainer linking={linking}>
          <RootNavigator />
        </NavigationContainer>
      </ToastProvider>
    </SafeAreaProvider>
  );
};

export default App;
