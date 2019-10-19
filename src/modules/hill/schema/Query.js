const gql = require('graphql-tag');

// Pagination as per https://facebook.github.io/relay/graphql/connections.htm
module.exports = gql`
  extend type Query {
    hill(number: Int!): Hill
    hills(filter: HillFilter = {}, first: Int = 10, after: String): HillsConnection!
  }
`;
