# hills-api

> GraphQL API for [_The Database of British and Irish Hills_](http://www.hills-database.co.uk/)

Web <abbr title="Application Programming Interface">API</abbr> providing data about the hills and mountains of Britain and Ireland.

Use it as a convenient data source for apps and web apps, whether real or just experiments that need some data. You may also be interested in the [technology](#technology) that powers it.

The data comes from the <abbr title="Database of British and Irish Hills">DoBIH</abbr> database and is used [under license](#license). If you use it, consider donating to the [DoBIH fund](http://www.hills-database.co.uk/downloads.html).

## Features

⛰️ Major hills and mountains of Britain and Ireland

📝 Key [data fields](docs/fields-hills-database.md) from the hills database

🔍 Filter and sort on [some fields](docs/fields-hills-database.md)

👪 Query related (parent, ~~child~~<sup>1</sup>) hills in the same query

🚚 Paginate large result sets

🗜️ Compressed and cacheable HTTP responses for speed and efficiency

👐 Free to use, no API key (at least while it's not costing me much)

<sup>1</sup> There is a [list of possible future features](docs/backlog.md).

## Endpoints

### GraphQL API

> https://xxxxxxxxxx.execute-api.eu-west-1.amazonaws.com/prod/graphql

⚠️ 😴 ⏳ To save on running costs, the database behind the API is currently allowed to sleep during periods of inactivity. Error responses will be returned while it wakes up, which can take up to a minute.

### Schema

> https://xxxxxxxxxx.execute-api.eu-west-1.amazonaws.com/prod/schema

Plain text dump of the API's self-description of available queries and data.

### Playground

> https://xxxxxxxxxx.execute-api.eu-west-1.amazonaws.com/prod/playground

Browser-based <abbr title="Integrated Development Environment">IDE</abbr> (query editor), for building and executing queries.

Try some out some queries straight away - you can copy an example from below or from the `/examples` folder. Use the _Schema_ and _Docs_ tabs (at the right hand edge) to browse the API's self-description of available queries and data.

## Query arguments

Filtering is in the style of [MongoDB-style query objects](https://docs.mongodb.com/manual/reference/operator/query).

Pagination is [cursor-based](https://graphql.org/learn/pagination/#pagination-and-edges), in the style of [Relay cursor connections](https://facebook.github.io/relay/graphql/connections.htm).

See the schema (the API's self-description) and the example queries for detail.

## Example query

First few hills matching some criteria, sorted by height, with a selection of fields ([more available](docs/fields-hills-database.md)):

```graphql
{
  hills(
    first: 20
    filter: {
      heightMetres: { gt: 500 }
      lists: { id: { inc: WAINWRIGHT } }
      names: { search: "pike" }
    }
    sort: { height: { descending: true } }
  ) {
    nodes {
      coordinates {
        grid {
          easting
          northing
        }
      }
      height(unit: METRES)
      maps(scale: ONE_25K) {
        sheet
      }
      names {
        primary
      }
      parent {
        names {
          primary
        }
      }
      region {
        name
      }
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
```

Check out the `/examples` folder for more.

## Calling the API

Queries are accepted as POST and GET requests, and return JSON. You can construct and send them yourself, or use a GraphQL [client library](https://github.com/chentsulin/awesome-graphql) for your platform which can take advantage of the structured and self-describing nature of the API.

Here's a simple POST example using just `fetch()` for a web browser:

```javascript
fetch('https://xxxxxxxxxx.execute-api.eu-west-1.amazonaws.com/prod/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: '{ hill(number: 278) { names { primary } } }',
  }),
})
  .then(response => response.json())
  .then(console.log);
```

Note that it's generally better to use variables for passing arguments, rather than embedding them in the query itself.

Prefer to send queries using GET requests rather than POST, as this will allow reuse of cached responses without making a network request. Here's an equivalent example using GET and variables (separated onto multiple lines and unencoded for readability):

```
https://xxxxxxxxxx.execute-api.eu-west-1.amazonaws.com/prod/graphql
?query=query MyQuery($myVariable: Int!) { hill(number: $myVariable) { names { primary } } }
&variables={"myVariable":278}
```

Read more about calling GraphQL APIs, including those aspects, [here](https://graphql.org/graphql-js/graphql-clients/) and [here](https://graphql.org/learn/serving-over-http/).

## Technology

The API accepts queries described using [GraphQL](https://graphql.org/), which provides flexibility for consumers to receive only the parts of the data they require for their particular use cases. The backend for the API is implemented in JavaScript and runs on Node.js. It runs on serverless technologies by Amazon Web Services (Lambda, Aurora Serverless database), thus there are no dedicated servers to manage or pay for by the hour.

The `/docs` folder contains some more detailed technical notes, and you can of course browse the source code and run it yourself.

## License

hills-api, Copyright (C) Robat Williams

This project is [licensed](LICENSE.txt) under the terms of the [GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/) or later license.

The [Database of British and Irish Hills](http://www.hills-database.co.uk/) is used under the [Creative Commons Attribution 3.0 Unported License](http://creativecommons.org/licenses/by/3.0/deed.en_GB).
