const gql = require('graphql-tag');

module.exports = gql`
  input SortSpec {
    descending: Boolean = false
  }
`;
