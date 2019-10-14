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
