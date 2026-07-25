export const profileLoginScreenParams = {
  screen: 'Login' as const,
}

export const profileLoginTabRoute = {
  screen: 'ProfileTab' as const,
  params: profileLoginScreenParams,
}

export const mainTabsProfileLoginRoute = {
  screen: 'MainTabs' as const,
  params: profileLoginTabRoute,
}
