// Initialize Unistyles before any component that uses createStyleSheet
import './theme/unistyles'

import React from 'react'
import { StatusBar, useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { NavigationContainer } from '@react-navigation/native'

import { ToastProvider } from './components/Toast/ToastProvider'
import { AuthProvider } from './contexts/AuthContext'
import {linking} from './navigation/linking'
import RootNavigator from './navigation/RootNavigator'

function AppStatusBar() {
  const colorScheme = useColorScheme();
  const {theme} = useStyles(appStylesheet);

  return (
    <StatusBar
      barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
      backgroundColor={theme.colors.background}
    />
  );
}

const appStylesheet = createStyleSheet(() => ({}));

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ToastProvider>
          <AppStatusBar />
          <NavigationContainer linking={linking}>
            <RootNavigator />
          </NavigationContainer>
        </ToastProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
