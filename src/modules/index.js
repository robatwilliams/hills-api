const { gql } = require('apollo-server-lambda');
const merge = require('lodash.merge');
const { flatten } = require('../util');

const modules = [
  require('./geo'),
  require('./hill'),
  require('./map'),
  require('./measure'),
];

const resolvers = merge(...modules.map(module => module.resolvers));

const globalTypeDefs = gql`
  type Query
`;

const schema = [globalTypeDefs, ...flatten(modules.map(module => module.schema))];

module.exports = {
  resolvers,
  schema,
};