const { gql } = require('apollo-server-lambda');

module.exports = gql`
  enum UnitOfLength {
    FEET
    METRES
  }
`;
