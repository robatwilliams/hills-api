const gql = require('graphql-tag');

module.exports = gql`
  input StringCriterion {
    "Includes"
    inc: String
  }
`;
