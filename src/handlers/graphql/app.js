const express = require('express');
const graphqlHTTP = require('express-graphql');
const { formatError: defaultFormatError } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');

const {
  CountriesDataSource,
  HillsDataSource,
  ListsDataSource,
  RegionsDataSource,
} = require('../../datasource');
const { resolvers, schema, validationRules } = require('../../modules');

const customHttpError = require('./customHttpError');
const errorLogger = require('./errorLogger');
const queryLogger = require('./queryLogger');

const dataSources = {
  countries: new CountriesDataSource(),
  hills: new HillsDataSource(),
  lists: new ListsDataSource(),
  regions: new RegionsDataSource(),
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

function customFormatError(error) {
  // Use custom error formatter as a hook for error logging.
  // This is the only place that absolutely all errors pass through.
  errorLogger(error);

  return defaultFormatError(error);
}

function extensions(info) {
  queryLogger(info);

  // Last; might throw
  customHttpError(info);

  // Don't return an object, to avoid it appearing in the response
}

const app = express();

app.use(
  '/',
  graphqlHTTP({
    context: { dataSources },
    customFormatErrorFn: customFormatError,
    extensions,

    // For local development using serverless-offline. No ETags when enabled.
    pretty: process.env.IS_OFFLINE,

    schema: executableSchema,
    validationRules,
  })
);

module.exports = app;
