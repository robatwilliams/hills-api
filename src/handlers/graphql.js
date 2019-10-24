const awsServerlessExpress = require('aws-serverless-express');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');

const CountriesDataSource = require('../datasource/CountriesDataSource');
const ListsDataSource = require('../datasource/ListsDataSource');
const HillsDataSource = require('../datasource/hills/HillsDataSource');
const { resolvers, schema, validationRules } = require('../modules');
const { ensureSupportedContentType } = require('../util-http');

const REQUEST_MEDIA_TYPES = ['application/json', 'application/graphql'];

const dataSources = {
  countries: new CountriesDataSource(),
  hills: new HillsDataSource(),
  lists: new ListsDataSource(),
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

    // For local development using serverless-offline. No ETags when enabled.
    pretty: process.env.IS_OFFLINE,

    schema: executableSchema,
    validationRules,
  })
);

// Proxy library to bridge the gap between AWS Lambda and Express
const server = awsServerlessExpress.createServer(app);

/**
 * Event documentation:
 * https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * https://docs.aws.amazon.com/lambda/latest/dg/with-on-demand-https.html
 *
 * @param {*} event API Gateway Lambda proxy integration representation of client request
 */
async function handler(event, context) {
  // async; caller must consistently receive a promise

  let response = ensureSupportedContentType(event, REQUEST_MEDIA_TYPES);

  if (response) {
    return response;
  }

  response = await awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;

  if (event.httpMethod === 'GET') {
    response.headers['Cache-Control'] = 'max-age=86400';
  }

  return response;
}

module.exports.fn = handler;
