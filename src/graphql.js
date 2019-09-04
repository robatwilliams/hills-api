const { ApolloServer, makeExecutableSchema } = require('apollo-server-lambda');
const CountriesDataSource = require('./datasource/CountriesDataSource');
const HillsDBDataSource = require('./datasource/hillsDB/HillsDBDataSource');
const { schema } = require('./modules');
const resolvers = require('./resolvers');

const countriesDataSource = new CountriesDataSource();
countriesDataSource.start();
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

// "Serverless" (!)
const server = new ApolloServer({
  dataSources() {
    // This is called by Apollo on every request
    return dataSources;
  },
  playground: {
    settings: {
      // Reduce from 2s; prevent high server CPU usage when running locally
      'schema.polling.interval': 30000,
    },
  },
  schema: executableSchema,
});

exports.graphqlHandler = server.createHandler();
