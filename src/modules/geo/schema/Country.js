const { gql } = require('apollo-server-lambda');

module.exports = gql`
  type Country {
    code: String!
    name: String!
  }
`;
