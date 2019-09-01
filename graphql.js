const { ApolloServer } = require('apollo-server-lambda');
const HillsDBDataSource = require('./src/HillsDBDataSource');
const schema = require('./src/schema');

const resolvers = {
  Query: {
    hills: (obj, args, { dataSources }) => dataSources.hillsDB.getAll(),
  },
};

const hillsDB = new HillsDBDataSource();
hillsDB.start();

const server = new ApolloServer({
  dataSources() {
    // This is called by Apollo on every request
    return { hillsDB };
  },
  resolvers,
  typeDefs: schema
});

exports.graphqlHandler = server.createHandler();
