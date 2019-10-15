const gql = require('graphql-tag');

module.exports = gql`
  input ListIdCriterion {
    "Includes"
    inc: ListId
  }
`;
