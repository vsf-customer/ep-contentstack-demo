module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json'
    }
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '^vue$': 'vue/dist/vue.common.js'
  },
  moduleFileExtensions: ['js', 'vue', 'json', 'ts', 'tsx'],
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': '@vue/vue2-jest',
    '^.+\\.(t)s$': 'ts-jest'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/components/**/*.vue',
    '<rootDir>/pages/**/*.vue',
    '<rootDir>/plugins/**/*.ts',
    '<rootDir>/serverMiddleware/**/*.ts'
  ],
  testMatch: ['<rootDir>/**/tests/(unit|integration)/**/*spec.[jt]s?(x)'],
  testPathIgnorePatterns: ['<rootDir>/__tests__/e2e/']
};
