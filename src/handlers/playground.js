const lambdaPlayground = require('graphql-playground-middleware-lambda').default;

// https://github.com/prisma/graphql-playground/blob/master/packages/graphql-playground-html/src/render-playground-page.ts
// https://github.com/prisma/graphql-playground#usage
const options = {
  // Relative to the parent of the playground, not to the playground, so no ../
  endpoint: 'graphql',

  settings: {
    'schema.polling.enable': process.env.IS_OFFLINE === 'true',

    // Reduce from 2s; prevent high server CPU usage
    'schema.polling.interval': 30000,
  },
};

module.exports.fn = lambdaPlayground(options);
