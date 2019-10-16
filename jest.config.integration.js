module.exports = {
  // Many failures likely means Aurora Serverless was sleeping and is taking time to wake
  bail: 5,

  rootDir: './src/integration',

  // Doesn't need JSDOM
  testEnvironment: 'node',
};
