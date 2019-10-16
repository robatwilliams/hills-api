module.exports = {
  rootDir: './src',

  // Doesn't need JSDOM
  testEnvironment: 'node',

  testPathIgnorePatterns: ['<rootDir>/integration/'],
};
