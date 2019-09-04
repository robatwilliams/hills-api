const { gql } = require('apollo-server-lambda');

module.exports = gql`
  type Query {
    hill(number: Int!): Hill
    hills(list: List): [Hill!]!
  }
`;
