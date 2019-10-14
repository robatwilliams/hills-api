const gql = require('graphql-tag');

module.exports = gql`
  input HillsFilter {
    countryCode: String
    listId: ListId
  }
`;
