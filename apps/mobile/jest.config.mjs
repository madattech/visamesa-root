/** @type {import('jest').Config} */
export default {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // @visamesa/content lives outside apps/mobile; CI only runs npm ci here (not in
  // shared/content). Resolve peer deps from mobile's node_modules.
  modulePaths: ['<rootDir>/node_modules'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@babel/runtime/(.*)$': '<rootDir>/node_modules/@babel/runtime/$1',
    '^i18next$': '<rootDir>/node_modules/i18next',
    '^react-i18next$': '<rootDir>/node_modules/react-i18next',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/test/**',
    '!src/types/**',
  ],
};
