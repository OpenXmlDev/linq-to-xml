// See: https://kulshekhar.github.io/ts-jest/docs/guides/esm-support/

export default {
  displayName: 'linq-to-xml',
  preset: '../../jest.preset.js',
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      useESM: true,
    },
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  transform: {},
  coverageDirectory: '../../coverage',
};
