const gql = require('graphql-tag');

module.exports = gql`
  input Filter {
    countryCode: String
    listId: ListId
  }
`;
