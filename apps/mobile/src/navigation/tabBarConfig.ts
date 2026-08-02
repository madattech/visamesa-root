/**
 * Tab bar configuration constants
 * Shared across navigation and layout hooks
 *
 * When adding a nested screen that should hide the bottom tab bar:
 * 1. Add its Stack.Screen name here.
 * 2. HomeTab and ProfileTab pick this up automatically via getFocusedRouteNameFromRoute
 *    in MainTabNavigator. DashboardTab screens need the same wiring there first.
 * 3. Use CollapsingHeaderScreen (or useContentBottomInset) so scroll padding matches.
 *
 * MainTabNavigator hides the bar with display: 'none' — do not use opacity or
 * pointerEvents in tabBarStyle; Android still receives touches from invisible bars.
 */

export const TAB_BAR_HIDDEN_ROUTES = new Set([
  'ProcessOverview',
  'Login',
  'ProfileSection',
  'Settings',
  'LegalDocument',
]);
