const { gql } = require('apollo-server-lambda');

module.exports = gql`
type Query {
  hills(list: List): [Hill!]!
}

type Hill {
  name: String!
  heightMetres: Float!
  lists: [List!]!
}

enum List {
  HEWITT
  MUNRO
  WAINWRIGHT
}
`;
