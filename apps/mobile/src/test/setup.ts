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
