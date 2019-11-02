const gql = require('graphql-tag');

module.exports = gql`
  type GridReference {
    easting: Int!
    northing: Int!
    square: String!
  }
`;
