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

🗜️ Compressed HTTP responses for speed and efficiency

👐 Free to use, no API key

There is a [list](docs/backlog.md) of possible future features.

## Endpoints

**API endpoint:** https://xxxxxxxxxx.execute-api.eu-west-1.amazonaws.com/prod/graphql

**Playground:** https://xxxxxxxxxx.execute-api.eu-west-1.amazonaws.com/prod/playground

Visit the playground in your browser to try out some queries straight away. You can copy an example query from below or from the `/examples` folder on GitHub. Use the _Schema_ and _Docs_ tabs (at the right hand edge) to browse the API's self-description of available data and querying options.

## Technology

The API accepts queries described using [GraphQL](https://graphql.org/), which provides flexibility for consumers to receive only the parts of the data they require for their particular use cases. The backend for the API is implemented in JavaScript and runs on Node.js. The API runs on serverless technologies by Amazon Web Services (Lambda, Aurora Serverless database), thus there are no dedicated servers to manage or pay for by the hour.

The `/docs` folder on GitHub contains some more detailed technical notes, and you can of course browse the source code and run it yourself.

## License

hills-api, Copyright (C) Robat Williams

This project is [licensed](LICENSE.txt) under the terms of the [GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/) or later license.

The [Database of British and Irish Hills](http://www.hills-database.co.uk/) is used under the [Creative Commons Attribution 3.0 Unported License](http://creativecommons.org/licenses/by/3.0/deed.en_GB).
