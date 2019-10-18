const gql = require('graphql-tag');

module.exports = gql`
  input FloatCriterion {
    eq: Float

    gt: Float
    gte: Float

    lt: Float
    lte: Float
  }
`;
