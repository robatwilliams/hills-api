const gql = require('graphql-tag');

module.exports = gql`
  type List {
    id: ListID!
    name: String!
  }
`;
