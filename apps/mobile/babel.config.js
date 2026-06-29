const path = require('path');

const contentRoot = path.resolve(__dirname, '../../shared/content');

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@visamesa/content/legal': path.join(contentRoot, 'legalDisclaimerContent.ts'),
          '@visamesa/content/marketing': path.join(contentRoot, 'marketingContent.ts'),
          '@visamesa/content/site': path.join(contentRoot, 'siteConstants.ts'),
          '@visamesa/content/tieSteps': path.join(contentRoot, 'tieStepsMarketing.ts'),
        },
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
      },
    ],
  ],
};
