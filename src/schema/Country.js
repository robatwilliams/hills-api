const { gql } = require('apollo-server-lambda');

/* GraphQL */
module.exports = gql`
  type Country {
    code: String!
    name: String!
  }
`;
