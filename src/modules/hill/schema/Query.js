const gql = require('graphql-tag');

// Pagination as per https://facebook.github.io/relay/graphql/connections.htm
module.exports = gql`
  extend type Query {
    hill(number: Int!): Hill
    hills(
      filter: HillFilter = {}
      sort: HillSort = {}

      first: Int
      after: String

      last: Int
      before: String
    ): HillsConnection!
    lists: [List!]!
    regions: [Region!]!
  }
`;
