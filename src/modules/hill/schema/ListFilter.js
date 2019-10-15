const gql = require('graphql-tag');

module.exports = gql`
  input ListFilter {
    id: ListId!
  }
`;
