const { gql } = require('apollo-server-lambda');

module.exports = gql`
type Query {
  hills(list: List): [Hill!]!
}

type Hill {
  name: String!
  countries: [Country!]!
  county: String!
  heightMetres: Float!
  island: String
  lists: [List!]!
  maps: Maps!
  region: String!
}

enum Country {
  ENGLAND
  IRELAND
  SCOTLAND
  WALES
}

enum List {
  HEWITT
  MUNRO
  WAINWRIGHT
}

type Maps {
  scale25k: [Map!]!
  scale50k: [Map!]!
}

type Map {
  # Although most are numbers, the 1:25k Outdoor Leisure series are prefixed "OL"
  sheet: String
}
`;
