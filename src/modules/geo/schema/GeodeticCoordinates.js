const gql = require('graphql-tag');

module.exports = gql`
  type GeodeticCoordinates {
    latitude: Float!
    longitude: Float!
  }
`;
