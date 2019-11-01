const gql = require('graphql-tag');

module.exports = gql`
  input HillSort {
    namePrimary: SortSpec
  }
`;
