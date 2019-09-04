const { gql } = require('apollo-server-lambda');

/* GraphQL */
module.exports = gql`
  enum List {
    HEWITT
    MUNRO
    WAINWRIGHT
  }
`;
