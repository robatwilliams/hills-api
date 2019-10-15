const gql = require('graphql-tag');

module.exports = gql`
  input HillsFilter {
    countries: CountryFilter
    lists: ListFilter
  }
`;
