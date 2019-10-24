const express = require('express');
const graphqlHTTP = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');

const CountriesDataSource = require('../../datasource/CountriesDataSource');
const ListsDataSource = require('../../datasource/ListsDataSource');
const HillsDataSource = require('../../datasource/hills/HillsDataSource');
const { resolvers, schema, validationRules } = require('../../modules');

const customHttpError = require('./customHttpError');
const queryLogger = require('./queryLogger');

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

function extensions(info) {
  queryLogger(info);

  // Last; might throw
  customHttpError(info);

  return {};
}

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
    extensions,

    // For local development using serverless-offline. No ETags when enabled.
    pretty: process.env.IS_OFFLINE,

    schema: executableSchema,
    validationRules,
  })
);

module.exports = app;