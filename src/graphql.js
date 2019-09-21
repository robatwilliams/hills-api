const { graphql } = require('graphql');
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

async function handler(event) {
  const { query } = JSON.parse(event.body);

  const queryResult = await graphql({
    contextValue: { dataSources },
    schema: executableSchema,
    source: query,
  });

  return {
    statusCode: 200,
    body: JSON.stringify(queryResult),
  };
}

module.exports.fn = handler;
