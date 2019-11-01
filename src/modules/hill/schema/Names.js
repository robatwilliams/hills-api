const gql = require('graphql-tag');

module.exports = gql`
  type Names {
    primary: String!
    alternates: [String!]
  }
`;
