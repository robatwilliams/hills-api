const { ApolloServer } = require('apollo-server-lambda');
const HillsDBDataSource = require('./src/HillsDBDataSource');
const schema = require('./src/schema');

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    hills: (_source, { id }, { dataSources }) => dataSources.hillsDB.getAllHills(),
  },
};

const server = new ApolloServer({
  dataSources() {
    return { hillsDB: new HillsDBDataSource() };
  },
  resolvers,
  typeDefs: schema
});

exports.graphqlHandler = server.createHandler();
