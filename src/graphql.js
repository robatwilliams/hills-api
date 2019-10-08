const awsServerlessExpress = require('aws-serverless-express');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');

const CountriesDataSource = require('./datasource/CountriesDataSource');
const HillsDataSource = require('./datasource/hills/HillsDataSource');
const { resolvers, schema } = require('./modules');

const REQUEST_MEDIA_TYPES = ['application/json', 'application/graphql'];

const dataSources = {
  countries: new CountriesDataSource(),
  hills: new HillsDataSource(),
};

const executableSchema = makeExecutableSchema({
  allowUndefinedInResolve: false,
  resolvers,
  typeDefs: schema,
  resolverValidationOptions: {
    requireResolversForArgs: true,
    requireResolversForNonScalar: true,
    requireResolversForResolveType: true,
  },
});

/**
 * Express is only used to allow the express-graphql middleware to be used.
 *
 * Implementing the guidelines for operating GraphQL over HTTP (https://graphql.org/learn/serving-over-http/)
 * doesn't seem onerous, but it's less work not to.
 *
 * Although Express can handle many things (e.g. compression, CORS), as much as possible
 * should be handled in API Gateway. That also leaves open the possibility of removing
 * Express in future, in favour of some general GraphQL HTTP library that might come
 * about (see https://github.com/graphql/express-graphql/issues/559), or implementing the
 * guidelines manually.
 */
const app = express();

app.use(
  '/',
  graphqlHTTP({
    context: { dataSources },
    schema: executableSchema,
  })
);

// Proxy library to bridge the gap between AWS Lambda and Express
const server = awsServerlessExpress.createServer(app);

// eslint-disable-next-line require-await
async function handler(event, context) {
  // async; caller must consistently receive a promise

  return (
    ensureSupportedContentType(event) ||
    awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise
  );
}

/**
 * 1. Prevent requests with unsupported types proceeding further
 * 2. Better status and error message if content type is missing
 *      (not 400 "Must provide query string")
 */
function ensureSupportedContentType(event) {
  if (event.httpMethod !== 'POST') {
    return undefined;
  }

  // API Gateway normalises to lowercase, serverless-offline does not
  const contentType = event.headers['content-type'] || event.headers['Content-Type'];

  if (REQUEST_MEDIA_TYPES.includes(contentType)) {
    return undefined;
  }

  return {
    statusCode: 415,
    body: JSON.stringify({
      errors: [{ message: `Supports: ${REQUEST_MEDIA_TYPES.join(', ')}` }],
    }),
  };
}

module.exports.fn = handler;
