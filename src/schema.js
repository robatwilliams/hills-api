const { gql } = require('apollo-server-lambda');

/* GraphQL */
module.exports = gql`
  type Query {
    hill(number: Int!): Hill
    hills(list: List): [Hill!]!
  }

  type Hill {
    countries: [Country!]!
    height(unit: UnitOfLength!): Float!
    map(scale: Scale!): [Map!]!
    name: String!
    number: Int!
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

  type Map {
    # Although most are numbers, the 1:25k Outdoor Leisure series are prefixed "OL"
    sheet: String!
  }

  enum Scale {
    ONE_25K
    ONE_50K
  }

  enum UnitOfLength {
    FEET
    METRES
  }
`;
