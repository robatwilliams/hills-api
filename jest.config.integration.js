/**
 * --runInBand can only be specified on the command line. Used to run the tests
 * serially, otherwise it'll choke the resource-constrained lambda and cause errors.
 */

module.exports = {
  // Many failures likely means Aurora Serverless was sleeping and is taking time to wake
  bail: 5,

  rootDir: './src/integration',

  setupFiles: ['<rootDir>/jestSetup.js'],

  // Doesn't need JSDOM
  testEnvironment: 'node',
};
