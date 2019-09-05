const { gql } = require('apollo-server-lambda');

module.exports = gql`
  extend type Query {
    hill(number: Int!): Hill
    hills(list: List): [Hill!]!
  }
`;