const gql = require('graphql-tag');

module.exports = gql`
  input HillFilter {
    countries: CountryFilter
    heightMetres: FloatCriterion
    lists: ListFilter
  }
`;
