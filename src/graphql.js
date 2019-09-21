const awsServerlessExpress = require('aws-serverless-express');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');
const CountriesDataSource = require('./datasource/CountriesDataSource');
const HillsDBDataSource = require('./datasource/hillsDB/HillsDBDataSource');
const { resolvers, schema } = require('./modules');

const REQUEST_MEDIA_TYPES = ['application/json', 'application/graphql'];

const countriesDataSource = new CountriesDataSource();
const hillsDataSource = new HillsDBDataSource();
hillsDataSource.start();

const dataSources = {
  countries: countriesDataSource,
  hills: hillsDataSource,
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

const app = express();

app.use(
  '/',
  graphqlHTTP({
    context: { dataSources },
    schema: executableSchema,
  })
);

const server = awsServerlessExpress.createServer(app);

async function handler(event, context) {
  // async; caller must consistently receive a promise

  return (
    ensureSupportedContentType(event) ||
    awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise
  );
}

/**
 * 1. Prevent requests with unsupported types proceeding further
 * 2. Better status and error message if content type is missing (not 400 "Must provide query string")
 */
function ensureSupportedContentType(event) {
  if (event.httpMethod !== 'POST') {
    return;
  }

  // API Gateway normalises to lowercase, serverless-offline does not
  const contentType = event.headers['content-type'] || event.headers['Content-Type'];

  if (!REQUEST_MEDIA_TYPES.includes(contentType)) {
    return {
      statusCode: 415,
      body: JSON.stringify({
        errors: [{ message: 'Supports: ' + REQUEST_MEDIA_TYPES.join(', ') }],
      }),
    };
  }
}

module.exports.fn = handler;
