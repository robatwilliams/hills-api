const { gql } = require('apollo-server-lambda');

/* GraphQL */
module.exports = gql`
  enum UnitOfLength {
    FEET
    METRES
  }
`;
