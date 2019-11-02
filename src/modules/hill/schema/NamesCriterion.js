const gql = require('graphql-tag');

module.exports = gql`
  input NamesCriterion {
    search: String
  }
`;
