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
          react: path.resolve(__dirname, 'node_modules/react'),
          '@visamesa/content/legal': path.join(contentRoot, 'legalDisclaimerContent.ts'),
          '@visamesa/content/marketing': path.join(contentRoot, 'marketingContent.ts'),
          '@visamesa/content/site': path.join(contentRoot, 'siteConstants.ts'),
          '@visamesa/content/checkout': path.join(contentRoot, 'checkoutContent.ts'),
          '@visamesa/content/entitlements': path.join(contentRoot, 'entitlements.ts'),
          '@visamesa/content/i18n': path.join(contentRoot, 'i18n/index.ts'),
          '@visamesa/content/tieSteps/detail': path.join(contentRoot, 'tieSteps/index.ts'),
          '@visamesa/content/tieSteps': path.join(contentRoot, 'tieStepsMarketing.ts'),
          '@visamesa/content/processOverview': path.join(contentRoot, 'processOverview/index.ts'),
        },
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
      },
    ],
  ],
};
