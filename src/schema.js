const { gql } = require('apollo-server-lambda');

module.exports = gql`
type Query {
  hills: [Hill!]!
}

type Hill {
  name: String!
}
`;
