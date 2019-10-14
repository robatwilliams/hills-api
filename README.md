# hills-api

> GraphQL API for [_The Database of British and Irish Hills_](http://www.hills-database.co.uk/)

Web <abbr title="Application Programming Interface">API</abbr> providing data about the hills and mountains of Britain and Ireland.

Use it as a convenient data source for apps and web apps, whether real or just experiments that need some data. You may also be interested in the [technology](#technology) that powers it.

The data comes from the <abbr title="Database of British and Irish Hills">DoBIH</abbr> database and is used [under license](#license). If you use it, consider donating to the [DoBIH fund](http://www.hills-database.co.uk/downloads.html).

## Features

⛰️ Major hills and mountains of Britain and Ireland

📝 Key data [fields](docs/fields-hills-database.md) from the hills database

🔍 Filter and sort on some fields

👪 Query related hills in the same query

🚚 Paginate large result sets

🗜️ Compressed and cacheable HTTP responses for speed and efficiency

👐 Free to use, no API key (at least while it's not costing me much)

There is a [list](docs/backlog.md) of possible future features.

## Endpoints

⚠️ 😴 ⏳ To save on running costs, the database behind the API is currently allowed to sleep during periods of inactivity. Error responses will be returned while it wakes up, which can take up to a minute.

**API endpoint:** https://xxxxxxxxxx.execute-api.eu-west-1.amazonaws.com/prod/graphql

**Playground:** https://xxxxxxxxxx.execute-api.eu-west-1.amazonaws.com/prod/playground

Visit the playground in your browser to try out some queries straight away. You can copy an example query from below or from the `/examples` folder. Use the _Schema_ and _Docs_ tabs (at the right hand edge) to browse the API's self-description of available data and querying options.

## Calling the API

Queries are accepted as POST and GET requests, and return JSON. You can construct and send them yourself, or use a GraphQL [client library](https://github.com/chentsulin/awesome-graphql) for your platform which can take advantage of the structured and self-describing nature of the API.

Here's a simple example using just `fetch()` for a web browser:

```javascript
fetch('https://xxxxxxxxxx.execute-api.eu-west-1.amazonaws.com/prod/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: '{ hill(number: 278) { name } }',
  }),
})
  .then(response => response.json())
  .then(console.log);
```

Note that it's generally better to use variables for passing arguments, rather than embedding them in the query itself.

Prefer to send queries using GET requests (`?query=`) rather than POST, as this will allow reuse of cached responses without making a network request.

Read more about calling GraphQL APIs, including those aspects, [here](https://graphql.org/graphql-js/graphql-clients/) and [here](https://graphql.org/learn/serving-over-http/).

## Example queries

Check out the `/examples` folder for more.

<details>
<summary>Specific hill</summary>

```graphql
{
  hill(number: 278) {
    countries {
      name
    }
    height(unit: METRES)
    name
  }
}
```

</details>

<details>
<summary>Filter: Wainwright hills of the Lake District</summary>

```graphql
{
  hills(filter: { listId: WAINWRIGHT }) {
    name
  }
}
```

</details>

## Technology

The API accepts queries described using [GraphQL](https://graphql.org/), which provides flexibility for consumers to receive only the parts of the data they require for their particular use cases. The backend for the API is implemented in JavaScript and runs on Node.js. It runs on serverless technologies by Amazon Web Services (Lambda, Aurora Serverless database), thus there are no dedicated servers to manage or pay for by the hour.

The `/docs` folder contains some more detailed technical notes, and you can of course browse the source code and run it yourself.

## License

hills-api, Copyright (C) Robat Williams

This project is [licensed](LICENSE.txt) under the terms of the [GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/) or later license.

The [Database of British and Irish Hills](http://www.hills-database.co.uk/) is used under the [Creative Commons Attribution 3.0 Unported License](http://creativecommons.org/licenses/by/3.0/deed.en_GB).
