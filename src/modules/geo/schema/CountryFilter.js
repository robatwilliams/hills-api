const gql = require('graphql-tag');

module.exports = gql`
  input CountryFilter {
    code: StringCriterion
  }
`;
