const gql = require('graphql-tag');

module.exports = gql`
  input Filter {
    listId: ListId!
  }
`;
