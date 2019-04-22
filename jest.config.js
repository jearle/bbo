module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: false,
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  reporters: [
    "default",
    [ "jest-junit", { outputDirectory: "./coverage" } ]
  ],
  collectCoverageFrom: [
      "<rootDir>/src/**/*.ts",
    ],
    testMatch: [ "<rootDir>/test/**/?(*.)+(spec|test).[jt]s?(x)" ]

};