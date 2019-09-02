const { ApolloServer } = require('apollo-server-lambda');
const CountriesDataSource = require('./datasource/countries/CountriesDataSource');
const HillsDBDataSource = require('./datasource/hillsDB/HillsDBDataSource');
const resolvers = require('./resolvers');
const schema = require('./schema');

const hillsDB = new HillsDBDataSource();
hillsDB.start();

const dataSources = {
  countries: new CountriesDataSource(),
  hillsDB,
}

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
  typeDefs: schema
});

exports.graphqlHandler = server.createHandler();
