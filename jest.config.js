module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/backend'],
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js'],
  // ignore frontend for now; add later if needed
};
