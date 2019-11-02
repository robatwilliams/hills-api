const gql = require('graphql-tag');

module.exports = gql`
  input StringMultiCriterion {
    "Includes"
    inc: String
  }
`;
