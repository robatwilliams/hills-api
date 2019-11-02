const gql = require('graphql-tag');

module.exports = gql`
  type Coordinates {
    geodetic: GeodeticCoordinates!
    grid: GridReference!
  }
`;
