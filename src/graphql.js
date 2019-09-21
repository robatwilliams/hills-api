const awsServerlessExpress = require('aws-serverless-express');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');
const CountriesDataSource = require('./datasource/CountriesDataSource');
const HillsDBDataSource = require('./datasource/hillsDB/HillsDBDataSource');
const { resolvers, schema } = require('./modules');

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

function handler(event, context) {
  return awsServerlessExpress.proxy(server, event, context);
}

module.exports.fn = handler;
