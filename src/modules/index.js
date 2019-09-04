const { gql } = require('apollo-server-lambda');
const { flatten } = require('../util');

const modules = [
  require('./geo'),
  require('./hill'),
  require('./map'),
  require('./measure'),
];

const globalTypeDefs = gql`
  type Query
`;

const schema = [globalTypeDefs, ...flatten(modules.map(module => module.schema))];

module.exports = {
  schema,
};
