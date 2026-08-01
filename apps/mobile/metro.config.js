const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');
const designTokensRoot = path.resolve(monorepoRoot, 'shared/design-tokens');
const contentRoot = path.resolve(monorepoRoot, 'shared/content');
const typesRoot = path.resolve(monorepoRoot, 'shared/types');

/**
 * Metro must watch shared packages linked via file: dependencies.
 * Subpath exports (@visamesa/content/legal) are mapped in babel.config.js.
 */
const config = {
  watchFolders: [designTokensRoot, contentRoot, typesRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ],
    extraNodeModules: {
      i18next: path.resolve(projectRoot, 'node_modules/i18next'),
      'react-i18next': path.resolve(projectRoot, 'node_modules/react-i18next'),
      react: path.resolve(projectRoot, 'node_modules/react'),
    },
    unstable_enablePackageExports: true,
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
