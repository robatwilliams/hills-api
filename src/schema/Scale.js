const { gql } = require('apollo-server-lambda');

/* GraphQL */
module.exports = gql`
  enum Scale {
    ONE_25K
    ONE_50K
  }
`;
