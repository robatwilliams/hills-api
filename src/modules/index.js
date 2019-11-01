const gql = require('graphql-tag');
const merge = require('lodash.merge');

const { flatten } = require('../util');

const modules = [
  require('./filter'),
  require('./geo'),
  require('./hill'),
  require('./map'),
  require('./measure'),
  require('./paginate'),
  require('./sort'),
];

const resolvers = merge(...modules.map(module => module.resolvers));

const globalTypeDefs = gql`
  # Root operation type; recognised by default due to name
  type Query
`;

const schema = [globalTypeDefs, ...flatten(modules.map(module => module.schema))];

const validationRules = flatten(
  modules.map(module => module.validationRules).filter(rules => rules != null)
);

module.exports = {
  resolvers,
  schema,
  validationRules,
};
