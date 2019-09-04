const { gql } = require('apollo-server-lambda');

module.exports = gql`
  enum List {
    HEWITT
    MUNRO
    WAINWRIGHT
  }
`;
