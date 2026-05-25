/**
 * Unistyles Configuration and Initialization
 * This file must be imported at app startup to initialize the Unistyles runtime
 */

import {UnistylesRegistry} from 'react-native-unistyles';
import {lightTheme, darkTheme} from './index';

// Register themes with Unistyles
UnistylesRegistry.addThemes({
  light: lightTheme,
  dark: darkTheme,
}).addConfig({
  // Set default theme
  initialTheme: 'light',
  // Enable adaptive themes (optional - responds to system theme changes)
  adaptiveThemes: true,
});
