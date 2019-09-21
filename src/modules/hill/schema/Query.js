const gql = require('graphql-tag');

module.exports = gql`
  extend type Query {
    hill(number: Int!): Hill
    hills(list: List): [Hill!]!
  }
`;
