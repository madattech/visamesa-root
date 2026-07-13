// Initialize Unistyles before any component that uses createStyleSheet
import './theme/unistyles'

import React from 'react'
import { StatusBar, useColorScheme } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { NavigationContainer } from '@react-navigation/native'

import { ToastProvider } from './components/Toast/ToastProvider'
import { AuthProvider } from './contexts/AuthContext'
import { EntitlementsProvider } from './contexts/EntitlementsContext'
import { I18nBootstrap } from './contexts/I18nBootstrap'
import { LocaleProvider } from './contexts/LocaleContext'
import { ProfileCompletionProvider } from './contexts/ProfileCompletionContext'
import { linking } from './navigation/linking'
import { navigationRef } from './navigation/navigationRef'
import { PaymentReturnListener } from './navigation/PaymentReturnListener'
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
      <I18nBootstrap>
        <LocaleProvider>
          <AuthProvider>
            <EntitlementsProvider>
              <ProfileCompletionProvider>
                <ToastProvider>
                  <AppStatusBar />
                  <NavigationContainer ref={navigationRef} linking={linking}>
                    <PaymentReturnListener />
                    <RootNavigator />
                  </NavigationContainer>
                </ToastProvider>
              </ProfileCompletionProvider>
            </EntitlementsProvider>
          </AuthProvider>
        </LocaleProvider>
      </I18nBootstrap>
    </SafeAreaProvider>
  );
};

export default App;
