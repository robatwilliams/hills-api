const gql = require('graphql-tag');

module.exports = gql`
  input RegionNameCriterion {
    eq: String
  }
`;
