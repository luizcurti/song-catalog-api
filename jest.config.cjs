const moduleNameMapper = {
  '^@config/(.*)$': '<rootDir>/src/config/$1',
  '^@shared/(.*)$': '<rootDir>/src/shared/$1',
  '^@modules/(.*)$': '<rootDir>/src/modules/$1',
  '^@errors/(.*)$': '<rootDir>/src/errors/$1',
};

const collectCoverageFrom = ['<rootDir>/src/**/*.ts', '!<rootDir>/src/tests/**'];

const coveragePathIgnorePatterns = [
  '/node_modules/',
  '/dist/',
  // Framework bootstrap/wiring: exercised at runtime but not meaningful units to unit-test.
  '/src/shared/infra/server.ts',
  '/src/shared/infra/database/dataSource.ts',
  '/src/shared/infra/database/migrations/',
];

const baseProject = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: { '^.+\\.ts$': 'ts-jest' },
  moduleNameMapper,
  clearMocks: true,
  collectCoverageFrom,
  coveragePathIgnorePatterns,
};

module.exports = {
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
  projects: [
    { ...baseProject, displayName: 'unit', testMatch: ['<rootDir>/src/tests/**/*.unit.spec.ts'] },
    { ...baseProject, displayName: 'integration', testMatch: ['<rootDir>/src/tests/**/*.integration.spec.ts'] },
    { ...baseProject, displayName: 'e2e', testMatch: ['<rootDir>/src/tests/**/*.e2e.spec.ts'] },
  ],
};
