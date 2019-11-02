const gql = require('graphql-tag');

module.exports = gql`
  input HillSort {
    height: SortSpec
    namePrimary: SortSpec
  }
`;
