const gql = require('graphql-tag');

module.exports = gql`
  type Country {
    code: String!
    name: String!
  }
`;
