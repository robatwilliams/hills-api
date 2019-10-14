const gql = require('graphql-tag');

// Note: "input" types may be useful when more arguments are added
module.exports = gql`
  extend type Query {
    hill(number: Int!): Hill
    hills(list: ListID!): [Hill!]!
  }
`;
