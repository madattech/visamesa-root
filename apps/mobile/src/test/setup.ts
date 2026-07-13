jest.mock('react-native-unistyles', () => {
  const {lightTheme} = require('@/theme');

  return {
    createStyleSheet: (factory: (theme: typeof lightTheme) => unknown) =>
      factory(lightTheme),
    useStyles: (stylesheet: unknown) => ({
      styles: stylesheet,
      theme: lightTheme,
    }),
    UnistylesRegistry: {
      addThemes: jest.fn().mockReturnThis(),
      addConfig: jest.fn(),
    },
  };
});

jest.mock('@react-native-vector-icons/material-icons', () => 'MaterialIcons');

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({children}: {children: React.ReactNode}) => children,
  SafeAreaView: ({children}: {children: React.ReactNode}) => children,
  useSafeAreaInsets: () => ({top: 0, bottom: 0, left: 0, right: 0}),
}));

import {initSharedI18n} from '@visamesa/content/i18n';

beforeAll(async () => {
  await initSharedI18n({language: 'en'});
});
