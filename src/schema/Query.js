const { gql } = require('apollo-server-lambda');

/* GraphQL */
module.exports = gql`
  type Query {
    hill(number: Int!): Hill
    hills(list: List): [Hill!]!
  }
`;
