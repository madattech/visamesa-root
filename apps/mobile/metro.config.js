const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');
const designTokensRoot = path.resolve(monorepoRoot, 'shared/design-tokens');

/**
 * Metro must watch the shared design-tokens package (linked via file: dependency).
 */
const config = {
  watchFolders: [designTokensRoot],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
