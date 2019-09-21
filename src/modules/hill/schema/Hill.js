const gql = require('graphql-tag');

module.exports = gql`
  type Hill {
    countries: [Country!]!
    height(unit: UnitOfLength!): Float!
    maps(scale: Scale!): [Map!]!
    name: String!
    number: Int!
  }
`;
