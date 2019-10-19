const gql = require('graphql-tag');

// https://facebook.github.io/relay/graphql/connections.htm#sec-Connection-Types
module.exports = gql`
  type HillsConnection {
    edges: [HillEdge!]!
    pageInfo: PageInfo!
  }
`;
