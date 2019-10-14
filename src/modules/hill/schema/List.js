const gql = require('graphql-tag');

module.exports = gql`
  type List {
    id: ListId!
    name: String!
  }
`;
