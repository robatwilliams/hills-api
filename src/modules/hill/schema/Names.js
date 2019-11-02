const gql = require('graphql-tag');

module.exports = gql`
  type Names {
    alternates: [String!]
    primary: String!
  }
`;
