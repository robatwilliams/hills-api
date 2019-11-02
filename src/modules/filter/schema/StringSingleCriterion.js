const gql = require('graphql-tag');

module.exports = gql`
  input StringSingleCriterion {
    eq: String
  }
`;
