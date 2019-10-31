module.exports = {
  roots: ['<rootDir>/database', '<rootDir>/src'],

  // Doesn't need JSDOM
  testEnvironment: 'node',

  testPathIgnorePatterns: ['<rootDir>/src/integration/'],
};
