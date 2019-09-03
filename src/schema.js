const { gql } = require('apollo-server-lambda');

/* GraphQL */
module.exports = gql`
  type Query {
    hill(number: Int!): Hill
    hills(list: List): [Hill!]!
  }

  type Hill {
    countries: [Country!]!
    county: String!
    heightMetres: Float!
    island: String
    lists: [List!]!
    maps: Maps!
    name: String!
    number: Int!
    region: String!
  }

  type Country {
    code: String!
    name: String!
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
