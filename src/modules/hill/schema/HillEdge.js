const gql = require('graphql-tag');

// https://facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types
module.exports = gql`
  type HillEdge {
    cursor: String!
    node: Hill!
  }
`;
