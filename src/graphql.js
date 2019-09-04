const { ApolloServer } = require('apollo-server-lambda');
const CountriesDataSource = require('./datasource/CountriesDataSource');
const HillsDBDataSource = require('./datasource/hillsDB/HillsDBDataSource');
const resolvers = require('./resolvers');
const schema = require('./schema');

const countriesDataSource = new CountriesDataSource();
countriesDataSource.start();
const hillsDataSource = new HillsDBDataSource();
hillsDataSource.start();

const dataSources = {
  countries: countriesDataSource,
  hills: hillsDataSource,
};

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
  resolvers,
  typeDefs: schema,
});

exports.graphqlHandler = server.createHandler();
