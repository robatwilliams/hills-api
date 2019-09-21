const gql = require('graphql-tag');

module.exports = gql`
  type Map {
    # Although most are numbers, the 1:25k Outdoor Leisure series are prefixed "OL"
    sheet: String!
  }
`;
