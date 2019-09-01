const { gql } = require('apollo-server-lambda');

module.exports = gql`
type Query {
  hills: [Hill!]!
}

type Hill {
  name: String!
  lists: [List!]!
}

enum List {
  HEWITT
  MUNRO
  WAINWRIGHT
}
`;
