const { gql } = require('apollo-server-lambda');

/* GraphQL */
module.exports = gql`
  type Hill {
    countries: [Country!]!
    height(unit: UnitOfLength!): Float!
    map(scale: Scale!): [Map!]!
    name: String!
    number: Int!
  }
`;
