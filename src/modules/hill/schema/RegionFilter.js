const gql = require('graphql-tag');

module.exports = gql`
  input RegionFilter {
    name: RegionNameCriterion
  }
`;
