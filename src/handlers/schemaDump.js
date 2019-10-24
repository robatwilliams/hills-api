const { printSchema } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');

const { schema } = require('../modules');

const executableSchema = makeExecutableSchema({ typeDefs: schema });

// eslint-disable-next-line require-await
async function handler() {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
    body: printSchema(executableSchema),
  };
}

module.exports.fn = handler;
