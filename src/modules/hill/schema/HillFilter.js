const gql = require('graphql-tag');

module.exports = gql`
  input HillFilter {
    countries: CountryFilter
    heightFeet: FloatCriterion
    heightMetres: FloatCriterion
    lists: ListFilter
    names: StringMultiCriterion
    region: RegionFilter
  }
`;
