const gql = require('graphql-tag');

module.exports = gql`
  type Hill {
    countries: [Country!]!
    height(unit: UnitOfLength!): Float!
    lists: [List!]!
    maps(scale: Scale!): [Map!]!
    names: Names!
    number: Int!
    parent: Hill
  }
`;
