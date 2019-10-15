# GraphQL

## "Graphy" schema

The schema should model the real world. In addition to aiding comprehension, it naturally facilitates extensibility - making it possible to add fields without breaking changes.

Consider the scenario below of exposing the maps on which a hill appears, at a time when the only data available was the sheet reference (e.g. OL4). The string "OL4" isn't a map; it's merely one piece of information about a map - along with others such as publisher and ISBN which we might want to add in future.

😐 Works:

```graphql
type Hill {
  maps: [String!]!
}
```

👍 Better:

```graphql
type Hill {
  maps: [Map!]!
}

type Map {
  sheet: String!
}
```

## Exposing enums

Where an API exposes enums, UI clients will typically have the following needs:

1. Retrieve a user-friendly display name for the enum (i.e. not `ALL_CAPS`)
1. Retrieve all available values, e.g. to populate a filter dropdown

With GraphQL, given an enum defined as follows, with a [description](https://graphql.github.io/graphql-spec/June2018/#sec-Descriptions) on each member...

```graphql
enum Fruit {
  "Apple"
  APPLE

  "Passion fruit"
  PASSION_FRUIT
}
```

... both the above can be retrieved using an introspection query:

```graphql
{
  __type(name: "Fruit") {
    enumValues {
      name
      description
    }
  }
}
```

That requires little effort, but it has some disadvantages:

1. Inconvenient for clients - they must join query results against the introspection results
1. No possibility to provide translations of display names
1. Different approach required for value-lists that aren't enums (e.g. distinct entries from database), causing disjointment

Although it requires introspection to be enabled in production (which you may wish to [disable](https://github.com/helfer/graphql-disable-introspection) to avoid revealing your entire schema), it appears that it would be simple to allow introspection for some chosen types.

Introspection might be ok for you, and it would have been ok here. This API however chooses to expose display names in-context within query results, and will provide separate queries for retrieving all available values of both enums and value-lists in a consistent way. Introspection is left for tooling to use.

## Filters

The design is based on the [GatsbyJS GraphQL API](https://www.gatsbyjs.org/docs/graphql-reference/#filter), which uses [Sift](https://www.npmjs.com/package/sift), which is an implementation of [MongoDB-style queries](https://docs.mongodb.com/manual/reference/operator/query/).